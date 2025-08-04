import { z } from "zod";

// Zod schemas derived from TypeScript types
export const BusSchema = z.object({
  id: z.number(),
  name: z.string(),
  voltage: z.number(),
  vm: z.number(),
  va: z.number(),
});

export const LoadSchema = z.object({
  bus_id: z.number(),
  mw: z.number(),
  mvar: z.number(),
});

export const BranchSchema = z.object({
  from: z.number(),
  to: z.number(),
  r: z.number(),
  x: z.number(),
});

export const GeneratorSchema = z.object({
  id: z.number(),
  bus_id: z.number(),
  type: z.string().optional(),
  base_mva: z.number().optional(),
  inertia: z.number().optional(),
});

export const ParsedPowerSystemDataSchema = z.object({
  format: z.string(),
  base_power: z.number().optional(),
  buses: z.array(BusSchema).optional(),
  loads: z.array(LoadSchema).optional(),
  branches: z.array(BranchSchema).optional(),
  generators: z.array(GeneratorSchema).optional(),
});

export const SystemSummarySchema = z.object({
  totalBuses: z.number(),
  totalLoads: z.number(),
  totalBranches: z.number(),
  totalGenerators: z.number(),
  basePower: z.number().optional(),
  systemVoltageLevel: z.string().optional(),
});

export const LoadAnalysisSchema = z.object({
  totalLoadMW: z.number(),
  totalLoadMVAR: z.number(),
  peakLoadBus: z
    .object({
      busId: z.number(),
      loadMW: z.number(),
      loadMVAR: z.number(),
    })
    .optional(),
  loadDistribution: z
    .array(
      z.object({
        busId: z.number(),
        percentageMW: z.number(),
        percentageMVAR: z.number(),
      })
    )
    .optional(),
});

export const TopologyAnalysisSchema = z.object({
  connections: z.array(
    z.object({
      fromBus: z.number(),
      toBus: z.number(),
      impedance: z.string(),
    })
  ),
  networkType: z.string(),
  criticalPath: z.string(),
});

export const SystemRecommendationsSchema = z.object({
  voltageRegulation: z.string().optional(),
  loadBalancing: z.string().optional(),
  lossReduction: z.string().optional(),
});

export const SystemIssuesSchema = z.object({
  voltageDrop: z.string().optional(),
  reactivePowerSupport: z.string().optional(),
  noGenerators: z.string().optional(),
});

export const AnalysisResultSchema = z.object({
  summary: SystemSummarySchema.optional(),
  loadAnalysis: LoadAnalysisSchema.optional(),
  topology: TopologyAnalysisSchema.optional(),
  recommendations: SystemRecommendationsSchema.optional(),
  issues: SystemIssuesSchema.optional(),
});

export const ProcessingResultSchema = z.object({
  success: z.boolean(),
  parsedData: ParsedPowerSystemDataSchema.optional(),
  analysis: AnalysisResultSchema.optional(),
  message: z.string().optional(),
  error: z.string().optional(),
});

// TypeScript types derived from Zod schemas
export type Bus = z.infer<typeof BusSchema>;
export type Load = z.infer<typeof LoadSchema>;
export type Branch = z.infer<typeof BranchSchema>;
export type Generator = z.infer<typeof GeneratorSchema>;
export type ParsedPowerSystemData = z.infer<typeof ParsedPowerSystemDataSchema>;
export type SystemSummary = z.infer<typeof SystemSummarySchema>;
export type LoadAnalysis = z.infer<typeof LoadAnalysisSchema>;
export type TopologyAnalysis = z.infer<typeof TopologyAnalysisSchema>;
export type SystemRecommendations = z.infer<typeof SystemRecommendationsSchema>;
export type SystemIssues = z.infer<typeof SystemIssuesSchema>;
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
export type ProcessingResult = z.infer<typeof ProcessingResultSchema>;
