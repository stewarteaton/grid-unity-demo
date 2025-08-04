# Grid Topology Explorer

A modular React application for parsing and visualizing electric transmission line and substation data.

## Structure

```
app/grid-topology/
├── components/           # React components
│   ├── DataInputSection.tsx
│   ├── NetworkVisualization.tsx
│   └── index.ts
├── hooks/               # Custom React hooks
│   ├── useGridTopology.ts
│   └── index.ts
├── utils/               # Utility functions
│   ├── parsers.ts       # Data parsing logic
│   ├── visualization.ts # Graph styling and export functions
│   └── index.ts
├── types.ts             # TypeScript type definitions
├── page.tsx             # Main page component
└── README.md            # This file
```

## Components

### DataInputSection

Handles the data input interface with tabs for demo data and paste data functionality.

### NetworkVisualization

Renders the interactive network graph with tooltips, statistics, and export functionality.

## Hooks

### useGridTopology

Custom hook that manages all the state and logic for the grid topology explorer, including:

- Data processing and parsing
- Graph interaction handlers
- Mouse position tracking
- Export functionality

## Utils

### parsers.ts

Contains all data parsing logic for different formats:

- `detectFormat()` - Detects the format of input data
- `parseTopologyData()` - Main parsing function
- `parseGeoJSONData()` - GeoJSON format parser
- `parsePSLFData()` - PSLF format parser
- `parseOpenDSSData()` - OpenDSS format parser

### visualization.ts

Contains visualization utilities:

- `getVoltageColor()` - Color coding based on voltage levels
- `getNodeColor()` - Node styling
- `getLinkColor()` - Link styling
- `exportGraphData()` - Data export functionality

## Types

Defines all TypeScript interfaces and types used throughout the application:

- `Substation` - Substation data structure
- `TransmissionLine` - Transmission line data structure
- `ParsedTopology` - Complete parsed topology data
- `GraphNode` & `GraphLink` - Graph visualization data structures
- `DemoFormat` & `ActiveTab` - UI state types

## Supported Formats

1. **GeoJSON** - Geographic JSON format with Point and LineString features
2. **PSLF** - Power System Load Flow format
3. **OpenDSS** - Open Distribution System Simulator format
4. **Custom JSON** - Custom format with substations and lines arrays

## Features

- Interactive network visualization using react-force-graph-2d
- Real-time hover tooltips with detailed information
- Color-coded voltage levels
- Data export functionality
- Responsive design
- Demo data for testing
- Format auto-detection
