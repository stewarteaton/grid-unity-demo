"use client";
import { useState } from "react";
import ModelParser from "./model-parser/page";
import GridTopologyExplorer from "./grid-topology/page";
import SchematicVision from "./schematic-vision/page";

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    "topology" | "parser" | "schematic"
  >("topology");

  return (
    <div className="font-sans grid grid-rows-[10px_1fr_10px] items-center justify-items-center min-h-screen p-4 lg:p-2 pb-20">
      <main className="flex flex-col gap-[8px] row-start-2 items-center sm:items-start max-w-6xl w-full">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold mb-4">GridUnity Demo</h1>
        </div>

        {/* Tab Navigation */}
        <div className="w-full bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex border-b border-gray-200 mb-2">
            <button
              onClick={() => setActiveTab("topology")}
              className={`px-4 py-2 font-medium ${
                activeTab === "topology"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Grid Topology Explorer
            </button>
            <button
              onClick={() => setActiveTab("parser")}
              className={`px-4 py-2 font-medium ${
                activeTab === "parser"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Model Parser (AI)
            </button>
            <button
              onClick={() => setActiveTab("schematic")}
              className={`px-4 py-2 font-medium ${
                activeTab === "schematic"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Schematic Vision (AI)
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-2">
            {activeTab === "topology" && <GridTopologyExplorer />}
            {activeTab === "parser" && <ModelParser />}
            {activeTab === "schematic" && <SchematicVision />}
          </div>
        </div>
      </main>
    </div>
  );
}
