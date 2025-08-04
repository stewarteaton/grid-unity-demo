"use client";

import { DataInputSection, NetworkVisualization } from "./components";
import { useGridTopology } from "./hooks";

export default function GridTopologyExplorer() {
  const {
    // State
    activeTab,
    setActiveTab,
    demoFormat,
    setDemoFormat,
    pastedData,
    setPastedData,
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
  } = useGridTopology();

  return (
    <div className="font-sans grid grid-rows-[5x_1fr_5px] md:grid-rows-[0_1fr_0] items-center justify-items-center min-h-screen p-2 pb-20 gap-2">
      <main className="flex flex-col gap-[16px] row-start-2 items-center sm:items-start max-w-4xl w-full">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold mb-4">Grid Topology Explorer</h1>
          <p className="text-lg text-gray-600">
            Parse and visualize electric transmission line or substation data
          </p>
        </div>

        {/* Data Input Section */}
        <DataInputSection
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          demoFormat={demoFormat}
          setDemoFormat={setDemoFormat}
          pastedData={pastedData}
          setPastedData={setPastedData}
          isProcessing={isProcessing}
          onProcessData={handleProcessData}
        />

        {/* Visualization Section */}
        <NetworkVisualization
          parsedTopology={parsedTopology}
          detectedFormat={detectedFormat}
          hoveredNode={hoveredNode}
          hoveredLink={hoveredLink}
          mousePosition={mousePosition}
          graphRef={graphRef}
          onNodeHover={handleNodeHover}
          onLinkHover={handleLinkHover}
          onNodeClick={handleNodeClick}
          onLinkClick={handleLinkClick}
          onExportData={handleExportData}
        />
      </main>
    </div>
  );
}
