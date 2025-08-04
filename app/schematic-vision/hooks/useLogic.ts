import { useState } from "react";
import { ProcessingStep } from "../../../components";

export interface ProcessingResult {
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  error?: string;
}

export function useLogic() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [currentStep, setCurrentStep] = useState<ProcessingStep>({
    step: 0,
    message: "",
  });

  const handleImageUpload = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setSelectedImage(file);
    setResult(null); // Clear previous results
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    setResult(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const startProcessing = () => {
    setIsProcessing(true);
    setCurrentStep({ step: 1, message: "Analyzing image..." });
  };

  const updateProcessingStep = (step: ProcessingStep) => {
    setCurrentStep(step);
  };

  const finishProcessing = () => {
    setIsProcessing(false);
    setCurrentStep({ step: 0, message: "" });
  };

  return {
    selectedImage,
    isProcessing,
    result,
    isDragOver,
    currentStep,
    setResult,
    setIsProcessing,
    handleImageUpload,
    clearSelectedImage,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    startProcessing,
    updateProcessingStep,
    finishProcessing,
  };
}
