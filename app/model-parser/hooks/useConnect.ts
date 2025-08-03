import { ProcessingResult } from "../../../types/power-system";

export const useConnect = () => {
  const processData = async (
    dataToProcess: string,
    activeTab: "upload" | "paste",
    selectedFile: File | null
  ): Promise<ProcessingResult> => {
    try {
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
