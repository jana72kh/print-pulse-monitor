
export type PrinterStatus = 'idle' | 'printing' | 'paused' | 'error';

export interface PrinterData {
  status: PrinterStatus;
  extruderTemp: number;
  extruderTarget: number;
  bedTemp: number;
  bedTarget: number;
  progress: number;
  printTime: number;
  fileName?: string;
  timestamp: number;
}

export interface TemperatureDataPoint {
  timestamp: number;
  extruderTemp: number;
  bedTemp: number;
}
