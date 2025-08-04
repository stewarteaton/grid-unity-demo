import { LoadingSteps as SharedLoadingSteps, ProcessingStep } from "../../../components";

interface LoadingStepsProps {
  currentStep: ProcessingStep;
}

export function LoadingSteps({ currentStep }: LoadingStepsProps) {
  const steps: ProcessingStep[] = [
    { step: 1, message: "Converting image to base64..." },
    { step: 2, message: "Sending to OpenAI for analysis..." },
    { step: 3, message: "Processing results..." },
    { step: 4, message: "Analysis complete!" },
  ];

  return (
    <SharedLoadingSteps
      currentStep={currentStep}
      title="Analyzing Schematic"
      steps={steps}
    />
  );
}
