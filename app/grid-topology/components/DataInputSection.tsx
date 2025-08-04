import { ActiveTab, DemoFormat } from "../types";

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
              Select a format and click "Process Data" to load sample
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Paste your GeoJSON, JSON, or custom topology data here..."
              value={pastedData}
              onChange={(e) => setPastedData(e.target.value)}
            />
          </div>
        </div>
      )}

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
