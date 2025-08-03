export interface Bus {
  id: number;
  name: string;
  voltage: number;
  vm: number;
  va: number;
}

export interface Load {
  bus_id: number;
  mw: number;
  mvar: number;
}

export interface Branch {
  from: number;
  to: number;
  r: number;
  x: number;
}

export interface Generator {
  id: number;
  bus_id: number;
  type?: string;
  base_mva?: number;
  inertia?: number;
}

export interface ParsedPowerSystemData {
  format: string;
  base_power?: number;
  buses?: Bus[];
  loads?: Load[];
  branches?: Branch[];
  generators?: Generator[];
}

export interface SystemSummary {
  totalBuses: number;
  totalLoads: number;
  totalBranches: number;
  totalGenerators: number;
  basePower?: number;
  systemVoltageLevel?: string;
}

export interface LoadAnalysis {
  totalLoadMW: number;
  totalLoadMVAR: number;
  peakLoadBus?: {
    busId: number;
    loadMW: number;
    loadMVAR: number;
  };
  loadDistribution?: Array<{
    busId: number;
    percentageMW: number;
    percentageMVAR: number;
  }>;
}

export interface TopologyAnalysis {
  connections: Array<{
    fromBus: number;
    toBus: number;
    impedance: string;
  }>;
  networkType: string;
  criticalPath: string;
}

export interface SystemRecommendations {
  voltageRegulation?: string;
  loadBalancing?: string;
  lossReduction?: string;
}

export interface SystemIssues {
  voltageDrop?: string;
  reactivePowerSupport?: string;
  noGenerators?: string;
}

export interface AnalysisResult {
  summary: SystemSummary;
  loadAnalysis: LoadAnalysis;
  topology: TopologyAnalysis;
  recommendations: SystemRecommendations;
  issues: SystemIssues;
}

export interface ProcessingResult {
  success: boolean;
  parsedData?: ParsedPowerSystemData;
  analysis?: AnalysisResult;
  message?: string;
  error?: string;
}
