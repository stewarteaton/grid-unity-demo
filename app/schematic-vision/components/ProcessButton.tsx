import { ProcessButton as SharedProcessButton } from "../../../components";

interface ProcessButtonProps {
  isProcessing: boolean;
  hasData: boolean;
  onClick: () => void;
}

export function ProcessButton({
  isProcessing,
  hasData,
  onClick,
}: ProcessButtonProps) {
  return (
    <SharedProcessButton
      isProcessing={isProcessing}
      hasData={hasData}
      onClick={onClick}
      processingText="Analyzing..."
      defaultText="Analyze Schematic"
    />
  );
}
