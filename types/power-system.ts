export interface ParsedPowerSystemData {
  format: string;
  base_power?: number;
  buses?: Array<{
    id: string;
    name?: string;
    voltage?: number;
    vm?: number;
    va?: number;
  }>;
  loads?: Array<{
    bus_id: string;
    mw: number;
    mvar: number;
  }>;
  branches?: Array<{
    from: string;
    to: string;
    r: number;
    x: number;
  }>;
  generators?: Array<{
    id: string;
    bus_id: string;
    type?: string;
    base_mva?: number;
    inertia?: number;
  }>;
}

export interface AnalysisResult {
  summary?: {
    totalBuses?: number;
    totalLoads?: number;
    totalBranches?: number;
    totalGenerators?: number;
  };
  loadAnalysis?: {
    totalLoad?: number;
    message?: string;
  };
  topology?: string;
  recommendations?: string[];
  issues?: string[];
}

export interface ProcessingResult {
  success: boolean;
  parsedData?: ParsedPowerSystemData;
  analysis?: AnalysisResult;
  message?: string;
  error?: string;
}
