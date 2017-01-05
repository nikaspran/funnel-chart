import {Color} from "./colors.service";

export interface FunnelStep {
  id: string;
  background: Color;
  border: Color;
  borderWidth: number;
  color: Color;
  name?: string;
  value?: number;
}

export interface Funnel {
  startValue: number;
  steps: FunnelStep[];
}
