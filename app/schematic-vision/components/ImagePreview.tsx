import React, { useState } from "react";

interface ImagePreviewProps {
  image: File;
}

export function ImagePreview({ image }: ImagePreviewProps) {
  const [imageUrl, setImageUrl] = useState<string>("");

  React.useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target?.result as string);
    };
    reader.readAsDataURL(image);
  }, [image]);

  if (!imageUrl) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <p className="text-gray-500">Loading image preview...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Image Preview</h3>
      <div className="relative">
        <img
          src={imageUrl}
          alt="Uploaded schematic"
          className="max-w-full h-auto rounded-lg border border-gray-300 shadow-sm"
          style={{ maxHeight: "400px" }}
        />
      </div>
    </div>
  );
}
