interface LoadingStepsProps {
  currentStep: number;
}

const steps = [
  "Analyzing file format and structure...",
  "Parsing power system components...",
  "Extracting bus, load, and generator data...",
  "Running AI analysis on system topology...",
  "Generating recommendations and insights...",
  "Finalizing results...",
];

export const LoadingSteps = ({ currentStep }: LoadingStepsProps) => {
  return (
    <div className="space-y-6">
      {/* Loading Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <svg
            className="animate-spin h-5 w-5 text-blue-500 mr-3"
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
          <div>
            <h3 className="text-sm font-medium text-blue-800">
              Processing with AI Analysis
            </h3>
            <p className="text-sm text-blue-700">
              This may take a few moments...
            </p>
          </div>
        </div>
      </div>

      {/* Processing Steps */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Processing Steps:</h4>
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              index < currentStep
                ? "bg-green-50 border border-green-200"
                : index === currentStep
                ? "bg-blue-50 border border-blue-200"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            {/* Step Indicator */}
            <div className="flex-shrink-0">
              {index < currentStep ? (
                // Completed step
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              ) : index === currentStep ? (
                // Current step
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="animate-spin w-4 h-4 text-white"
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
                </div>
              ) : (
                // Pending step
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-xs text-gray-600 font-medium">
                    {index + 1}
                  </span>
                </div>
              )}
            </div>

            {/* Step Text */}
            <span
              className={`text-sm ${
                index < currentStep
                  ? "text-green-800 font-medium"
                  : index === currentStep
                  ? "text-blue-800 font-medium"
                  : "text-gray-600"
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progress</span>
          <span>{Math.round((currentStep / steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${(currentStep / steps.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <svg
            className="h-5 w-5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Processing Tip
            </h3>
            <p className="text-sm text-yellow-700 mt-1">
              Larger files may take longer to process. The AI is analyzing your
              power system data to provide comprehensive insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
