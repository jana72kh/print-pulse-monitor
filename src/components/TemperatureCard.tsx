
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemperatureCardProps {
  title: string;
  currentTemp: number;
  targetTemp: number;
  type: 'extruder' | 'bed' | 'pi';
  compact?: boolean;
  className?: string;
}

export default function TemperatureCard({
  title,
  currentTemp,
  targetTemp,
  type,
  compact = false,
  className,
}: TemperatureCardProps) {
  const isHeating = targetTemp > 0 && currentTemp < targetTemp;
  const isCooling = targetTemp === 0 && currentTemp > 25;
  
  // Color mapping based on type
  const getTypeColor = () => {
    switch (type) {
      case "extruder": return "orange";
      case "bed": return "cyan";
      case "pi": return "pink";
      default: return "gray";
    }
  };
  
  const colorClass = {
    "extruder": "bg-orange-500 text-orange-500",
    "bed": "bg-cyan-500 text-cyan-500",
    "pi": "bg-pink-500 text-pink-500"
  }[type] || "bg-gray-500 text-gray-500";
  
  // Calculate percentage for the progress indicator
  const maxTemp = type === 'extruder' ? 250 : type === 'bed' ? 100 : 80;
  const fillPercentage = Math.min(100, (currentTemp / maxTemp) * 100);

  // Compact view for the dashboard in the image
  if (compact) {
    return (
      <div className="flex items-center space-x-4">
        <div className={`w-1 h-8 ${colorClass.split(' ')[0]}`}></div>
        <div className="flex items-center space-x-2">
          <span className="text-sm">{title}</span>
        </div>
        <div className="flex-1"></div>
        <div className="text-xl font-bold">{Math.round(currentTemp)}</div>
      </div>
    );
  }

  // Standard card view
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className={cn(
        "bg-card/50 p-4",
        type === "extruder" ? "border-l-4 border-l-orange-500" : 
        type === "bed" ? "border-l-4 border-l-cyan-500" :
        "border-l-4 border-l-pink-500"
      )}>
        <CardTitle className="flex items-center text-lg font-medium">
          <Thermometer className={cn(
            "mr-2 h-5 w-5",
            type === "extruder" ? "text-orange-500" : 
            type === "bed" ? "text-cyan-500" :
            "text-pink-500",
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
                type === "extruder" ? "bg-orange-500" : 
                type === "bed" ? "bg-cyan-500" : 
                "bg-pink-500",
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
