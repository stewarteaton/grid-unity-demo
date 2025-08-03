interface FilePreviewProps {
  content: string;
}

export const FilePreview = ({ content }: FilePreviewProps) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-medium text-gray-900 mb-2">File Content Preview:</h3>
      <div className="bg-white border rounded-lg p-3 max-h-40 overflow-y-auto">
        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
          {content.substring(0, 500)}...
        </pre>
      </div>
    </div>
  );
};
