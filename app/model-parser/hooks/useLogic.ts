import { useState } from "react";
import { ProcessingResult } from "../../../types/power-system";

export type TabType = "upload" | "paste";

export const useLogic = () => {
  const [fileData, setFileData] = useState<string>("");
  const [pastedData, setPastedData] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("upload");
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileData(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setFileData("");
    // Reset the file input
    const fileInput = document.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileData(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handlePastedDataChange = (value: string) => {
    setPastedData(value);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const getDataToProcess = () => {
    return activeTab === "upload" ? fileData : pastedData;
  };

  const hasDataToProcess = () => {
    const data = getDataToProcess();
    return data.trim().length > 0;
  };

  return {
    // State
    fileData,
    pastedData,
    isProcessing,
    activeTab,
    result,
    selectedFile,
    isDragOver,

    // Actions
    setResult,
    setIsProcessing,
    handleFileUpload,
    clearSelectedFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handlePastedDataChange,
    handleTabChange,
    getDataToProcess,
    hasDataToProcess,
  };
};
