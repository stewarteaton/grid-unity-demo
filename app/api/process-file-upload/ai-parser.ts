import OpenAI from "openai";
import {
  ParsedPowerSystemData,
  ParsedPowerSystemDataSchema,
} from "../../../types/power-system";

// ============================================================================
// AI-BASED PARSER
// ============================================================================

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function parsePowerSystemFile(
  fileContent: string,
  fileName?: string
): Promise<ParsedPowerSystemData> {
  const prompt = buildParsingPrompt(fileContent, fileName);

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
      temperature: 0.1,
      max_tokens: 4000,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error("No response from OpenAI");
    }

    const rawData = JSON.parse(responseText);
    return ParsedPowerSystemDataSchema.parse(rawData);
  } catch (error) {
    console.error("Error parsing file with OpenAI:", error);
    throw new Error("Failed to parse file content");
  }
}

function buildParsingPrompt(fileContent: string, fileName?: string): string {
  return `
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
}
