"use client";
import { useLogic } from "./hooks/useLogic";
import { useConnect } from "./hooks/useConnect";
import {
  TabNavigation,
  FileUploadArea,
  SelectedFileDisplay,
  FilePreview,
  ProcessButton,
  ResultsDisplay,
  EmptyResultsPlaceholder,
  LoadingSteps,
} from "./components";

export default function ModelParser() {
  const {
    fileData,
    pastedData,
    activeTab,
    result,
    selectedFile,
    isDragOver,
    currentStep,
    setResult,
    isProcessing,
    handleFileUpload,
    clearSelectedFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handlePastedDataChange,
    handleTabChange,
    getDataToProcess,
    hasDataToProcess,
    startProcessing,
    updateProcessingStep,
    finishProcessing,
  } = useLogic();

  const { processData } = useConnect();

  const handleProcessData = async () => {
    const dataToProcess = getDataToProcess();

    if (!dataToProcess.trim()) {
      alert("Please provide data to process");
      return;
    }

    startProcessing();

    try {
      const result = await processData(
        dataToProcess,
        activeTab,
        selectedFile,
        updateProcessingStep
      );
      setResult(result);
      console.log("Processing result:", result);
    } catch (error) {
      console.error("Error processing data:", error);
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
    <div className="font-sans grid grid-rows-[5x_1fr_5px] md:grid-rows-[0_1fr_0] items-center justify-items-center min-h-screen p-2 pb-20 gap-2 ">
      <main className="flex flex-col gap-[16px] row-start-2 items-center sm:items-start max-w-4xl w-full">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold mb-4">
            AI-Powered Grid Model Interpreter
          </h1>
          <p className="text-lg text-gray-600">
            Upload power system files (.raw, .dyr, .json, .csv) and get
            intelligent parsing and analysis using OpenAI GPT-4.
          </p>
        </div>

        {/* Data Input Section */}
        <div className="w-full bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">
            Upload Grid Model Data
          </h2>

          <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

          {/* File Upload Tab */}
          {activeTab === "upload" && (
            <div className="space-y-4">
              <FileUploadArea
                isDragOver={isDragOver}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onFileUpload={handleFileUpload}
              />

              {/* Selected File Display */}
              {selectedFile && (
                <SelectedFileDisplay
                  file={selectedFile}
                  onClear={clearSelectedFile}
                />
              )}

              {fileData && <FilePreview content={fileData} />}
            </div>
          )}

          {/* Paste Data Tab */}
          {activeTab === "paste" && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="pasted-data"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Paste your grid model data here:
                </label>
                <textarea
                  id="pasted-data"
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Paste your .raw, .dyr, .json, or .csv file content here..."
                  value={pastedData}
                  onChange={(e) => handlePastedDataChange(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Process Button */}
          <div className="mt-6">
            <ProcessButton
              isProcessing={isProcessing}
              hasData={hasDataToProcess()}
              onClick={handleProcessData}
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="w-full bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Analysis Results</h2>

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
