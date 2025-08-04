import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { image, filename } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const prompt = `Analyze this single-line diagram (SLD) image and extract the following information in JSON format:

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

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
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
      return NextResponse.json(
        { error: "No response from OpenAI" },
        { status: 500 }
      );
    }

    // Try to extract JSON from the response
    let jsonData;
    try {
      // Look for JSON in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonData = JSON.parse(jsonMatch[0]);
      } else {
        // If no JSON found, create a structured response
        jsonData = {
          raw_response: content,
          extracted_data: {
            message: "Response received but no structured JSON found",
            content: content,
          },
        };
      }
    } catch (parseError) {
      // If JSON parsing fails, return the raw response
      jsonData = {
        raw_response: content,
        parsing_error: "Failed to parse JSON from response",
        content: content,
      };
    }

    return NextResponse.json({
      success: true,
      data: jsonData,
      filename: filename,
    });
  } catch (error) {
    console.error("Error processing schematic:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
