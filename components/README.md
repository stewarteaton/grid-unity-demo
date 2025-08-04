# Global Components

This directory contains shared components that are used across multiple features in the GridUnity Demo application.

## Components

### ProcessButton

A reusable button component for processing actions with loading states.

**Props:**

- `isProcessing: boolean` - Whether the action is currently processing
- `hasData: boolean` - Whether there is data available to process
- `onClick: () => void` - Click handler function
- `processingText?: string` - Text to show during processing (default: "Processing...")
- `defaultText?: string` - Text to show when not processing (default: "Process Data")
- `className?: string` - Additional CSS classes

**Usage:**

```tsx
import { ProcessButton } from "../components";

<ProcessButton
  isProcessing={isProcessing}
  hasData={hasData}
  onClick={handleProcess}
  processingText="Analyzing..."
  defaultText="Analyze Schematic"
/>;
```

### LoadingSteps

A reusable component for displaying processing steps with progress indicators.

**Props:**

- `currentStep: ProcessingStep` - Current step information
- `title?: string` - Title for the loading section (default: "Processing")
- `steps?: ProcessingStep[]` - Array of steps to display
- `showProgressBar?: boolean` - Whether to show progress bar (default: false)
- `showTips?: boolean` - Whether to show tips section (default: false)
- `tipMessage?: string` - Custom tip message

**Usage:**

```tsx
import { LoadingSteps, ProcessingStep } from "../components";

const steps: ProcessingStep[] = [
  { step: 1, message: "Initializing..." },
  { step: 2, message: "Processing..." },
  { step: 3, message: "Finalizing..." },
];

<LoadingSteps
  currentStep={{ step: 2, message: "Processing..." }}
  title="Analyzing Schematic"
  steps={steps}
  showProgressBar={true}
  showTips={true}
  tipMessage="This may take a few moments..."
/>;
```

### EmptyResultsPlaceholder

A reusable component for displaying empty state when no results are available.

**Props:**

- `title?: string` - Title for the empty state (default: "No Analysis Results")
- `description?: string` - Description text
- `icon?: React.ReactNode` - Custom icon component
- `className?: string` - Additional CSS classes

**Usage:**

```tsx
import { EmptyResultsPlaceholder } from "../components";

<EmptyResultsPlaceholder
  title="No Analysis Results"
  description="Upload data to get started."
/>;
```

## Type Definitions

### ProcessingStep

```typescript
interface ProcessingStep {
  step: number;
  message: string;
}
```

## Benefits of Shared Components

1. **Consistency**: Ensures consistent UI/UX across features
2. **Maintainability**: Changes to shared components automatically apply everywhere
3. **Reusability**: Reduces code duplication
4. **Customization**: Each feature can customize the components while maintaining the core functionality

## Feature-Specific Components

Some components remain feature-specific because they have different requirements:

- **Upload Areas**: File upload vs image upload have different validation and preview needs
- **Preview Components**: File preview vs image preview have different display requirements
- **Results Display**: Different data structures require different rendering approaches

## Adding New Shared Components

When creating new shared components:

1. Create the component in this directory
2. Export it from `index.ts`
3. Add proper TypeScript interfaces
4. Include comprehensive props for customization
5. Add documentation in this README
6. Update feature components to use the shared component
