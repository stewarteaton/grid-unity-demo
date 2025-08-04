import { LoadingSteps as SharedLoadingSteps, ProcessingStep } from "../../../components";

interface LoadingStepsProps {
  currentStep: number;
}

const steps: ProcessingStep[] = [
  { step: 1, message: "Analyzing file format and structure..." },
  { step: 2, message: "Parsing power system components..." },
  { step: 3, message: "Extracting bus, load, and generator data..." },
  { step: 4, message: "Running AI analysis on system topology..." },
  { step: 5, message: "Generating recommendations and insights..." },
  { step: 6, message: "Finalizing results..." },
];

export const LoadingSteps = ({ currentStep }: LoadingStepsProps) => {
  const currentProcessingStep: ProcessingStep = {
    step: currentStep,
    message: steps[currentStep - 1]?.message || "Processing...",
  };

  return (
    <SharedLoadingSteps
      currentStep={currentProcessingStep}
      title="Processing with AI Analysis"
      steps={steps}
      showProgressBar={true}
      showTips={true}
      tipMessage="Larger files may take longer to process. The AI is analyzing your power system data to provide comprehensive insights."
    />
  );
};
