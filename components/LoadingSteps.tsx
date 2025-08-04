import React from "react";

export interface ProcessingStep {
  step: number;
  message: string;
}

interface LoadingStepsProps {
  currentStep: ProcessingStep;
  title?: string;
  steps?: ProcessingStep[];
  showProgressBar?: boolean;
  showTips?: boolean;
  tipMessage?: string;
}

export function LoadingSteps({
  currentStep,
  title = "Processing",
  steps,
  showProgressBar = false,
  showTips = false,
  tipMessage = "Processing may take a few moments...",
}: LoadingStepsProps) {
  const defaultSteps = [
    { step: 1, message: "Initializing..." },
    { step: 2, message: "Processing data..." },
    { step: 3, message: "Analyzing..." },
    { step: 4, message: "Finalizing..." },
  ];

  const displaySteps = steps || defaultSteps;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
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
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{currentStep.message}</p>
        </div>
      </div>

      <div className="space-y-2">
        {displaySteps.map((step) => (
          <div
            key={step.step}
            className={`flex items-center space-x-3 ${
              currentStep.step >= step.step ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                currentStep.step > step.step
                  ? "bg-green-500 text-white"
                  : currentStep.step === step.step
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {currentStep.step > step.step ? (
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <span className="text-xs font-medium">{step.step}</span>
              )}
            </div>
            <span className="text-sm">{step.message}</span>
          </div>
        ))}
      </div>

      {showProgressBar && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>
              {Math.round((currentStep.step / displaySteps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${(currentStep.step / displaySteps.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      )}

      {showTips && (
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
              <p className="text-sm text-yellow-700 mt-1">{tipMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
