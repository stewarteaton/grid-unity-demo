import { ProcessingResult } from "../../../types/power-system";

interface ResultsDisplayProps {
  result: ProcessingResult;
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num);
};

export const ResultsDisplay = ({ result }: ResultsDisplayProps) => {
  if (!result.success) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <svg
            className="h-5 w-5 text-red-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Processing Error
            </h3>
            <p className="text-sm text-red-700 mt-1">{result.error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex">
          <svg
            className="h-5 w-5 text-green-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">
              {result.message || "File processed successfully"}
            </p>
          </div>
        </div>
      </div>

      {/* Parsed Data */}
      {result.parsedData && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Parsed Data</h3>

          {/* Format and Base Power */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">File Format</h4>
              <p className="text-sm text-gray-600">
                {result.parsedData.format}
              </p>
            </div>
            {result.parsedData.base_power && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Base Power</h4>
                <p className="text-sm text-gray-600">
                  {result.parsedData.base_power} MVA
                </p>
              </div>
            )}
          </div>

          {/* System Components */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {result.parsedData.buses && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Buses</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {result.parsedData.buses.length}
                </p>
              </div>
            )}
            {result.parsedData.loads && (
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Loads</h4>
                <p className="text-2xl font-bold text-green-600">
                  {result.parsedData.loads.length}
                </p>
              </div>
            )}
            {result.parsedData.branches && (
              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">Branches</h4>
                <p className="text-2xl font-bold text-yellow-600">
                  {result.parsedData.branches.length}
                </p>
              </div>
            )}
            {result.parsedData.generators && (
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-medium text-purple-900 mb-2">Generators</h4>
                <p className="text-2xl font-bold text-purple-600">
                  {result.parsedData.generators.length}
                </p>
              </div>
            )}
          </div>

          {/* Detailed Data Tables */}
          {result.parsedData.loads && result.parsedData.loads.length > 0 && (
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b bg-gray-50">
                <h4 className="font-medium text-gray-900">Load Details</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Bus ID
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        MW
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        MVAR
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {result.parsedData.loads.slice(0, 5).map((load, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {load.bus_id}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {formatNumber(load.mw)}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {formatNumber(load.mvar)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Analysis */}
      {result.analysis && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">AI Analysis</h3>

          {/* Summary */}
          {result.analysis.summary && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">System Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {result.analysis.summary.totalBuses !== undefined && (
                  <div>
                    <span className="text-gray-600">Total Buses:</span>
                    <span className="ml-2 font-medium">
                      {result.analysis.summary.totalBuses}
                    </span>
                  </div>
                )}
                {result.analysis.summary.totalLoads !== undefined && (
                  <div>
                    <span className="text-gray-600">Total Loads:</span>
                    <span className="ml-2 font-medium">
                      {result.analysis.summary.totalLoads}
                    </span>
                  </div>
                )}
                {result.analysis.summary.totalBranches !== undefined && (
                  <div>
                    <span className="text-gray-600">Total Branches:</span>
                    <span className="ml-2 font-medium">
                      {result.analysis.summary.totalBranches}
                    </span>
                  </div>
                )}
                {result.analysis.summary.totalGenerators !== undefined && (
                  <div>
                    <span className="text-gray-600">Total Generators:</span>
                    <span className="ml-2 font-medium">
                      {result.analysis.summary.totalGenerators}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Load Analysis */}
          {result.analysis.loadAnalysis && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Load Analysis</h4>
              {result.analysis.loadAnalysis.totalLoad && (
                <p className="text-sm text-blue-800 mb-2">
                  Total Load:{" "}
                  {formatNumber(result.analysis.loadAnalysis.totalLoad)} MW
                </p>
              )}
              {result.analysis.loadAnalysis.message && (
                <p className="text-sm text-blue-800">
                  {result.analysis.loadAnalysis.message}
                </p>
              )}
            </div>
          )}

          {/* Recommendations */}
          {result.analysis.recommendations &&
            result.analysis.recommendations.length > 0 && (
              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">
                  Recommendations
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
                  {result.analysis.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}

          {/* Issues */}
          {result.analysis.issues && result.analysis.issues.length > 0 && (
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-medium text-red-900 mb-2">
                Potential Issues
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-800">
                {result.analysis.issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
