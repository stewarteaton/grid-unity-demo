import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ParsedPowerSystemData } from "../../../types/power-system";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Add fallback parser for .raw files
function fallbackParseRaw(fileContent: string): ParsedPowerSystemData {
  const basePowerMatch = fileContent.match(/([0-9.]+).*MVA base/);
  const base_power = basePowerMatch ? parseFloat(basePowerMatch[1]) : undefined;

  const buses: any[] = [];
  const loads: any[] = [];
  const branches: any[] = [];

  let section = "";
  for (const line of fileContent.split("\n")) {
    if (line.includes("BEGIN BUS")) section = "bus";
    else if (line.includes("END BUS")) section = "";
    else if (line.includes("BEGIN LOAD")) section = "load";
    else if (line.includes("END LOAD")) section = "";
    else if (line.includes("BEGIN BRANCH")) section = "branch";
    else if (line.includes("END BRANCH")) section = "";

    if (section === "bus" && /^[0-9]/.test(line)) {
      const [id, name, voltage, , , , , vm, va] = line.split(",");
      buses.push({
        id: id?.trim(),
        name: name?.replace(/'/g, "").trim(),
        voltage: parseFloat(voltage),
        vm: parseFloat(vm),
        va: parseFloat(va),
      });
    }
    if (section === "load" && /^[0-9]/.test(line)) {
      const [bus_id, , mw, mvar] = line.split(",");
      loads.push({
        bus_id: bus_id?.trim(),
        mw: parseFloat(mw),
        mvar: parseFloat(mvar),
      });
    }
    if (section === "branch" && /^[0-9]/.test(line)) {
      const [from, to, , r, x] = line.split(",");
      branches.push({
        from: from?.trim(),
        to: to?.trim(),
        r: parseFloat(r),
        x: parseFloat(x),
      });
    }
  }

  return {
    format: "PSS/E RAW format",
    base_power,
    buses,
    loads,
    branches,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { data, fileType, fileName } = await request.json();

    // Check if we have the required data
    if (!data) {
      return NextResponse.json(
        { error: "No file data provided" },
        { status: 400 }
      );
    }

    // Fallback: If no OpenAI API key, use fallback parser
    if (!process.env.OPENAI_API_KEY) {
      console.log("No OpenAI API key set, using fallback parser");
      const parsedData = fallbackParseRaw(data);
      const analysis = await generateSystemAnalysis(parsedData);
      return NextResponse.json({
        success: true,
        parsedData,
        analysis,
        message: "File processed with fallback parser (no OpenAI key set)",
      });
    }

    // Parse the file content using OpenAI
    const parsedData = await parsePowerSystemFile(data, fileName);
    console.log({ parsedData });

    // Generate analysis and recommendations
    const analysis = await generateSystemAnalysis(parsedData);
    console.log({ analysis });

    const result = {
      success: true,
      parsedData,
      analysis,
      message: "File processed successfully using AI analysis",
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing grid data:", error);
    return NextResponse.json(
      { error: "Failed to process data" },
      { status: 500 }
    );
  }
}

async function parsePowerSystemFile(
  fileContent: string,
  fileName?: string
): Promise<ParsedPowerSystemData> {
  const prompt = `
You are an expert parser for power system model files.

The user has uploaded a file${
    fileName ? ` named "${fileName}"` : ""
  }. It may be in one of these formats:
- .raw (PSS/E format: defines buses, loads, branches, base MVA)
- .dyr (defines generator and dynamic parameters)
- .csv or .json (tabular or structured format)

Your job is to:
1. Identify the file format.
2. Extract key parameters like:
   - Base power (MVA)
   - Buses (id, name, voltage, vm, va)
   - Loads (bus_id, mw, mvar)
   - Branches (from, to, r, x)
   - Generators (if any: id, bus_id, type, base MVA, inertia)
3. Output JSON only.

Here is the file content:

"""
${fileContent}
"""

Return JSON with top-level keys: format, base_power, buses, loads, branches, generators.
If a section is not present in the file, omit that key from the JSON response.
Ensure all numeric values are properly parsed as numbers, not strings.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a power system expert. Always respond with valid JSON only, no additional text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1, // Low temperature for consistent parsing
      max_tokens: 4000,
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error("No response from OpenAI");
    }

    // Remove markdown code block if present
    const cleaned = responseText.replace(/^```json|^```|```$/gm, "").trim();
    const parsedData: ParsedPowerSystemData = JSON.parse(cleaned);
    return parsedData;
  } catch (error) {
    console.error("Error parsing file with OpenAI:", error);
    throw new Error("Failed to parse file content");
  }
}

async function generateSystemAnalysis(
  parsedData: ParsedPowerSystemData
): Promise<any> {
  const analysisPrompt = `
You are a power system analyst. Analyze the following power system data and provide insights:

System Data:
${JSON.stringify(parsedData, null, 2)}

Please provide analysis including:
1. System summary (total buses, loads, branches, generators)
2. Load analysis (total load, peak load, load distribution)
3. Network topology insights
4. Recommendations for system optimization
5. Potential issues or areas of concern

Return your analysis as JSON with keys: summary, loadAnalysis, topology, recommendations, issues.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a power system analyst. Provide detailed analysis in JSON format.",
        },
        {
          role: "user",
          content: analysisPrompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error("No analysis response from OpenAI");
    }

    // Remove markdown code block if present
    const cleaned = responseText.replace(/^```json|^```|```$/gm, "").trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Error generating analysis:", error);
    // Return a basic analysis if AI analysis fails
    return {
      summary: {
        totalBuses: parsedData.buses?.length || 0,
        totalLoads: parsedData.loads?.length || 0,
        totalBranches: parsedData.branches?.length || 0,
        totalGenerators: parsedData.generators?.length || 0,
      },
      loadAnalysis: {
        totalLoad:
          parsedData.loads?.reduce((sum, load) => sum + load.mw, 0) || 0,
        message: "Basic load analysis available",
      },
      recommendations: [
        "Consider implementing advanced monitoring systems",
        "Review load distribution for optimization opportunities",
      ],
    };
  }
}
