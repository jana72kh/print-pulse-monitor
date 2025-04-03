
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemperatureCardProps {
  title: string;
  currentTemp: number;
  targetTemp: number;
  type: 'extruder' | 'bed';
  className?: string;
}

export default function TemperatureCard({
  title,
  currentTemp,
  targetTemp,
  type,
  className,
}: TemperatureCardProps) {
  const isHeating = targetTemp > 0 && currentTemp < targetTemp;
  const isCooling = targetTemp === 0 && currentTemp > 25;
  
  // Calculate percentage for the progress indicator
  const maxTemp = type === 'extruder' ? 250 : 100;
  const fillPercentage = Math.min(100, (currentTemp / maxTemp) * 100);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className={cn(
        "bg-card/50 p-4",
        type === "extruder" ? "border-l-4 border-l-printer-extruder" : "border-l-4 border-l-printer-bed"
      )}>
        <CardTitle className="flex items-center text-lg font-medium">
          <Thermometer className={cn(
            "mr-2 h-5 w-5",
            type === "extruder" ? "text-printer-extruder" : "text-printer-bed",
            isHeating && "animate-pulse"
          )} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold">
              {currentTemp.toFixed(1)}°C
            </div>
            {targetTemp > 0 && (
              <div className="text-sm text-muted-foreground flex items-center">
                Target: <span className="font-semibold ml-1">{targetTemp}°C</span>
              </div>
            )}
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-500 ease-in-out rounded-full",
                type === "extruder" ? "bg-printer-extruder" : "bg-printer-bed",
                isHeating && "animate-pulse"
              )}
              style={{ width: `${fillPercentage}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {isHeating ? "Heating..." : isCooling ? "Cooling..." : targetTemp > 0 ? "Maintaining temperature" : "Idle"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
