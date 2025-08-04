import { ProcessingResult } from "./useLogic";
import { ProcessingStep } from "../../../components";

export function useConnect() {
  const processImage = async (
    imageFile: File,
    updateStep: (step: ProcessingStep) => void
  ): Promise<ProcessingResult> => {
    try {
      updateStep({ step: 1, message: "Converting image to base64..." });

      // Convert image to base64
      const base64 = await fileToBase64(imageFile);

      updateStep({ step: 2, message: "Sending to OpenAI for analysis..." });

      // Call the API endpoint
      const response = await fetch("/api/process-schematic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64,
          filename: imageFile.name,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      updateStep({ step: 3, message: "Processing results..." });

      const result = await response.json();

      updateStep({ step: 4, message: "Analysis complete!" });

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      console.error("Error processing image:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  return {
    processImage,
  };
}
