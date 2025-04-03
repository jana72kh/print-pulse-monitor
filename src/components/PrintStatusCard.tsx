
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrinterStatus } from "@/types/printer";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, Pause, Play, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrintStatusCardProps {
  status: PrinterStatus;
  progress: number;
  printTime: number;
  fileName?: string;
  className?: string;
}

export default function PrintStatusCard({
  status,
  progress,
  printTime,
  fileName,
  className,
}: PrintStatusCardProps) {
  // Format print time (seconds) to HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'printing':
        return <Play className="h-5 w-5 text-orange-500" />;
      case 'paused':
        return <Pause className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'idle':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'printing':
        return "Printing";
      case 'paused':
        return "Paused";
      case 'error':
        return "Error";
      case 'idle':
        return "Ready";
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="bg-gray-800/50 p-3">
        <CardTitle className="flex items-center text-base font-medium">
          <span className="mr-2">{getStatusIcon()}</span>
          Status: {getStatusText()}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {status === 'printing' || status === 'paused' ? (
          <>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Progress</span>
                <span className="text-sm font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-gray-700" indicatorClassName="bg-orange-500" />
            </div>
            
            <div className="flex flex-col space-y-1">
              {fileName && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">File</span>
                  <span className="text-sm font-medium truncate max-w-[200px]">{fileName}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400 flex items-center">
                  <Clock className="h-4 w-4 mr-1" /> Print Time
                </span>
                <span className="text-sm font-medium">{formatTime(printTime)}</span>
              </div>
            </div>
          </>
        ) : status === 'error' ? (
          <div className="py-2 px-3 bg-red-900/20 text-red-400 rounded-md text-sm">
            Printer error! Please check the printer and reset.
          </div>
        ) : (
          <div className="py-2 text-gray-400 text-sm">
            Printer is ready. Start a new print job.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
