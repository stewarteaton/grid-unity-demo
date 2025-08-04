import { EmptyResultsPlaceholder as SharedEmptyResultsPlaceholder } from "../../../components";

export function EmptyResultsPlaceholder() {
  return (
    <SharedEmptyResultsPlaceholder
      title="No Analysis Results"
      description="Upload a single-line diagram image and click 'Analyze Schematic' to get started."
    />
  );
}
