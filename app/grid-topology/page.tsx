"use client";
import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { mockGeoJSONData } from "./mock-data/GeoJSON";

// Dynamically import ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
  loading: () => <div>Loading visualization...</div>,
});

interface Substation {
  id: string;
  name: string;
  voltage?: number;
  coordinates?: [number, number];
}

interface TransmissionLine {
  id: string;
  from: string;
  to: string;
  voltage?: number;
  lineType?: string;
}

interface ParsedTopology {
  substations: Substation[];
  lines: TransmissionLine[];
  graphData: {
    nodes: Array<{
      id: string;
      name: string;
      voltage?: number;
      x?: number;
      y?: number;
      type: "substation";
    }>;
    links: Array<{
      id: string;
      source: string;
      target: string;
      voltage?: number;
      lineType?: string;
    }>;
  };
}

export default function GridTopologyExplorer() {
  const [fileData, setFileData] = useState<string>("");
  const [pastedData, setPastedData] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"upload" | "paste" | "demo">(
    "demo"
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedTopology, setParsedTopology] = useState<ParsedTopology | null>(
    null
  );
  const [hoveredNode, setHoveredNode] = useState<any>(null);
  const [hoveredLink, setHoveredLink] = useState<any>(null);
  const graphRef = useRef<any>(null);

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

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setFileData("");
    const fileInput = document.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
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

  const parseTopologyData = (data: string): ParsedTopology => {
    try {
      const jsonData = JSON.parse(data);

      // Handle GeoJSON format
      if (jsonData.type === "FeatureCollection") {
        const substations: Substation[] = [];
        const lines: TransmissionLine[] = [];
        const nodes: any[] = [];
        const links: any[] = [];

        jsonData.features.forEach((feature: any, index: number) => {
          if (feature.geometry.type === "Point") {
            // Substation
            const substation: Substation = {
              id: feature.properties.id || `substation_${index}`,
              name: feature.properties.name || `Substation ${index}`,
              voltage: feature.properties.voltage,
              coordinates: feature.geometry.coordinates,
            };
            substations.push(substation);

            nodes.push({
              id: substation.id,
              name: substation.name,
              voltage: substation.voltage,
              x: substation.coordinates?.[0],
              y: substation.coordinates?.[1],
              type: "substation",
            });
          } else if (feature.geometry.type === "LineString") {
            // Transmission line
            const line: TransmissionLine = {
              id: feature.properties.id || `line_${index}`,
              from: feature.properties.from,
              to: feature.properties.to,
              voltage: feature.properties.voltage,
              lineType: feature.properties.lineType,
            };
            lines.push(line);

            links.push({
              id: line.id,
              source: line.from,
              target: line.to,
              voltage: line.voltage,
              lineType: line.lineType,
            });
          }
        });

        return {
          substations,
          lines,
          graphData: { nodes, links },
        };
      }

      // Handle custom format
      if (jsonData.substations && jsonData.lines) {
        const nodes = jsonData.substations.map((sub: any) => ({
          id: sub.id,
          name: sub.name,
          voltage: sub.voltage,
          x: sub.coordinates?.[0],
          y: sub.coordinates?.[1],
          type: "substation",
        }));

        const links = jsonData.lines.map((line: any) => ({
          id: line.id,
          source: line.from,
          target: line.to,
          voltage: line.voltage,
          lineType: line.lineType,
        }));

        return {
          substations: jsonData.substations,
          lines: jsonData.lines,
          graphData: { nodes, links },
        };
      }

      throw new Error("Unsupported data format");
    } catch (error) {
      console.error("Error parsing topology data:", error);
      throw new Error("Failed to parse topology data");
    }
  };

  const handleProcessData = async () => {
    const dataToProcess =
      activeTab === "upload"
        ? fileData
        : activeTab === "paste"
        ? pastedData
        : JSON.stringify(mockGeoJSONData);

    if (!dataToProcess.trim()) {
      alert("Please provide data to process");
      return;
    }

    setIsProcessing(true);
    setParsedTopology(null);

    try {
      const result = parseTopologyData(dataToProcess);
      setParsedTopology(result);
      console.log("Parsed topology:", result);
    } catch (error) {
      console.error("Error processing data:", error);
      alert(error instanceof Error ? error.message : "Unknown error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNodeHover = useCallback((node: any) => {
    setHoveredNode(node);
  }, []);

  const handleLinkHover = useCallback((link: any) => {
    setHoveredLink(link);
  }, []);

  const handleNodeClick = useCallback((node: any) => {
    console.log("Clicked node:", node);
  }, []);

  const handleLinkClick = useCallback((link: any) => {
    console.log("Clicked link:", link);
  }, []);

  const exportGraphData = () => {
    if (!parsedTopology) return;

    const dataStr = JSON.stringify(parsedTopology, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "grid-topology-data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getVoltageColor = (voltage?: number) => {
    if (!voltage) return "#666";
    if (voltage >= 500) return "#ff4444"; // Red for 500kV+
    if (voltage >= 345) return "#ff8800"; // Orange for 345kV
    if (voltage >= 230) return "#ffcc00"; // Yellow for 230kV
    if (voltage >= 138) return "#00cc00"; // Green for 138kV
    return "#666"; // Gray for others
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-4">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start max-w-6xl w-full">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold mb-4">Grid Topology Explorer</h1>
          <p className="text-lg text-gray-600">
            Parse and visualize electric transmission line or substation data
          </p>
        </div>

        {/* Data Input Section */}
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

          {/* Demo Data Tab */}
          {activeTab === "demo" && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">
                  Demo Data Available
                </h3>
                <p className="text-sm text-blue-800">
                  Click "Process Data" to load sample transmission network data
                  and see the visualization in action.
                </p>
              </div>
            </div>
          )}

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
                  accept=".json,.geojson,.txt"
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
                      Supports .json, .geojson, and .txt files
                    </p>
                  </div>
                </label>
              </div>

              {/* Selected File Display */}
              {selectedFile && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <svg
                        className="h-5 w-5 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <h3 className="font-medium text-green-900">
                          Selected File
                        </h3>
                        <p className="text-sm text-green-700">
                          {selectedFile.name} (
                          {(selectedFile.size / 1024).toFixed(1)} KB)
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={clearSelectedFile}
                      className="text-green-600 hover:text-green-800 transition-colors"
                      title="Remove file"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
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
              onClick={handleProcessData}
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

        {/* Visualization Section */}
        {parsedTopology && (
          <div className="w-full bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Network Visualization</h2>
              <button
                onClick={exportGraphData}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Export Data
              </button>
            </div>

            {/* Network Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Substations</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {parsedTopology.substations.length}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">
                  Transmission Lines
                </h4>
                <p className="text-2xl font-bold text-green-600">
                  {parsedTopology.lines.length}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-medium text-purple-900 mb-2">
                  Voltage Levels
                </h4>
                <p className="text-2xl font-bold text-purple-600">
                  {
                    new Set(
                      parsedTopology.lines.map((l) => l.voltage).filter(Boolean)
                    ).size
                  }
                </p>
              </div>
            </div>

            {/* Hover Tooltip */}
            {(hoveredNode || hoveredLink) && (
              <div
                className="fixed z-50 bg-black text-white p-3 rounded-lg shadow-lg pointer-events-none"
                style={{
                  left: (hoveredNode || hoveredLink)?.x + 10,
                  top: (hoveredNode || hoveredLink)?.y - 10,
                }}
              >
                {hoveredNode && (
                  <div>
                    <div className="font-bold">{hoveredNode.name}</div>
                    <div>ID: {hoveredNode.id}</div>
                    {hoveredNode.voltage && (
                      <div>Voltage: {hoveredNode.voltage} kV</div>
                    )}
                  </div>
                )}
                {hoveredLink && (
                  <div>
                    <div className="font-bold">Transmission Line</div>
                    <div>From: {hoveredLink.source}</div>
                    <div>To: {hoveredLink.target}</div>
                    {hoveredLink.voltage && (
                      <div>Voltage: {hoveredLink.voltage} kV</div>
                    )}
                    {hoveredLink.lineType && (
                      <div>Type: {hoveredLink.lineType}</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Force Graph Visualization */}
            <div
              className="border rounded-lg overflow-hidden"
              style={{ height: "600px" }}
            >
              <ForceGraph2D
                ref={graphRef}
                graphData={parsedTopology.graphData}
                nodeLabel={(node: any) => `${node.name} (${node.id})`}
                linkLabel={(link: any) => `${link.source} → ${link.target}`}
                nodeColor={(node: any) => getVoltageColor(node.voltage)}
                linkColor={(link: any) => getVoltageColor(link.voltage)}
                nodeRelSize={8}
                linkWidth={2}
                onNodeHover={handleNodeHover}
                onLinkHover={handleLinkHover}
                onNodeClick={handleNodeClick}
                onLinkClick={handleLinkClick}
                cooldownTicks={100}
                linkDirectionalParticles={2}
                linkDirectionalParticleSpeed={0.005}
              />
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span>500kV+</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <span>345kV</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span>230kV</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>138kV</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                <span>Other</span>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder when no data */}
        {!parsedTopology && (
          <div className="w-full bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">
              Network Visualization
            </h2>
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
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <p>
                Process topology data to see the interactive network
                visualization
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
