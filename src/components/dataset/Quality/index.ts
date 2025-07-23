// Barrel export para componentes de Quality
export { default as DataQuality } from "./DataQuality";
export { default as DataQualityBadge } from "./Badge";
export { default as RadarChart } from "./Chart";

// Default export pointing to main component
export { default } from "./DataQuality";

// Re-export tipos si los necesitamos
export type { DataQuality as DataQualityType } from "../../../types/dataset";
