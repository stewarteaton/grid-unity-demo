import { useState, useCallback, useRef, useEffect } from "react";
import { ParsedTopology, DemoFormat, ActiveTab, MousePosition } from "../types";
import { detectFormat, parseTopologyData } from "../utils/parsers";
import { exportGraphData } from "../utils/visualization";
import { mockGeoJSONData } from "../mock-data/GeoJSON";
import { mockPSLFData, mockOpenDSSData } from "../mock-data";

export const useGridTopology = () => {
  const [fileData, setFileData] = useState<string>("");
  const [pastedData, setPastedData] = useState<string>("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("demo");
  const [demoFormat, setDemoFormat] = useState<DemoFormat>("GeoJSON");
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedTopology, setParsedTopology] = useState<ParsedTopology | null>(null);
  const [detectedFormat, setDetectedFormat] = useState<string>("");
  const [hoveredNode, setHoveredNode] = useState<any>(null);
  const [hoveredLink, setHoveredLink] = useState<any>(null);
  const [mousePosition, setMousePosition] = useState<MousePosition | null>(null);
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
  }, []);

  const handleLinkClick = useCallback((link: any) => {
    console.log("Clicked link:", link);
  }, []);

  const handleExportData = () => {
    exportGraphData(parsedTopology);
  };

  return {
    // State
    fileData,
    setFileData,
    pastedData,
    setPastedData,
    activeTab,
    setActiveTab,
    demoFormat,
    setDemoFormat,
    isProcessing,
    parsedTopology,
    detectedFormat,
    hoveredNode,
    hoveredLink,
    mousePosition,
    graphRef,
    
    // Actions
    handleProcessData,
    handleNodeHover,
    handleLinkHover,
    handleNodeClick,
    handleLinkClick,
    handleExportData,
    getDemoData,
  };
}; 