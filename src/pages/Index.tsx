
import { usePrinterData } from "@/hooks/use-printer-data";
import TemperatureCard from "@/components/TemperatureCard";
import PrintStatusCard from "@/components/PrintStatusCard";
import PrinterControls from "@/components/PrinterControls";
import TemperatureChart from "@/components/TemperatureChart";
import { useEffect } from "react";
import { Home, Thermometer, Settings, Printer, Compass } from "lucide-react";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

const Index = () => {
  const { printerData } = usePrinterData();
  const { extruderTemp, extruderTarget, bedTemp, bedTarget, status, progress, printTime, fileName } = printerData;

  // Update page title to show printer status
  useEffect(() => {
    document.title = `3D Printer | ${status.charAt(0).toUpperCase() + status.slice(1)}`;
  }, [status]);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <h1 className="text-xl font-bold">
            3D Printer <span className="text-gray-400">| Home</span>
          </h1>
          <div className="text-right text-lg">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-4">
          {/* Left column - Temperature display */}
          <div className="col-span-12 md:col-span-4 bg-gray-900 p-4 rounded-lg">
            <h2 className="text-xl mb-4">Temp (°C)</h2>
            
            <div className="space-y-6">
              <TemperatureCard
                title="Extruder"
                currentTemp={extruderTemp}
                targetTemp={extruderTarget}
                type="extruder"
                compact={true}
              />
              
              <TemperatureCard
                title="Heater bed"
                currentTemp={bedTemp}
                targetTemp={bedTarget}
                type="bed"
                compact={true}
              />
              
              <TemperatureCard
                title="Pi"
                currentTemp={44}
                targetTemp={0}
                type="pi"
                compact={true}
              />
            </div>
            
            {/* Temperature Chart */}
            <div className="mt-6">
              <TemperatureChart compact={true} />
            </div>
          </div>
          
          {/* Right column - Navigation and controls */}
          <div className="col-span-12 md:col-span-8 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <NavigationButton 
                icon={<Home className="h-8 w-8" />} 
                label="Homing" 
                color="orange" 
              />
              <NavigationButton 
                icon={<Thermometer className="h-8 w-8" />} 
                label="Temperature" 
                color="pink" 
              />
              <NavigationButton 
                icon={<Compass className="h-8 w-8" />} 
                label="Actions" 
                color="cyan" 
              />
              <NavigationButton 
                icon={<Settings className="h-8 w-8" />} 
                label="Configuration" 
                color="lime" 
              />
              <NavigationButton 
                icon={<Printer className="h-8 w-8" />} 
                label="Print" 
                color="white" 
              />
            </div>
            
            {/* Print Status */}
            <PrintStatusCard
              status={status}
              progress={progress}
              printTime={printTime}
              fileName={fileName}
              className="bg-gray-900"
            />
            
            {/* Printer Controls */}
            <PrinterControls className="bg-gray-900" />
          </div>
        </div>
      </main>
    </div>
  );
};

// Navigation button component for the main actions
const NavigationButton = ({ icon, label, color }) => {
  const colorMap = {
    orange: "bg-orange-500",
    pink: "bg-pink-500", 
    cyan: "bg-cyan-500",
    lime: "bg-lime-500",
    white: "bg-white",
  };
  
  return (
    <div className="flex flex-col items-center bg-gray-900 p-4 rounded-lg">
      <div className="mb-2">{icon}</div>
      <div className="text-sm">{label}</div>
      <div className={`h-1 w-full mt-2 ${colorMap[color]}`}></div>
    </div>
  );
};

export default Index;
