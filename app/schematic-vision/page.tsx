"use client";
import { useLogic } from "./hooks/useLogic";
import { useConnect } from "./hooks/useConnect";
import {
  ImageUploadArea,
  SelectedImageDisplay,
  ImagePreview,
  ProcessButton,
  ResultsDisplay,
  EmptyResultsPlaceholder,
  LoadingSteps,
} from "./components";

export default function SchematicVision() {
  const {
    selectedImage,
    isProcessing,
    result,
    isDragOver,
    currentStep,
    setResult,
    setIsProcessing,
    handleImageUpload,
    clearSelectedImage,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    startProcessing,
    updateProcessingStep,
    finishProcessing,
  } = useLogic();

  const { processImage } = useConnect();

  const handleProcessImage = async () => {
    if (!selectedImage) {
      alert("Please upload an image to process");
      return;
    }

    startProcessing();

    try {
      const result = await processImage(selectedImage, updateProcessingStep);
      setResult(result);
      console.log("Processing result:", result);
    } catch (error) {
      console.error("Error processing image:", error);
      setResult({
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      finishProcessing();
    }
  };

  return (
    <div className="font-sans grid grid-rows-[5px_1fr_5px] md:grid-rows-[0_1fr_0] items-center justify-items-center min-h-screen p-2 pb-20 gap-2">
      <main className="flex flex-col gap-[16px] row-start-2 items-center sm:items-start max-w-4xl w-full">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold mb-4">
            Schematic Vision - Single-Line Diagram Analyzer
          </h1>
          <p className="text-lg text-gray-600">
            Upload an image of a single-line diagram (SLD) and get intelligent
            data extraction using OpenAI's vision capabilities.
          </p>
        </div>

        {/* Image Upload Section */}
        <div className="w-full bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">
            Upload Single-Line Diagram
          </h2>

          <div className="space-y-4">
            <ImageUploadArea
              isDragOver={isDragOver}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onImageUpload={handleImageUpload}
            />

            {/* Selected Image Display */}
            {selectedImage && (
              <SelectedImageDisplay
                image={selectedImage}
                onClear={clearSelectedImage}
              />
            )}

            {selectedImage && <ImagePreview image={selectedImage} />}
          </div>

          {/* Process Button */}
          <div className="mt-6">
            <ProcessButton
              isProcessing={isProcessing}
              hasData={!!selectedImage}
              onClick={handleProcessImage}
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="w-full bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Extracted Data</h2>

          {isProcessing ? (
            <LoadingSteps currentStep={currentStep} />
          ) : result ? (
            <ResultsDisplay result={result} />
          ) : (
            <EmptyResultsPlaceholder />
          )}
        </div>
      </main>
    </div>
  );
}
