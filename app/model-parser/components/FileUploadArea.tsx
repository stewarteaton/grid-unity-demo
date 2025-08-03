interface FileUploadAreaProps {
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileUploadArea = ({
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileUpload,
}: FileUploadAreaProps) => {
  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        isDragOver
          ? "border-blue-400 bg-blue-50"
          : "border-gray-300 hover:border-blue-400"
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <input
        type="file"
        accept=".raw,.dyr,.txt,.json,.csv"
        onChange={onFileUpload}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="space-y-2">
          <svg
            className={`mx-auto h-12 w-12 ${
              isDragOver ? "text-blue-400" : "text-gray-400"
            }`}
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className={`${isDragOver ? "text-blue-600" : "text-gray-600"}`}>
            <span className="font-medium">
              {isDragOver ? "Drop files here" : "Click to upload"}
            </span>
            {!isDragOver && " or drag and drop"}
          </div>
          <p className="text-xs text-gray-500">
            Supports .raw, .dyr, .json, .csv, and .txt files
          </p>
        </div>
      </label>
    </div>
  );
};
