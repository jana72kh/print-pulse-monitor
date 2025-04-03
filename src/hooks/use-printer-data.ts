
import { useEffect, useState } from 'react';
import { PrinterData, TemperatureDataPoint } from '@/types/printer';
import { printerSimulator } from '@/services/printerSimulator';

export function usePrinterData() {
  const [printerData, setPrinterData] = useState<PrinterData>(printerSimulator.getCurrentData());

  useEffect(() => {
    // Start simulation and subscribe to updates
    printerSimulator.startSimulation();
    const unsubscribe = printerSimulator.subscribe(setPrinterData);
    
    // Clean up on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  // Expose printer control methods
  const startPrint = () => printerSimulator.startPrint();
  const pausePrint = () => printerSimulator.pausePrint();
  const resumePrint = () => printerSimulator.resumePrint();
  const stopPrint = () => printerSimulator.stopPrint();
  const simulateError = () => printerSimulator.simulateError();
  const resetError = () => printerSimulator.resetError();

  return {
    printerData,
    controls: {
      startPrint,
      pausePrint,
      resumePrint,
      stopPrint,
      simulateError,
      resetError
    }
  };
}

export function usePrinterTemperatureHistory() {
  const [temperatureHistory, setTemperatureHistory] = useState<TemperatureDataPoint[]>(
    printerSimulator.getTemperatureHistory()
  );

  useEffect(() => {
    const unsubscribe = printerSimulator.subscribeToHistory(setTemperatureHistory);
    
    // Clean up on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  return temperatureHistory;
}
