
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TemperatureDataPoint } from "@/types/printer";
import { usePrinterTemperatureHistory } from "@/hooks/use-printer-data";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useMemo } from "react";

export default function TemperatureChart() {
  const temperatureHistory = usePrinterTemperatureHistory();
  
  // Process data for chart display - downsample to improve performance
  const chartData = useMemo(() => {
    if (temperatureHistory.length === 0) return [];
    
    // If we have lots of data points, we'll sample every n points to reduce chart complexity
    const dataPoints = temperatureHistory.length;
    const samplingRate = dataPoints > 300 ? Math.floor(dataPoints / 300) : 1;
    
    return temperatureHistory
      .filter((_, index) => index % samplingRate === 0)
      .map((point) => ({
        time: new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        extruderTemp: point.extruderTemp,
        bedTemp: point.bedTemp,
      }));
  }, [temperatureHistory]);

  return (
    <Card className="col-span-full">
      <CardHeader className="bg-card/50 p-4">
        <CardTitle className="text-lg font-medium">Temperature History</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[300px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <XAxis 
                  dataKey="time"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickLine={{ stroke: '#475569' }}
                  axisLine={{ stroke: '#475569' }}
                />
                <YAxis 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickLine={{ stroke: '#475569' }}
                  axisLine={{ stroke: '#475569' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '0.375rem' }}
                  labelStyle={{ color: '#f8fafc' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="extruderTemp" 
                  name="Extruder"
                  stroke="#8B5CF6" 
                  dot={false}
                  strokeWidth={2}
                  activeDot={{ r: 4 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="bedTemp" 
                  name="Bed"
                  stroke="#0EA5E9" 
                  dot={false}
                  strokeWidth={2}
                  activeDot={{ r: 4 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No temperature data available yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
