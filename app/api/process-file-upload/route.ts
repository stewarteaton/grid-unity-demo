import { NextRequest, NextResponse } from "next/server";
import {
  ParsedPowerSystemData,
  AnalysisResult,
  ProcessingResultSchema,
} from "../../../types/power-system";
import { parseRaw } from "./fallback-parser";
import { parsePowerSystemFile } from "./ai-parser";
import {
  generateSystemAnalysis,
  generateFallbackAnalysis,
} from "./analysis-generator";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ProcessingRequest {
  data: string;
  fileType?: string;
  fileName?: string;
}

interface ProcessingResponse {
  success: boolean;
  parsedData: ParsedPowerSystemData;
  analysis: AnalysisResult;
  message: string;
}

// ============================================================================
// MAIN PROCESSING LOGIC
// ============================================================================

async function processFile(
  request: ProcessingRequest
): Promise<ProcessingResponse> {
  const { data, fileName } = request;

  if (!data) {
    throw new Error("No file data provided");
  }

  // Use fallback parser if no OpenAI API key is available
  if (!process.env.OPENAI_API_KEY) {
    console.log("No OpenAI API key set, using fallback parser");
    const parsedData = parseRaw(data);
    const analysis = generateFallbackAnalysis(parsedData);

    return {
      success: true,
      parsedData,
      analysis,
      message: "File processed with fallback parser (no OpenAI key set)",
    };
  }

  // Use AI-based parser
  const parsedData = await parsePowerSystemFile(data, fileName);
  console.log({ parsedData });
  const analysis = await generateSystemAnalysis(parsedData);
  console.log({ analysis });
  
  return {
    success: true,
    parsedData,
    analysis,
    message: "File processed successfully using AI analysis",
  };
}

// ============================================================================
// API ROUTE HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const requestData: ProcessingRequest = await request.json();
    const result = await processFile(requestData);

    // Validate the complete result with Zod
    const validatedResult = ProcessingResultSchema.parse(result);
    return NextResponse.json(validatedResult);
  } catch (error) {
    console.error("Error processing grid data:", error);

    // Handle different types of errors
    if (error instanceof Error && error.message.includes("Zod")) {
      return NextResponse.json(
        { error: "Data validation failed", details: error.message },
        { status: 422 }
      );
    }

    if (error instanceof Error && error.message === "No file data provided") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to process data" },
      { status: 500 }
    );
  }
}
