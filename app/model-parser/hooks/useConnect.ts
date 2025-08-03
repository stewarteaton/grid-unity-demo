import { ProcessingResult } from "../../../types/power-system";

export const useConnect = () => {
  const processData = async (
    dataToProcess: string,
    activeTab: "upload" | "paste",
    selectedFile: File | null,
    onStepUpdate?: (step: number) => void
  ): Promise<ProcessingResult> => {
    try {
      // Simulate processing steps
      const steps = [
        "Analyzing file format and structure...",
        "Parsing power system components...",
        "Extracting bus, load, and generator data...",
        "Running AI analysis on system topology...",
        "Generating recommendations and insights...",
        "Finalizing results...",
      ];

      // Update steps with delays to simulate processing
      for (let i = 0; i < steps.length; i++) {
        onStepUpdate?.(i);
        // Add small delays between steps to show progress
        if (i < steps.length - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, 800 + Math.random() * 400)
          );
        }
      }

      const response = await fetch("/api/process-file-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: dataToProcess,
          fileType: activeTab === "upload" ? "file" : "pasted",
          fileName: selectedFile?.name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process data");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error processing data:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  };

  return {
    processData,
  };
};
