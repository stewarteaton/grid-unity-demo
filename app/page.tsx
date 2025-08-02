"use client";
import { useState } from "react";
import ModelParser from "./model-parser/page";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"topology" | "parser">("topology");

  return (
    <div className="font-sans grid grid-rows-[10px_1fr_10px] items-center justify-items-center min-h-screen pb-20 p-4 lg:p-2 ">
      <main className="flex flex-col gap-[8px] p-4 lg:p-2 row-start-2 items-center sm:items-start max-w-4xl w-full">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold mb-4">GridUnity Demo</h1>
          {/* <p className="text-lg text-gray-600">
            Advanced power system analysis and visualization tools
          </p> */}
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
              Model Parser
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-2">
            {activeTab === "topology" && (
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Grid Topology Explorer
                </h3>
                <p className="text-sm">
                  Interactive visualization and analysis of power system
                  topology.
                  <br />
                  Coming soon...
                </p>
              </div>
            )}

            {activeTab === "parser" && <ModelParser />}
          </div>
        </div>
      </main>
    </div>
  );
}
