import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Types
interface SchematicRequest {
  image: string;
  filename?: string;
}

interface SchematicResponse {
  success: boolean;
  data: SchematicAnalysisData;
  filename?: string;
}

interface SchematicAnalysisData {
  raw_response?: string;
  extracted_data?: {
    message: string;
    content: string;
  };
  parsing_error?: string;
  content?: string;
  [key: string]: unknown;
}

interface ErrorResponse {
  error: string;
}

// Constants
const ANALYSIS_PROMPT = `Analyze this single-line diagram (SLD) image and extract the following information in JSON format:

1. **System Overview**:
   - Total number of buses
   - Voltage levels present
   - System type (radial, loop, network, etc.)

2. **Components Identified**:
   - Generators (with ratings, voltage, location)
   - Transformers (with ratings, primary/secondary voltages, connections)
   - Loads (with ratings, location)
   - Circuit breakers and switches
   - Capacitors and reactors
   - Any other electrical equipment

3. **Connections**:
   - Bus-to-bus connections
   - Component connections
   - Line impedances if shown

4. **System Data**:
   - Base MVA if specified
   - Frequency (typically 50 or 60 Hz)
   - Any control systems or protection devices

5. **Topology**:
   - Bus numbering scheme
   - Substation layout
   - Connection patterns

Please provide the response as a well-structured JSON object with clear sections for each category. Include all visible text, symbols, and numerical values from the diagram. If any information is unclear or not visible, note it as "not specified" or "unclear".

Focus on electrical power system components and their relationships.`;

// OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Validation functions
function validateRequest(body: unknown): body is SchematicRequest {
  return (
    typeof body === "object" &&
    body !== null &&
    typeof (body as SchematicRequest).image === "string" &&
    (body as SchematicRequest).image.length > 0
  );
}

function validateEnvironment(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

// JSON parsing utilities
function extractJsonFromResponse(content: string): SchematicAnalysisData {
  try {
    // Look for JSON in the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // If no JSON found, create a structured response
    return {
      raw_response: content,
      extracted_data: {
        message: "Response received but no structured JSON found",
        content: content,
      },
    };
  } catch {
    // If JSON parsing fails, return the raw response
    return {
      raw_response: content,
      parsing_error: "Failed to parse JSON from response",
      content: content,
    };
  }
}

// OpenAI API call
async function analyzeSchematic(image: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: ANALYSIS_PROMPT,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${image}`,
            },
          },
        ],
      },
    ],
    max_tokens: 4000,
    temperature: 0.1,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  return content;
}

// Main handler
export async function POST(
  request: NextRequest
): Promise<NextResponse<SchematicResponse | ErrorResponse>> {
  try {
    // Parse and validate request
    const body = await request.json();

    if (!validateRequest(body)) {
      return NextResponse.json(
        { error: "Invalid request: image is required" },
        { status: 400 }
      );
    }

    // Validate environment
    if (!validateEnvironment()) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Analyze schematic
    const analysisContent = await analyzeSchematic(body.image);
    console.log({ analysisContent });

    // Parse response
    const jsonData = extractJsonFromResponse(analysisContent);
    console.log({ jsonData });

    return NextResponse.json({
      success: true,
      data: jsonData,
      filename: body.filename,
    });
  } catch (error) {
    console.error("Error processing schematic:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
