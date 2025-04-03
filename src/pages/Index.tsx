
import { usePrinterData } from "@/hooks/use-printer-data";
import TemperatureCard from "@/components/TemperatureCard";
import PrintStatusCard from "@/components/PrintStatusCard";
import PrinterControls from "@/components/PrinterControls";
import TemperatureChart from "@/components/TemperatureChart";
import { useEffect } from "react";

const Index = () => {
  const { printerData } = usePrinterData();
  const { extruderTemp, extruderTarget, bedTemp, bedTarget, status, progress, printTime, fileName } = printerData;

  // Update page title to show printer status
  useEffect(() => {
    document.title = `PrintPulse - ${status.charAt(0).toUpperCase() + status.slice(1)}`;
  }, [status]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">
            PrintPulse <span className="text-primary">Monitor</span>
          </h1>
          <p className="text-sm text-muted-foreground">Real-time 3D printer monitoring dashboard</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Temperature Cards */}
          <TemperatureCard
            title="Extruder Temperature"
            currentTemp={extruderTemp}
            targetTemp={extruderTarget}
            type="extruder"
          />
          
          <TemperatureCard
            title="Bed Temperature"
            currentTemp={bedTemp}
            targetTemp={bedTarget}
            type="bed"
          />
          
          {/* Print Status Card */}
          <PrintStatusCard
            status={status}
            progress={progress}
            printTime={printTime}
            fileName={fileName}
          />
          
          {/* Printer Controls */}
          <PrinterControls className="col-span-full md:col-span-2 lg:col-span-3" />
          
          {/* Temperature Chart */}
          <TemperatureChart />
        </div>
      </main>
      
      <footer className="border-t border-border bg-card/30 mt-8">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          PrintPulse Monitor - Simulating real-time 3D printer data
        </div>
      </footer>
    </div>
  );
};

export default Index;
