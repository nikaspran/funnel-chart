import {Color} from "./colors.service";

export interface FunnelStep {
  id: string;
  backgroundColor: Color;
  background: string;
  border: string;
  name?: string;
  value?: number;
}

export interface Funnel {
  startValue: number;
  steps: FunnelStep[];
}
