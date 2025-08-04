import React from "react";

interface EmptyResultsPlaceholderProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyResultsPlaceholder({
  title = "No Analysis Results",
  description = "Upload and process data to see AI-powered analysis results here",
  icon,
  className = "",
}: EmptyResultsPlaceholderProps) {
  const defaultIcon = (
    <svg
      className="w-16 h-16 text-gray-300"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );

  return (
    <div className={`text-center py-8 ${className}`}>
      <div className="flex justify-center mb-4">{icon || defaultIcon}</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
}
