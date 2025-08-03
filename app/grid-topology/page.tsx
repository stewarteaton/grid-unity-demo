"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { mockGeoJSONData } from "./mock-data/GeoJSON";
import { mockPSLFData, mockOpenDSSData } from "./mock-data";

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
  const [activeTab, setActiveTab] = useState<"paste" | "demo">("demo");
  const [demoFormat, setDemoFormat] = useState<"GeoJSON" | "PSLF" | "OpenDSS">(
    "GeoJSON"
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedTopology, setParsedTopology] = useState<ParsedTopology | null>(
    null
  );
  const [detectedFormat, setDetectedFormat] = useState<string>("");
  const [hoveredNode, setHoveredNode] = useState<any>(null);
  const [hoveredLink, setHoveredLink] = useState<any>(null);
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const graphRef = useRef<any>(null);

  // Add mouse move handler to track position globally
  const handleMouseMove = useCallback((event: MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  }, []);

  // Add and remove mouse move listener
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  // Center the graph when data is loaded
  useEffect(() => {
    if (parsedTopology && graphRef.current) {
      setTimeout(() => {
        if (graphRef.current) {
          graphRef.current.centerAt(0, 0, 1000);
          graphRef.current.zoom(1.5, 1000);
        }
      }, 100);
    }
  }, [parsedTopology]);

  // Get demo data based on selected format
  const getDemoData = () => {
    switch (demoFormat) {
      case "PSLF":
        return mockPSLFData;
      case "OpenDSS":
        return mockOpenDSSData;
      case "GeoJSON":
      default:
        return JSON.stringify(mockGeoJSONData, null, 2);
    }
  };

  // Detect data format
  const detectFormat = (data: string): string => {
    try {
      const jsonData = JSON.parse(data);
      if (jsonData.type === "FeatureCollection") {
        return "GeoJSON";
      }
      if (jsonData.substations && jsonData.lines) {
        return "Custom JSON";
      }
    } catch (jsonError) {
      // Not JSON, check other formats
    }

    if (data.includes("C PSLF") || data.includes("Bus# Type Area Zone")) {
      return "PSLF";
    }

    if (
      data.includes("New Circuit") ||
      data.includes("Generator.") ||
      data.includes("Load.")
    ) {
      return "OpenDSS";
    }

    return "Unknown";
  };

  const parseTopologyData = (data: string): ParsedTopology => {
    try {
      // Try to parse as JSON first (GeoJSON or custom format)
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
      } catch (jsonError) {
        // Not JSON, try other formats
      }

      // Handle PSLF format
      if (data.includes("C PSLF") || data.includes("Bus# Type Area Zone")) {
        return parsePSLFData(data);
      }

      // Handle OpenDSS format
      if (
        data.includes("New Circuit") ||
        data.includes("Generator.") ||
        data.includes("Load.")
      ) {
        return parseOpenDSSData(data);
      }

      throw new Error(
        "Unsupported data format. Supported formats: GeoJSON, PSLF, OpenDSS"
      );
    } catch (error) {
      console.error("Error parsing topology data:", error);
      throw new Error("Failed to parse topology data");
    }
  };

  // Parse PSLF format
  const parsePSLFData = (data: string): ParsedTopology => {
    const lines = data.split("\n");
    const substations: Substation[] = [];
    const transmissionLines: TransmissionLine[] = [];
    const nodes: any[] = [];
    const links: any[] = [];

    // Extract bus data
    const busLines = lines.filter(
      (line) =>
        line.trim().startsWith("C") &&
        line.includes("Bus#") === false &&
        line.includes("Type") === false &&
        line.trim().length > 10 &&
        !line.includes("Generator") &&
        !line.includes("Load") &&
        !line.includes("Line") &&
        !line.includes("Transformer")
    );

    busLines.forEach((line, index) => {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 6) {
        const busId = parts[1];
        const busName = parts[5];
        const voltage = parseFloat(parts[4]);

        const substation: Substation = {
          id: busId,
          name: busName,
          voltage: voltage,
        };
        substations.push(substation);

        nodes.push({
          id: busId,
          name: busName,
          voltage: voltage,
          type: "substation",
        });
      }
    });

    // Extract line data
    const lineLines = lines.filter(
      (line) =>
        line.trim().startsWith("C") &&
        line.includes("FromBus") === false &&
        line.includes("ToBus") === false &&
        line.trim().length > 10 &&
        line.includes("Line.")
    );

    lineLines.forEach((line, index) => {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 8) {
        const fromBus = parts[1];
        const toBus = parts[2];
        const lineId = `line_${fromBus}_${toBus}`;

        const transmissionLine: TransmissionLine = {
          id: lineId,
          from: fromBus,
          to: toBus,
          voltage: substations.find((s) => s.id === fromBus)?.voltage,
        };
        transmissionLines.push(transmissionLine);

        links.push({
          id: lineId,
          source: fromBus,
          target: toBus,
          voltage: transmissionLine.voltage,
        });
      }
    });

    return {
      substations,
      lines: transmissionLines,
      graphData: { nodes, links },
    };
  };

  // Parse OpenDSS format
  const parseOpenDSSData = (data: string): ParsedTopology => {
    const lines = data.split("\n");
    const substations: Substation[] = [];
    const transmissionLines: TransmissionLine[] = [];
    const nodes: any[] = [];
    const links: any[] = [];

    // Create a set to track all referenced buses
    const referencedBuses = new Set<string>();

    // Extract line data first to get all referenced buses
    const lineLines = lines.filter(
      (line) => line.trim().startsWith("Line.") && !line.includes("!")
    );

    lineLines.forEach((line) => {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 4) {
        const bus1 = parts[1];
        const bus2 = parts[2];
        referencedBuses.add(bus1);
        referencedBuses.add(bus2);
      }
    });

    // Extract bus data
    const busLines = lines.filter(
      (line) => line.trim().startsWith("Bus.") && !line.includes("!")
    );

    busLines.forEach((line) => {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 4) {
        const busName = parts[0].replace("Bus.", "");
        const x = parseFloat(parts[1]);
        const y = parseFloat(parts[2]);

        // Estimate voltage based on bus name patterns
        let voltage = 345; // default
        if (
          busName.includes("500") ||
          busName.includes("DC_POWER") ||
          busName.includes("CHI_WINDY") ||
          busName.includes("HOU_SPACE") ||
          busName.includes("LA_ANGEL")
        ) {
          voltage = 500;
        } else if (
          busName.includes("230") ||
          busName.includes("PIT_STEEL") ||
          busName.includes("DET_MOTOR") ||
          busName.includes("MINN_TWIN") ||
          busName.includes("PHX_VALLEY") ||
          busName.includes("SEA_EMERALD")
        ) {
          voltage = 230;
        }

        const substation: Substation = {
          id: busName,
          name: busName,
          voltage: voltage,
          coordinates: [x, y],
        };
        substations.push(substation);

        nodes.push({
          id: busName,
          name: busName,
          voltage: voltage,
          x: x,
          y: y,
          type: "substation",
        });
      }
    });

    // Create nodes for any buses that are referenced in lines but not defined
    referencedBuses.forEach((busName) => {
      if (!nodes.find((n) => n.id === busName)) {
        // Create a default node for referenced but undefined buses
        const defaultNode = {
          id: busName,
          name: busName,
          voltage: 345, // default voltage
          x: 0, // default coordinates
          y: 0,
          type: "substation",
        };
        nodes.push(defaultNode);

        const defaultSubstation: Substation = {
          id: busName,
          name: busName,
          voltage: 345,
          coordinates: [0, 0],
        };
        substations.push(defaultSubstation);
      }
    });

    // Now process the lines
    lineLines.forEach((line) => {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 4) {
        const lineName = parts[0].replace("Line.", "");
        const bus1 = parts[1];
        const bus2 = parts[2];

        // Ensure both buses exist in nodes
        const sourceNode = nodes.find((n) => n.id === bus1);
        const targetNode = nodes.find((n) => n.id === bus2);

        if (sourceNode && targetNode) {
          const transmissionLine: TransmissionLine = {
            id: lineName,
            from: bus1,
            to: bus2,
            voltage: sourceNode.voltage,
          };
          transmissionLines.push(transmissionLine);

          links.push({
            id: lineName,
            source: bus1,
            target: bus2,
            voltage: transmissionLine.voltage,
          });
        } else {
          console.warn(
            `Missing nodes for line ${lineName}: ${bus1} -> ${bus2}`
          );
        }
      }
    });

    console.log("OpenDSS Parsed Data:", {
      nodes: nodes.map((n) => ({ id: n.id, name: n.name })),
      links: links.map((l) => ({
        id: l.id,
        source: l.source,
        target: l.target,
      })),
      substations: substations.length,
      transmissionLines: transmissionLines.length,
    });

    return {
      substations,
      lines: transmissionLines,
      graphData: { nodes, links },
    };
  };

  const handleProcessData = async () => {
    const dataToProcess = activeTab === "paste" ? pastedData : getDemoData();

    if (!dataToProcess.trim()) {
      alert("Please provide data to process");
      return;
    }

    setIsProcessing(true);
    setParsedTopology(null);
    setDetectedFormat("");

    try {
      // Detect format first
      const format = detectFormat(dataToProcess);
      setDetectedFormat(format);

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
    // Don't try to render the node object directly
  }, []);

  const handleLinkClick = useCallback((link: any) => {
    console.log("Clicked link:", link);
    // Don't try to render the link object directly
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
    if (!voltage || isNaN(voltage)) return "#666";
    if (voltage >= 500) return "#ff4444"; // Red for 500kV+
    if (voltage >= 345) return "#ff8800"; // Orange for 345kV
    if (voltage >= 230) return "#ffcc00"; // Yellow for 230kV
    if (voltage >= 138) return "#00cc00"; // Green for 138kV
    return "#666"; // Gray for others
  };

  const getNodeColor = (node: any) => {
    if (!node) return "#666";
    return getVoltageColor(node.voltage);
  };

  const getLinkColor = (link: any) => {
    if (!link) return "#666";
    return getVoltageColor(link.voltage);
  };

  const getNodeLabel = (node: any) => {
    if (!node) return "";
    const name = node.name || "Unknown";
    const id = node.id || "Unknown";
    return `${name} (${id})`;
  };

  const getLinkLabel = (link: any) => {
    if (!link) return "";
    const source = link.source || "Unknown";
    const target = link.target || "Unknown";
    return `${source} → ${target}`;
  };

  return (
    <div className="font-sans grid grid-rows-[5x_1fr_5px] md:grid-rows-[0_1fr_0] items-center justify-items-center min-h-screen p-2 pb-20 gap-2 ">
      <main className="flex flex-col gap-[16px] row-start-2 items-center sm:items-start max-w-4xl w-full">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold mb-4">Grid Topology Explorer</h1>
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
                    onChange={(e) =>
                      setDemoFormat(
                        e.target.value as "GeoJSON" | "PSLF" | "OpenDSS"
                      )
                    }
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

            {/* Format Detection */}
            {detectedFormat && (
              <div className="mb-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  <span className="mr-2">Detected Format:</span>
                  <span className="font-semibold">{detectedFormat}</span>
                </div>
              </div>
            )}

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
            {(hoveredNode || hoveredLink) &&
              mousePosition &&
              !isNaN(mousePosition.x) &&
              !isNaN(mousePosition.y) && (
                <div
                  className="fixed z-50 bg-black text-white p-4 rounded-lg shadow-lg pointer-events-none border border-gray-600"
                  style={{
                    left: mousePosition.x + 15,
                    top: mousePosition.y - 15,
                    maxWidth: "300px",
                    minWidth: "200px",
                  }}
                >
                  {hoveredNode && (
                    <div className="space-y-2">
                      <div className="font-bold text-lg border-b border-gray-600 pb-2">
                        {String(hoveredNode.name || "Unknown Substation")}
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">ID:</span>
                          <span className="font-mono">
                            {String(hoveredNode.id || "Unknown")}
                          </span>
                        </div>
                        {hoveredNode.voltage && (
                          <div className="flex justify-between">
                            <span className="text-gray-300">Voltage:</span>
                            <span className="font-semibold">
                              {String(hoveredNode.voltage)} kV
                            </span>
                          </div>
                        )}
                        {hoveredNode.x !== undefined &&
                          hoveredNode.y !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-gray-300">
                                Coordinates:
                              </span>
                              <span className="font-mono text-xs">
                                ({Number(hoveredNode.x).toFixed(2)},{" "}
                                {Number(hoveredNode.y).toFixed(2)})
                              </span>
                            </div>
                          )}
                        <div className="flex justify-between">
                          <span className="text-gray-300">Type:</span>
                          <span className="capitalize">
                            {String(hoveredNode.type || "substation")}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  {hoveredLink && (
                    <div className="space-y-2">
                      <div className="font-bold text-lg border-b border-gray-600 pb-2">
                        Transmission Line
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">ID:</span>
                          <span className="font-mono">
                            {String(hoveredLink.id || "Unknown")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">From:</span>
                          <span className="font-semibold">
                            {String(hoveredLink.source || "Unknown")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">To:</span>
                          <span className="font-semibold">
                            {String(hoveredLink.target || "Unknown")}
                          </span>
                        </div>
                        {hoveredLink.voltage && (
                          <div className="flex justify-between">
                            <span className="text-gray-300">Voltage:</span>
                            <span className="font-semibold">
                              {String(hoveredLink.voltage)} kV
                            </span>
                          </div>
                        )}
                        {hoveredLink.lineType && (
                          <div className="flex justify-between">
                            <span className="text-gray-300">Type:</span>
                            <span className="capitalize">
                              {String(hoveredLink.lineType)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

            {/* Force Graph Visualization */}
            <div
              className="border rounded-lg overflow-hidden relative"
              style={{ height: "600px" }}
            >
              {/* Map Background */}
              <div
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cdefs%3E%3Cpattern id='grid' width='10' height='10' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 10 0 L 0 0 0 10' fill='none' stroke='%23ddd' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23grid)'/%3E%3C/svg%3E\")",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "repeat",
                  zIndex: 0,
                }}
              />

              {parsedTopology.graphData &&
                parsedTopology.graphData.nodes &&
                parsedTopology.graphData.links && (
                  <div className="relative z-10 h-full">
                    <ForceGraph2D
                      ref={graphRef}
                      graphData={parsedTopology.graphData}
                      nodeColor={getNodeColor}
                      linkColor={getLinkColor}
                      nodeRelSize={6}
                      linkWidth={1}
                      cooldownTicks={50}
                      enableNodeDrag={true}
                      enableZoomInteraction={true}
                      enablePanInteraction={true}
                      onNodeHover={handleNodeHover}
                      onLinkHover={handleLinkHover}
                      onNodeClick={handleNodeClick}
                      onLinkClick={handleLinkClick}
                      onEngineStop={() => {
                        // Center the graph when the physics engine stops
                        if (graphRef.current) {
                          graphRef.current.centerAt(0, 0, 1000);
                          graphRef.current.zoom(1.5, 1000);
                        }
                      }}
                    />
                  </div>
                )}
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
