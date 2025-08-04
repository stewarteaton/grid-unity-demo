export interface Substation {
  id: string;
  name: string;
  voltage?: number;
  coordinates?: [number, number];
}

export interface TransmissionLine {
  id: string;
  from: string;
  to: string;
  voltage?: number;
  lineType?: string;
}

export interface GraphNode {
  id: string;
  name: string;
  voltage?: number;
  x?: number;
  y?: number;
  type: "substation";
}

export interface GraphLink {
  id: string;
  source: string;
  target: string;
  voltage?: number;
  lineType?: string;
}

export interface ParsedTopology {
  substations: Substation[];
  lines: TransmissionLine[];
  graphData: {
    nodes: GraphNode[];
    links: GraphLink[];
  };
}

export type DemoFormat = "GeoJSON" | "PSLF" | "OpenDSS";
export type ActiveTab = "paste" | "demo";

export interface MousePosition {
  x: number;
  y: number;
}
