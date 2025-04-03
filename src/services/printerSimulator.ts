import { PrinterData, PrinterStatus, TemperatureDataPoint } from "@/types/printer";

// Constants for temperature ranges
const MIN_AMBIENT_TEMP = 20;
const MAX_EXTRUDER_TEMP = 250;
const MAX_BED_TEMP = 100;

class PrinterSimulator {
  private status: PrinterStatus = 'idle';
  private extruderTemp: number = MIN_AMBIENT_TEMP;
  private extruderTarget: number = 0;
  private bedTemp: number = MIN_AMBIENT_TEMP;
  private bedTarget: number = 0;
  private progress: number = 0;
  private printTime: number = 0;
  private fileName: string | undefined = undefined;
  private simInterval: number | null = null;
  private tempHistory: TemperatureDataPoint[] = [];
  private listeners: ((data: PrinterData) => void)[] = [];
  private historyListeners: ((data: TemperatureDataPoint[]) => void)[] = [];
  
  // Max history points to store (10 minutes at 1 data point per second)
  private maxHistoryPoints = 600;

  constructor() {
    // Initialize with an empty temperature history
    this.updateTempHistory();
  }

  private updateTempHistory() {
    const dataPoint: TemperatureDataPoint = {
      timestamp: Date.now(),
      extruderTemp: this.extruderTemp,
      bedTemp: this.bedTemp
    };
    
    this.tempHistory.push(dataPoint);
    
    // Keep only recent history
    if (this.tempHistory.length > this.maxHistoryPoints) {
      this.tempHistory.shift();
    }
    
    // Notify listeners
    this.historyListeners.forEach(listener => listener([...this.tempHistory]));
  }

  getCurrentData(): PrinterData {
    return {
      status: this.status,
      extruderTemp: Math.round(this.extruderTemp * 10) / 10,
      extruderTarget: this.extruderTarget,
      bedTemp: Math.round(this.bedTemp * 10) / 10,
      bedTarget: this.bedTarget,
      progress: this.progress,
      printTime: this.printTime,
      fileName: this.fileName,
      timestamp: Date.now()
    };
  }

  getTemperatureHistory(): TemperatureDataPoint[] {
    return [...this.tempHistory];
  }

  // Simulate random temperature fluctuations
  private simulateTemperatureChanges() {
    if (this.extruderTarget > 0) {
      // If heating up
      if (this.extruderTemp < this.extruderTarget) {
        // Heat up at a rate of 2-5 degrees per second with some randomness
        this.extruderTemp += (2 + Math.random() * 3) * Math.min(1, (this.extruderTarget - this.extruderTemp) / 50);
        if (this.extruderTemp > this.extruderTarget) {
          this.extruderTemp = this.extruderTarget;
        }
      } else {
        // Simulate small fluctuations around target
        this.extruderTemp += (Math.random() - 0.5) * 0.5;
        // Keep within small range of target
        if (Math.abs(this.extruderTemp - this.extruderTarget) > 2) {
          this.extruderTemp = this.extruderTarget + (Math.random() - 0.5) * 1.5;
        }
      }
    } else if (this.extruderTemp > MIN_AMBIENT_TEMP) {
      // Cool down when target is 0
      this.extruderTemp -= 0.5 + Math.random() * 0.5;
      if (this.extruderTemp < MIN_AMBIENT_TEMP) {
        this.extruderTemp = MIN_AMBIENT_TEMP;
      }
    }

    // Similar logic for bed temperature
    if (this.bedTarget > 0) {
      if (this.bedTemp < this.bedTarget) {
        // Bed heats up slower than extruder
        this.bedTemp += (1 + Math.random() * 2) * Math.min(1, (this.bedTarget - this.bedTemp) / 30);
        if (this.bedTemp > this.bedTarget) {
          this.bedTemp = this.bedTarget;
        }
      } else {
        // Simulate small fluctuations around target
        this.bedTemp += (Math.random() - 0.5) * 0.3;
        // Keep within small range of target
        if (Math.abs(this.bedTemp - this.bedTarget) > 1.5) {
          this.bedTemp = this.bedTarget + (Math.random() - 0.5) * 1;
        }
      }
    } else if (this.bedTemp > MIN_AMBIENT_TEMP) {
      // Cool down when target is 0
      this.bedTemp -= 0.2 + Math.random() * 0.3;
      if (this.bedTemp < MIN_AMBIENT_TEMP) {
        this.bedTemp = MIN_AMBIENT_TEMP;
      }
    }
  }

  // Simulate print progress
  private simulatePrintProgress() {
    if (this.status === 'printing') {
      // Progress increases by 0.05-0.15% per second
      this.progress += (0.05 + Math.random() * 0.1);
      this.printTime += 1;
      
      // Check if print is complete
      if (this.progress >= 100) {
        this.progress = 100;
        this.status = 'idle';
        this.extruderTarget = 0;
        this.bedTarget = 0;
        this.fileName = undefined;
      }
    }
  }

  startSimulation() {
    if (this.simInterval === null) {
      this.simInterval = window.setInterval(() => {
        this.simulateTemperatureChanges();
        this.simulatePrintProgress();
        this.updateTempHistory();
        
        const currentData = this.getCurrentData();
        this.listeners.forEach(listener => listener(currentData));
      }, 1000); // update every second
    }
  }

  stopSimulation() {
    if (this.simInterval !== null) {
      clearInterval(this.simInterval);
      this.simInterval = null;
    }
  }

  // Control methods
  startPrint(fileName: string = "sample_print.gcode") {
    if (this.status !== 'printing') {
      this.extruderTarget = 200 + Math.floor(Math.random() * 15);
      this.bedTarget = 50 + Math.floor(Math.random() * 15);
      this.fileName = fileName;
      this.progress = 0;
      this.printTime = 0;
      this.status = 'printing';
      
      const currentData = this.getCurrentData();
      this.listeners.forEach(listener => listener(currentData));
    }
  }

  pausePrint() {
    if (this.status === 'printing') {
      this.status = 'paused';
      
      const currentData = this.getCurrentData();
      this.listeners.forEach(listener => listener(currentData));
    }
  }

  resumePrint() {
    if (this.status === 'paused') {
      this.status = 'printing';
      
      const currentData = this.getCurrentData();
      this.listeners.forEach(listener => listener(currentData));
    }
  }

  stopPrint() {
    if (this.status === 'printing' || this.status === 'paused') {
      this.status = 'idle';
      this.extruderTarget = 0;
      this.bedTarget = 0;
      this.progress = 0;
      this.printTime = 0;
      this.fileName = undefined;
      
      const currentData = this.getCurrentData();
      this.listeners.forEach(listener => listener(currentData));
    }
  }

  simulateError() {
    this.status = 'error';
    const currentData = this.getCurrentData();
    this.listeners.forEach(listener => listener(currentData));
  }

  resetError() {
    if (this.status === 'error') {
      this.status = 'idle';
      const currentData = this.getCurrentData();
      this.listeners.forEach(listener => listener(currentData));
    }
  }

  // Subscribe to data updates
  subscribe(callback: (data: PrinterData) => void) {
    this.listeners.push(callback);
    // Immediately provide current data
    callback(this.getCurrentData());
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Subscribe to temperature history updates
  subscribeToHistory(callback: (data: TemperatureDataPoint[]) => void) {
    this.historyListeners.push(callback);
    // Immediately provide current history
    callback([...this.tempHistory]);
    return () => {
      this.historyListeners = this.historyListeners.filter(listener => listener !== callback);
    };
  }
}

// Create a singleton instance
export const printerSimulator = new PrinterSimulator();
