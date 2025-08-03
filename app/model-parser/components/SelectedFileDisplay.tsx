interface SelectedFileDisplayProps {
  file: File;
  onClear: () => void;
}

export const SelectedFileDisplay = ({
  file,
  onClear,
}: SelectedFileDisplayProps) => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <svg
            className="h-5 w-5 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h3 className="font-medium text-green-900">Selected File</h3>
            <p className="text-sm text-green-700">
              {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </p>
          </div>
        </div>
        <button
          onClick={onClear}
          className="text-green-600 hover:text-green-800 transition-colors"
          title="Remove file"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
