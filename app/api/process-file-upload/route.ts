import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import {
  ParsedPowerSystemData,
  AnalysisResult,
  ParsedPowerSystemDataSchema,
  AnalysisResultSchema,
  ProcessingResultSchema,
} from "../../../types/power-system";

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
        id: parseInt(id?.trim() || "0"),
        name: name?.replace(/'/g, "").trim() || "",
        voltage: parseFloat(voltage) || 0,
        vm: parseFloat(vm) || 0,
        va: parseFloat(va) || 0,
      });
    }
    if (section === "load" && /^[0-9]/.test(line)) {
      const [bus_id, , mw, mvar] = line.split(",");
      loads.push({
        bus_id: parseInt(bus_id?.trim() || "0"),
        mw: parseFloat(mw) || 0,
        mvar: parseFloat(mvar) || 0,
      });
    }
    if (section === "branch" && /^[0-9]/.test(line)) {
      const [from, to, , r, x] = line.split(",");
      branches.push({
        from: parseInt(from?.trim() || "0"),
        to: parseInt(to?.trim() || "0"),
        r: parseFloat(r) || 0,
        x: parseFloat(x) || 0,
      });
    }
  }

  const parsedData = {
    format: "PSS/E RAW",
    base_power,
    buses,
    loads,
    branches,
  };

  // Validate with Zod schema
  return ParsedPowerSystemDataSchema.parse(parsedData);
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
      const result = {
        success: true,
        parsedData,
        analysis,
        message: "File processed with fallback parser (no OpenAI key set)",
      };

      // Validate the complete result with Zod
      const validatedResult = ProcessingResultSchema.parse(result);
      return NextResponse.json(validatedResult);
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

    // Validate the complete result with Zod
    const validatedResult = ProcessingResultSchema.parse(result);
    return NextResponse.json(validatedResult);
  } catch (error) {
    console.error("Error processing grid data:", error);

    // If it's a Zod validation error, provide more specific error message
    if (error instanceof Error && error.message.includes("Zod")) {
      return NextResponse.json(
        { error: "Data validation failed", details: error.message },
        { status: 422 }
      );
    }

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
   - Buses (id as number, name, voltage, vm, va)
   - Loads (bus_id as number, mw, mvar)
   - Branches (from as number, to as number, r, x)
   - Generators (if any: id as number, bus_id as number, type, base MVA, inertia)
3. Output JSON only.

IMPORTANT: All IDs (bus id, bus_id, from, to) must be numbers, not strings.

Here is the file content:

"""
${fileContent}
"""

Return a JSON object with the following structure:
{
  "format": "string (e.g., 'PSS/E RAW', 'PSS/E DYR', 'CSV', 'JSON')",
  "base_power": "number (base power in MVA, omit if not found)",
  "buses": [
    {
      "id": "number",
      "name": "string",
      "voltage": "number",
      "vm": "number",
      "va": "number"
    }
  ],
  "loads": [
    {
      "bus_id": "number",
      "mw": "number",
      "mvar": "number"
    }
  ],
  "branches": [
    {
      "from": "number",
      "to": "number",
      "r": "number",
      "x": "number"
    }
  ],
  "generators": [
    {
      "id": "number",
      "bus_id": "number",
      "type": "string (optional)",
      "base_mva": "number (optional)",
      "inertia": "number (optional)"
    }
  ]
}

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
            "You are a power system expert. Parse the file and return valid JSON with the exact structure specified. Ensure all IDs are numbers.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1, // Low temperature for consistent parsing
      max_tokens: 4000,
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error("No response from OpenAI");
    }

    // Parse the JSON response and validate with Zod
    const rawData = JSON.parse(responseText);
    const parsedData = ParsedPowerSystemDataSchema.parse(rawData);
    return parsedData;
  } catch (error) {
    console.error("Error parsing file with OpenAI:", error);
    throw new Error("Failed to parse file content");
  }
}

async function generateSystemAnalysis(
  parsedData: ParsedPowerSystemData
): Promise<AnalysisResult> {
  const analysisPrompt = `
You are a power system analyst. Analyze the following power system data and provide insights:

System Data:
${JSON.stringify(parsedData, null, 2)}

Return your analysis as a JSON object with this EXACT structure:

{
  "summary": {
    "totalBuses": number,
    "totalLoads": number,
    "totalBranches": number,
    "totalGenerators": number,
    "basePower": number,
    "systemVoltageLevel": string
  },
  "loadAnalysis": {
    "totalLoadMW": number,
    "totalLoadMVAR": number,
    "peakLoadBus": {
      "busId": number,
      "loadMW": number,
      "loadMVAR": number
    },
    "loadDistribution": [
      {
        "busId": number,
        "percentageMW": number,
        "percentageMVAR": number
      }
    ]
  },
  "topology": {
    "connections": [
      {
        "fromBus": number,
        "toBus": number,
        "impedance": string
      }
    ],
    "networkType": string,
    "criticalPath": string
  },
  "recommendations": {
    "voltageRegulation": string,
    "loadBalancing": string,
    "lossReduction": string
  },
  "issues": {
    "voltageDrop": string,
    "reactivePowerSupport": string,
    "noGenerators": string
  }
}

IMPORTANT:
- All numeric values must be numbers, not strings
- All IDs must be numbers
- Follow the exact structure above
- Provide realistic analysis based on the power system data
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a power system analyst. Provide detailed analysis in the exact JSON structure specified. Return only valid JSON.",
        },
        {
          role: "user",
          content: analysisPrompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error("No analysis response from OpenAI");
    }

    // Parse the JSON response and validate with Zod
    const rawAnalysis = JSON.parse(responseText);
    const analysis = AnalysisResultSchema.parse(rawAnalysis);
    return analysis;
  } catch (error) {
    console.error("Error generating analysis:", error);
    // Return a basic analysis if AI analysis fails
    const totalLoadMW =
      parsedData.loads?.reduce((sum, load) => sum + load.mw, 0) || 0;
    const totalLoadMVAR =
      parsedData.loads?.reduce((sum, load) => sum + load.mvar, 0) || 0;

    const fallbackAnalysis = {
      summary: {
        totalBuses: parsedData.buses?.length || 0,
        totalLoads: parsedData.loads?.length || 0,
        totalBranches: parsedData.branches?.length || 0,
        totalGenerators: parsedData.generators?.length || 0,
        basePower: parsedData.base_power,
        systemVoltageLevel: "Unknown",
      },
      loadAnalysis: {
        totalLoadMW,
        totalLoadMVAR,
        peakLoadBus: parsedData.loads?.[0]
          ? {
              busId: parsedData.loads[0].bus_id,
              loadMW: parsedData.loads[0].mw,
              loadMVAR: parsedData.loads[0].mvar,
            }
          : undefined,
        loadDistribution:
          parsedData.loads?.map((load) => ({
            busId: load.bus_id,
            percentageMW: (load.mw / totalLoadMW) * 100,
            percentageMVAR: (load.mvar / totalLoadMVAR) * 100,
          })) || [],
      },
      topology: {
        connections:
          parsedData.branches?.map((branch) => ({
            fromBus: branch.from,
            toBus: branch.to,
            impedance: `${branch.r} + j${branch.x}`,
          })) || [],
        networkType: "Unknown",
        criticalPath: "Unknown",
      },
      recommendations: {
        voltageRegulation: "Consider implementing voltage regulation measures",
        loadBalancing: "Monitor and optimize load distribution",
        lossReduction: "Evaluate opportunities for reducing system losses",
      },
      issues: {
        voltageDrop: "Monitor voltage levels across the system",
        reactivePowerSupport: "Assess reactive power support requirements",
        noGenerators:
          parsedData.generators?.length === 0
            ? "No generators detected in the system"
            : undefined,
      },
    };

    // Validate the fallback analysis with Zod
    return AnalysisResultSchema.parse(fallbackAnalysis);
  }
}
