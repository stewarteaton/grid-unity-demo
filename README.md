# Grid Topology Explorer + Model Parser (AI) + Schematic Vision (AI)

A Next.js web application that demonstrates visualization capabilities for power system analysis, grid model parsing, and SLD vision analysis

## Problem Statement

Power grid operators and engineers need tools to:

- Visualize the grid topology data from files (GeoJSON, PSLF, OpenDSS)
- Parse and understand complex grid model files (e.g., .raw, .dyr formats)
- Extract meaningful metadata from load nodes (location, name, base load values)
- Convert schematic image diagrams into useful JSON data using AI vision

This project addresses these needs by providing a user-friendly web interface for grid visualization, model interpretation, and schematic vision processing.

## Why I Chose This Project

I selected this project because it touches several key technical competencies:

1. **UI Visualization**: Enabling graph view of from model text input
2. **File Parsing & Data Processing**: Implementing parsers for industry-standard grid model formats
3. **AI Text Analysis**: Leveraging LLM APIs to process model data & provide insights
4. **AI Vision Processing**: Exracting formatted data from SLD grid image diagrams
5. **Modern Web Development**: Using Next.js, TypeScript, and Tailwind CSS for a responsive UI

This project showcases both technical implementation skills and domain expertise relevant to GridUnity's power systems focus.

## How to Run/Test

### Prerequisites

- OpenAI API Key (for AI features)
- Node.js 18+
- npm, yarn, pnpm, or bun

### Environment Setup

Create a `.env.local` file in the root directory and add your OpenAI API key:

```bash
# Create .env.local file
touch .env.local
```

Add the following to your `.env.local` file:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

**Note**: Replace `your_openai_api_key_here` with your actual OpenAI API key. You can get one from [OpenAI's platform](https://platform.openai.com/api-keys).

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd grid-unity-demo

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Development

```bash
# Start the development server
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Testing

```bash
# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm run start
```

## Technical Decisions, Tradeoffs, & Next Steps

Technical Decisions

- I decided to leverage AI to generate mock data to use for the Grid Topology Explorer, and to create local parsing functions to translate the mock data into useful metrics like substations, lines, voltage, etc.
- I also decided to let AI determine how to create the prompts for OpenAI API to determine which metrics are useful given that I'm not educated in electrical grid domain
- By using NextJS and typescript, it allows me to quickly build a full stack app integrating responsive UIs connected with API

Trade Offs

- Because I was building this demo in a hurry, I didn't have time to search for bugs, implement testing, or verify that the parsing functions are all working as expected
- I also couldn't spend too much time doing research to verify if the AI analysis was useful for people in the industry

Next Steps

- Given more time I would setup testing and validate that the outputs from each feature were valuable to users
- Make the system more robust to handle different types of data inputs, or require specified formats
- I would also improve the OpenAI API request by using structured output to guarentee that we're receiving JSON in the desired format

### Architecture

- **Next.js App Router**: Chosen for modern React patterns and built-in optimizations
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: For rapid UI development and consistent styling
- **React Force Graph**: To visualize substation nodes and transmission lines

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **API**: Node.js, Typescript
- **Integartions**: OpenAI API
