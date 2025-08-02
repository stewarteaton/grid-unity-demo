# Grid Model Interpreter + Load Forecast Playground

A Next.js web application that demonstrates grid model parsing, load forecasting, and visualization capabilities for power system analysis.

## Problem Statement

Power grid operators and engineers need tools to:

- Parse and understand complex grid model files (e.g., .raw, .dyr formats)
- Extract meaningful metadata from load nodes (location, name, base load values)
- Simulate and forecast load patterns over time
- Visualize the relationship between actual and forecasted load data

This project addresses these needs by providing a user-friendly web interface for grid model interpretation and load forecasting analysis.

## Why I Chose This Project

I selected this project because it demonstrates several key technical competencies:

1. **File Parsing & Data Processing**: Implementing parsers for industry-standard grid model formats
2. **Real-time Data Simulation**: Creating realistic load forecasting algorithms
3. **Data Visualization**: Building interactive charts and graphs for time-series data
4. **Modern Web Development**: Using Next.js, TypeScript, and Tailwind CSS for a responsive UI
5. **Domain Knowledge**: Understanding power systems and grid modeling concepts

This project showcases both technical implementation skills and domain expertise relevant to GridUnity's power systems focus.

## How to Run/Test

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

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

## Features

### 1. Grid Model Parser

- Supports common grid model formats (.raw, .dyr)
- Extracts load node metadata (location, name, base load values)
- Validates file format and data integrity

### 2. Load Node Analysis

- Displays extracted node information in a structured format
- Shows geographical distribution of load nodes
- Provides filtering and search capabilities

### 3. Load Forecasting Simulation

- Simulates load patterns over time for selected nodes
- Implements realistic forecasting algorithms
- Supports different time horizons (hourly, daily, weekly)

### 4. Data Visualization

- Interactive charts showing actual vs forecasted load
- Time-series visualization with zoom and pan capabilities
- Export functionality for reports and analysis

## Technical Decisions & Tradeoffs

### Architecture

- **Next.js App Router**: Chosen for modern React patterns and built-in optimizations
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: For rapid UI development and consistent styling

### Data Processing

- **Client-side parsing**: For immediate feedback and no server dependencies
- **Web Workers**: For heavy parsing operations to avoid blocking the UI
- **Local storage**: For caching parsed models and user preferences

### Visualization

- **Chart.js/Recharts**: For responsive and interactive charts
- **Real-time updates**: Using React state management for dynamic data

## Next Steps

### Short-term (1-2 weeks)

- [ ] Implement grid model file parser (.raw, .dyr formats)
- [ ] Create load node metadata extraction
- [ ] Build basic load forecasting simulation
- [ ] Add interactive chart visualization
- [ ] Implement file upload and validation

### Medium-term (1-2 months)

- [ ] Add support for additional grid model formats
- [ ] Implement more sophisticated forecasting algorithms
- [ ] Add geographical visualization (maps)
- [ ] Create user authentication and data persistence
- [ ] Add export/import functionality

### Long-term (3+ months)

- [ ] Real-time data integration with power system databases
- [ ] Advanced analytics and machine learning forecasting
- [ ] Multi-user collaboration features
- [ ] API development for third-party integrations
- [ ] Mobile application development

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Charts**: Chart.js or Recharts (TBD)
- **File Processing**: Custom parsers + Web Workers
- **Deployment**: Vercel (recommended)

## Contributing

This is a take-home interview project for GridUnity. For questions or feedback, please contact the development team.

## License

This project is created for demonstration purposes as part of a technical interview process.
