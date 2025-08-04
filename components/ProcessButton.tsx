import React from "react";

interface ProcessButtonProps {
  isProcessing: boolean;
  hasData: boolean;
  onClick: () => void;
  processingText?: string;
  defaultText?: string;
  className?: string;
}

export function ProcessButton({
  isProcessing,
  hasData,
  onClick,
  processingText = "Processing...",
  defaultText = "Process Data",
  className = "",
}: ProcessButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={!hasData || isProcessing}
      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
        isProcessing
          ? "bg-gray-400 text-white cursor-not-allowed"
          : hasData
          ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      } ${className}`}
    >
      {isProcessing ? (
        <div className="flex items-center justify-center space-x-2">
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
          <span>{processingText}</span>
        </div>
      ) : (
        <span>{defaultText}</span>
      )}
    </button>
  );
}
