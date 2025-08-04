import OpenAI from "openai";
import {
  ParsedPowerSystemData,
  AnalysisResult,
  AnalysisResultSchema,
} from "../../../types/power-system";

// ============================================================================
// ANALYSIS GENERATOR
// ============================================================================

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSystemAnalysis(
  parsedData: ParsedPowerSystemData
): Promise<AnalysisResult> {
  try {
    const analysisPrompt = buildAnalysisPrompt(parsedData);

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

    const rawAnalysis = JSON.parse(responseText);
    return AnalysisResultSchema.parse(rawAnalysis);
  } catch (error) {
    console.error("Error generating analysis:", error);
    return generateFallbackAnalysis(parsedData);
  }
}

function buildAnalysisPrompt(parsedData: ParsedPowerSystemData): string {
  return `
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
}

export function generateFallbackAnalysis(
  parsedData: ParsedPowerSystemData
): AnalysisResult {
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

  return AnalysisResultSchema.parse(fallbackAnalysis);
}
