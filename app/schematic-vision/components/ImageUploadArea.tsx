import React from "react";

interface ImageUploadAreaProps {
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onImageUpload: (file: File) => void;
}

export function ImageUploadArea({
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onImageUpload,
}: ImageUploadAreaProps) {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragOver
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 hover:border-gray-400"
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="space-y-4">
        <div className="flex justify-center">
          <svg
            className="w-12 h-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div>
          <p className="text-lg font-medium text-gray-900">
            Upload Single-Line Diagram
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Drag and drop an image here, or click to select a file
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Supported formats: JPG, PNG, GIF (max 10MB)
          </p>
        </div>

        <div>
          <label
            htmlFor="image-upload"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
          >
            Choose Image
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
