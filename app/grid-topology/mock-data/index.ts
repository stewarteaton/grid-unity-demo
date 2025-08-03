import { mockGeoJSONData } from "./GeoJSON";
import { mockOpenDSSData, mockOpenDSSDataFormatted } from "./OpenDSS";
import { mockPSLFData, mockPSLFDataFormatted } from "./PSLF";

// Export all mock data formats
export { mockGeoJSONData } from "./GeoJSON";
export { mockPSLFData, mockPSLFDataFormatted } from "./PSLF";
export { mockOpenDSSData, mockOpenDSSDataFormatted } from "./OpenDSS";

// Mock data format types
export interface MockDataFormat {
  name: string;
  description: string;
  data: string;
  formatted?: any;
}

// Available mock data formats
export const mockDataFormats: MockDataFormat[] = [
  {
    name: "GeoJSON",
    description: "Geographic JSON format with coordinates and properties",
    data: JSON.stringify(mockGeoJSONData, null, 2),
    formatted: mockGeoJSONData,
  },
  {
    name: "PSLF",
    description:
      "Power System Load Flow format with buses, generators, loads, and lines",
    data: mockPSLFData,
    formatted: mockPSLFDataFormatted,
  },
  {
    name: "OpenDSS",
    description:
      "Open Distribution System Simulator format with circuit definitions",
    data: mockOpenDSSData,
    formatted: mockOpenDSSDataFormatted,
  },
];
