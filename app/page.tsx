"use client";
import Image from "next/image";
import { useState } from "react";
import {
  ParsedPowerSystemData,
  AnalysisResult,
  ProcessingResult,
} from "../types/power-system";

export default function Home() {
  const [fileData, setFileData] = useState<string>("");
  const [pastedData, setPastedData] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "paste">("upload");
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileData(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileData(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleProcessData = async () => {
    const dataToProcess = activeTab === "upload" ? fileData : pastedData;

    if (!dataToProcess.trim()) {
      alert("Please provide data to process");
      return;
    }

    setIsProcessing(true);
    setResult(null);

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
      setIsProcessing(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-4 ">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start max-w-4xl w-full">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold mb-4">
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

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-4 py-2 font-medium ${
                activeTab === "upload"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              File Upload
            </button>
            <button
              onClick={() => setActiveTab("paste")}
              className={`px-4 py-2 font-medium ${
                activeTab === "paste"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Paste Data
            </button>
          </div>

          {/* File Upload Tab */}
          {activeTab === "upload" && (
            <div className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragOver
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".raw,.dyr,.txt,.json,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="space-y-2">
                    <svg
                      className={`mx-auto h-12 w-12 ${
                        isDragOver ? "text-blue-400" : "text-gray-400"
                      }`}
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div
                      className={`${
                        isDragOver ? "text-blue-600" : "text-gray-600"
                      }`}
                    >
                      <span className="font-medium">
                        {isDragOver ? "Drop files here" : "Click to upload"}
                      </span>
                      {!isDragOver && " or drag and drop"}
                    </div>
                    <p className="text-xs text-gray-500">
                      Supports .raw, .dyr, .json, .csv, and .txt files
                    </p>
                  </div>
                </label>
              </div>

              {fileData && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    File Content Preview:
                  </h3>
                  <div className="bg-white border rounded-lg p-3 max-h-40 overflow-y-auto">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {fileData.substring(0, 500)}...
                    </pre>
                  </div>
                </div>
              )}
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
                  onChange={(e) => setPastedData(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Process Button */}
          <div className="mt-6">
            <button
              onClick={handleProcessData}
              disabled={isProcessing || (!fileData && !pastedData)}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                isProcessing || (!fileData && !pastedData)
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing with AI...
                </div>
              ) : (
                "Process Data with AI Analysis"
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="w-full bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Analysis Results</h2>

            {result.success ? (
              <div className="space-y-6">
                {/* Success Message */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex">
                    <svg
                      className="h-5 w-5 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        {result.message || "File processed successfully"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Parsed Data */}
                {result.parsedData && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Parsed Data</h3>

                    {/* Format and Base Power */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          File Format
                        </h4>
                        <p className="text-sm text-gray-600">
                          {result.parsedData.format}
                        </p>
                      </div>
                      {result.parsedData.base_power && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Base Power
                          </h4>
                          <p className="text-sm text-gray-600">
                            {result.parsedData.base_power} MVA
                          </p>
                        </div>
                      )}
                    </div>

                    {/* System Components */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {result.parsedData.buses && (
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="font-medium text-blue-900 mb-2">
                            Buses
                          </h4>
                          <p className="text-2xl font-bold text-blue-600">
                            {result.parsedData.buses.length}
                          </p>
                        </div>
                      )}
                      {result.parsedData.loads && (
                        <div className="bg-green-50 rounded-lg p-4">
                          <h4 className="font-medium text-green-900 mb-2">
                            Loads
                          </h4>
                          <p className="text-2xl font-bold text-green-600">
                            {result.parsedData.loads.length}
                          </p>
                        </div>
                      )}
                      {result.parsedData.branches && (
                        <div className="bg-yellow-50 rounded-lg p-4">
                          <h4 className="font-medium text-yellow-900 mb-2">
                            Branches
                          </h4>
                          <p className="text-2xl font-bold text-yellow-600">
                            {result.parsedData.branches.length}
                          </p>
                        </div>
                      )}
                      {result.parsedData.generators && (
                        <div className="bg-purple-50 rounded-lg p-4">
                          <h4 className="font-medium text-purple-900 mb-2">
                            Generators
                          </h4>
                          <p className="text-2xl font-bold text-purple-600">
                            {result.parsedData.generators.length}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Detailed Data Tables */}
                    {result.parsedData.loads &&
                      result.parsedData.loads.length > 0 && (
                        <div className="bg-white border rounded-lg overflow-hidden">
                          <div className="px-4 py-3 border-b bg-gray-50">
                            <h4 className="font-medium text-gray-900">
                              Load Details
                            </h4>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                    Bus ID
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                    MW
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                    MVAR
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {result.parsedData.loads
                                  .slice(0, 5)
                                  .map((load, index) => (
                                    <tr key={index}>
                                      <td className="px-4 py-2 text-sm text-gray-900">
                                        {load.bus_id}
                                      </td>
                                      <td className="px-4 py-2 text-sm text-gray-900">
                                        {formatNumber(load.mw)}
                                      </td>
                                      <td className="px-4 py-2 text-sm text-gray-900">
                                        {formatNumber(load.mvar)}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                  </div>
                )}

                {/* AI Analysis */}
                {result.analysis && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">AI Analysis</h3>

                    {/* Summary */}
                    {result.analysis.summary && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          System Summary
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          {result.analysis.summary.totalBuses !== undefined && (
                            <div>
                              <span className="text-gray-600">
                                Total Buses:
                              </span>
                              <span className="ml-2 font-medium">
                                {result.analysis.summary.totalBuses}
                              </span>
                            </div>
                          )}
                          {result.analysis.summary.totalLoads !== undefined && (
                            <div>
                              <span className="text-gray-600">
                                Total Loads:
                              </span>
                              <span className="ml-2 font-medium">
                                {result.analysis.summary.totalLoads}
                              </span>
                            </div>
                          )}
                          {result.analysis.summary.totalBranches !==
                            undefined && (
                            <div>
                              <span className="text-gray-600">
                                Total Branches:
                              </span>
                              <span className="ml-2 font-medium">
                                {result.analysis.summary.totalBranches}
                              </span>
                            </div>
                          )}
                          {result.analysis.summary.totalGenerators !==
                            undefined && (
                            <div>
                              <span className="text-gray-600">
                                Total Generators:
                              </span>
                              <span className="ml-2 font-medium">
                                {result.analysis.summary.totalGenerators}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Load Analysis */}
                    {result.analysis.loadAnalysis && (
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">
                          Load Analysis
                        </h4>
                        {result.analysis.loadAnalysis.totalLoad && (
                          <p className="text-sm text-blue-800 mb-2">
                            Total Load:{" "}
                            {formatNumber(
                              result.analysis.loadAnalysis.totalLoad
                            )}{" "}
                            MW
                          </p>
                        )}
                        {result.analysis.loadAnalysis.message && (
                          <p className="text-sm text-blue-800">
                            {result.analysis.loadAnalysis.message}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Recommendations */}
                    {result.analysis.recommendations &&
                      result.analysis.recommendations.length > 0 && (
                        <div className="bg-yellow-50 rounded-lg p-4">
                          <h4 className="font-medium text-yellow-900 mb-2">
                            Recommendations
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
                            {result.analysis.recommendations.map(
                              (rec, index) => (
                                <li key={index}>{rec}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    {/* Issues */}
                    {result.analysis.issues &&
                      result.analysis.issues.length > 0 && (
                        <div className="bg-red-50 rounded-lg p-4">
                          <h4 className="font-medium text-red-900 mb-2">
                            Potential Issues
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-red-800">
                            {result.analysis.issues.map((issue, index) => (
                              <li key={index}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                )}
              </div>
            ) : (
              /* Error State */
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <svg
                    className="h-5 w-5 text-red-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Processing Error
                    </h3>
                    <p className="text-sm text-red-700 mt-1">{result.error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Placeholder when no results */}
        {!result && (
          <div className="w-full bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Analysis Results</h2>
            <div className="text-center text-gray-500 py-8">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <p>
                Upload and process data to see AI-powered analysis results here
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
