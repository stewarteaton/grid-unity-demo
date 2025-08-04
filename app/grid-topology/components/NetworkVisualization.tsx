import dynamic from "next/dynamic";
import { ParsedTopology, MousePosition } from "../types";
import { getNodeColor, getLinkColor } from "../utils/visualization";

// Dynamically import ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
  loading: () => <div>Loading visualization...</div>,
});

interface NetworkVisualizationProps {
  parsedTopology: ParsedTopology | null;
  detectedFormat: string;
  hoveredNode: any;
  hoveredLink: any;
  mousePosition: MousePosition | null;
  graphRef: any;
  onNodeHover: (node: any) => void;
  onLinkHover: (link: any) => void;
  onNodeClick: (node: any) => void;
  onLinkClick: (link: any) => void;
  onExportData: () => void;
}

export const NetworkVisualization = ({
  parsedTopology,
  detectedFormat,
  hoveredNode,
  hoveredLink,
  mousePosition,
  graphRef,
  onNodeHover,
  onLinkHover,
  onNodeClick,
  onLinkClick,
  onExportData,
}: NetworkVisualizationProps) => {
  if (!parsedTopology) {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4">Network Visualization</h2>
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
            Process topology data to see the interactive network visualization
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Network Visualization</h2>
        <button
          onClick={onExportData}
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
          <h4 className="font-medium text-purple-900 mb-2">Voltage Levels</h4>
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
                        <span className="text-gray-300">Coordinates:</span>
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
                      {String(
                        typeof hoveredLink.source === "object"
                          ? hoveredLink.source.id
                          : hoveredLink.source || "Unknown"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">To:</span>
                    <span className="font-semibold">
                      {String(
                        typeof hoveredLink.target === "object"
                          ? hoveredLink.target.id
                          : hoveredLink.target || "Unknown"
                      )}
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
                onNodeHover={onNodeHover}
                onLinkHover={onLinkHover}
                onNodeClick={onNodeClick}
                onLinkClick={onLinkClick}
                onEngineStop={() => {
                  // Center the graph when the physics engine stops
                  if (graphRef.current) {
                    graphRef.current.centerAt(0, 0, 1000);
                    graphRef.current.zoom(1.2, 1000);
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
  );
};
