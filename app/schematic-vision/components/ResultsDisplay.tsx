import React from "react";
import { ProcessingResult } from "../hooks/useLogic";

interface ResultsDisplayProps {
  result: ProcessingResult;
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  if (!result.success) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Analysis Failed
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{result.error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderJsonData = (data: any, level: number = 0): React.ReactNode => {
    if (typeof data === "object" && data !== null) {
      if (Array.isArray(data)) {
        return (
          <div className="ml-4">
            <span className="text-blue-600">[</span>
            <div className="ml-4">
              {data.map((item, index) => (
                <div key={index}>
                  {renderJsonData(item, level + 1)}
                  {index < data.length - 1 && (
                    <span className="text-gray-500">,</span>
                  )}
                </div>
              ))}
            </div>
            <span className="text-blue-600">]</span>
          </div>
        );
      } else {
        return (
          <div className="ml-4">
            <span className="text-blue-600">{"{"}</span>
            <div className="ml-4">
              {Object.entries(data).map(([key, value], index) => (
                <div key={key}>
                  <span className="text-green-600">"{key}"</span>
                  <span className="text-gray-500">: </span>
                  {renderJsonData(value, level + 1)}
                  {index < Object.keys(data).length - 1 && (
                    <span className="text-gray-500">,</span>
                  )}
                </div>
              ))}
            </div>
            <span className="text-blue-600">{"}"}</span>
          </div>
        );
      }
    } else if (typeof data === "string") {
      return <span className="text-orange-600">"{data}"</span>;
    } else if (typeof data === "number") {
      return <span className="text-purple-600">{data}</span>;
    } else if (typeof data === "boolean") {
      return <span className="text-purple-600">{data.toString()}</span>;
    } else {
      return <span className="text-gray-500">null</span>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-green-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Analysis Complete
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>Successfully extracted data from the single-line diagram.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Extracted Data
        </h3>
        <div className="bg-white rounded-lg p-4 border border-gray-200 overflow-x-auto">
          <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap">
            {renderJsonData(result.data)}
          </pre>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Data Summary</h3>
        <div className="text-sm text-blue-700">
          <p>
            The analysis has identified electrical components, connections, and
            system topology from your single-line diagram. The extracted data
            includes component types, ratings, connections, and system
            structure.
          </p>
        </div>
      </div>
    </div>
  );
}
