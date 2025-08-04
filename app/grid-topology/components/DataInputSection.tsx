import { ActiveTab, DemoFormat } from "../types";
import { useState } from "react";
import { mockGeoJSONData } from "../mock-data/GeoJSON";
import { mockPSLFData, mockOpenDSSData } from "../mock-data";

interface DataInputSectionProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  demoFormat: DemoFormat;
  setDemoFormat: (format: DemoFormat) => void;
  pastedData: string;
  setPastedData: (data: string) => void;
  isProcessing: boolean;
  onProcessData: () => void;
}

export const DataInputSection = ({
  activeTab,
  setActiveTab,
  demoFormat,
  setDemoFormat,
  pastedData,
  setPastedData,
  isProcessing,
  onProcessData,
}: DataInputSectionProps) => {
  const [showPreview, setShowPreview] = useState(false);

  // Get preview data based on current state
  const getPreviewData = () => {
    if (activeTab === "demo") {
      switch (demoFormat) {
        case "PSLF":
          return mockPSLFData;
        case "OpenDSS":
          return mockOpenDSSData;
        case "GeoJSON":
        default:
          return JSON.stringify(mockGeoJSONData, null, 2);
      }
    } else {
      return pastedData || "No data pasted yet...";
    }
  };

  const formatData = (data: string) => {
    try {
      // Try to parse as JSON and format it
      const parsed = JSON.parse(data);
      return JSON.stringify(parsed, null, 2);
    } catch {
      // If not JSON, return as is
      return data;
    }
  };

  const isJsonData = (data: string) => {
    try {
      JSON.parse(data);
      return true;
    } catch {
      return false;
    }
  };

  const getLanguageClass = () => {
    const data = getPreviewData();
    if (isJsonData(data)) return "language-json";
    if (data.includes("C PSLF")) return "language-text";
    if (data.includes("New Circuit")) return "language-text";
    return "language-text";
  };

  const getDataStats = () => {
    if (activeTab === "demo") {
      switch (demoFormat) {
        case "GeoJSON":
          const geoJson = mockGeoJSONData;
          return {
            substations: geoJson.features.filter(
              (f) => f.geometry.type === "Point"
            ).length,
            lines: geoJson.features.filter(
              (f) => f.geometry.type === "LineString"
            ).length,
            format: "GeoJSON",
          };
        case "PSLF":
          // Count actual transmission lines (not transformers)
          const pslfLines = mockPSLFData.split("\n");
          let inTransmissionSection = false;
          let transmissionLineCount = 0;

          pslfLines.forEach((line) => {
            const trimmedLine = line.trim();

            if (trimmedLine.includes("Transmission Line Data")) {
              inTransmissionSection = true;
            } else if (
              trimmedLine.includes("Transformer Data") ||
              trimmedLine.includes("Area Data") ||
              trimmedLine.includes("Zone Data") ||
              trimmedLine.includes("End of PSLF")
            ) {
              inTransmissionSection = false;
            } else if (
              inTransmissionSection &&
              trimmedLine.startsWith("C") &&
              !trimmedLine.includes("FromBus") &&
              !trimmedLine.includes("ToBus") &&
              trimmedLine.length > 10
            ) {
              transmissionLineCount++;
            }
          });

          const busLines = mockPSLFData
            .split("\n")
            .filter(
              (line) =>
                line.trim().startsWith("C") &&
                line.includes("Bus#") === false &&
                line.includes("Type") === false &&
                line.includes("Area") === false &&
                line.includes("Zone") === false &&
                line.includes("Transmission Line Data") === false &&
                line.includes("Generator Data") === false &&
                line.includes("Load Data") === false &&
                line.includes("Transformer Data") === false &&
                line.includes("End of PSLF") === false &&
                line.trim().length > 10 &&
                /^\s*C\s+\d+\s+\d+\s+\d+\s+\d+\s+\w+/.test(line)
            );
          return {
            substations: busLines.length,
            lines: transmissionLineCount,
            format: "PSLF",
          };
        case "OpenDSS":
          const openDssLines = mockOpenDSSData
            .split("\n")
            .filter(
              (line) => line.trim().startsWith("Line.") && !line.includes("!")
            );
          const openDssBuses = mockOpenDSSData
            .split("\n")
            .filter(
              (line) => line.trim().startsWith("Bus.") && !line.includes("!")
            );
          return {
            substations: openDssBuses.length,
            lines: openDssLines.length,
            format: "OpenDSS",
          };
        default:
          return { substations: 0, lines: 0, format: "Unknown" };
      }
    } else {
      return {
        substations: 0,
        lines: 0,
        format: isJsonData(pastedData) ? "JSON" : "Text",
      };
    }
  };

  const stats = getDataStats();

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4">Upload Topology Data</h2>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("demo")}
          className={`px-4 py-2 font-medium ${
            activeTab === "demo"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Demo Data
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

      {/* Demo Data Tab */}
      {activeTab === "demo" && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">
              Demo Data Available
            </h3>
            <p className="text-sm text-blue-800 mb-4">
              Select a format and click &quot;Process Data&quot; to load sample
              transmission network data and see the visualization in action.
            </p>

            {/* Format Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Demo Format:
              </label>
              <select
                value={demoFormat}
                onChange={(e) => setDemoFormat(e.target.value as DemoFormat)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="GeoJSON">
                  GeoJSON (Geographic JSON format)
                </option>
                <option value="PSLF">PSLF (Power System Load Flow)</option>
                <option value="OpenDSS">
                  OpenDSS (Open Distribution System Simulator)
                </option>
              </select>
            </div>

            {/* Data Stats */}
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded p-2 text-center">
                <div className="font-semibold text-blue-600">
                  {stats.substations}
                </div>
                <div className="text-gray-600">Substations</div>
              </div>
              <div className="bg-white rounded p-2 text-center">
                <div className="font-semibold text-green-600">
                  {stats.lines}
                </div>
                <div className="text-gray-600">Lines</div>
              </div>
              <div className="bg-white rounded p-2 text-center">
                <div className="font-semibold text-purple-600">
                  {stats.format}
                </div>
                <div className="text-gray-600">Format</div>
              </div>
            </div>
          </div>
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
              Paste your topology data here:
            </label>
            <textarea
              id="pasted-data"
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              placeholder="Paste your GeoJSON, JSON, or custom topology data here..."
              value={pastedData}
              onChange={(e) => setPastedData(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Data Preview Section */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-900">Data Preview</h3>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg
              className={`w-4 h-4 transition-transform ${
                showPreview ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
            <span>{showPreview ? "Hide" : "Show"} Preview</span>
          </button>
        </div>

        {showPreview && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {activeTab === "demo" ? "Demo" : "Pasted"} Data Preview
              </span>
              <span className="text-xs text-gray-500">
                {getPreviewData().length} characters
              </span>
            </div>
            <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
              <pre className="p-4 text-sm overflow-x-auto max-h-64 overflow-y-auto">
                <code className={getLanguageClass()}>
                  {formatData(getPreviewData())}
                </code>
              </pre>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {activeTab === "demo" && (
                <span>
                  Format: <span className="font-medium">{stats.format}</span> •
                  Substations:{" "}
                  <span className="font-medium">{stats.substations}</span> •
                  Lines: <span className="font-medium">{stats.lines}</span>
                </span>
              )}
              {activeTab === "paste" && (
                <span>
                  {isJsonData(pastedData) ? "Valid JSON" : "Text format"}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Process Button */}
      <div className="mt-6">
        <button
          onClick={onProcessData}
          disabled={isProcessing}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            isProcessing
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
              Processing...
            </div>
          ) : (
            "Process Topology Data"
          )}
        </button>
      </div>
    </div>
  );
};
