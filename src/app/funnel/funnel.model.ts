export interface FunnelStep {
  id: string;
  background: string;
  border: string;
  name?: string;
  value?: number;
}

export interface Funnel {
  startValue: number;
  steps: FunnelStep[];
}
