
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PrinterStatus } from "@/types/printer";
import { Play, Pause, Stop, AlertCircle, Loader } from "lucide-react";
import { usePrinterData } from "@/hooks/use-printer-data";
import { cn } from "@/lib/utils";

interface PrinterControlsProps {
  className?: string;
}

export default function PrinterControls({ className }: PrinterControlsProps) {
  const { printerData, controls } = usePrinterData();
  const { status } = printerData;
  
  return (
    <Card className={cn(className)}>
      <CardHeader className="bg-card/50 p-4">
        <CardTitle className="text-lg font-medium">Printer Controls</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            disabled={status === 'printing' || status === 'error'}
            onClick={controls.startPrint}
          >
            <Play className="h-4 w-4 text-green-500" />
            Start Print
          </Button>
          
          {status === 'printing' ? (
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={controls.pausePrint}
            >
              <Pause className="h-4 w-4 text-yellow-500" />
              Pause
            </Button>
          ) : status === 'paused' ? (
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={controls.resumePrint}
            >
              <Play className="h-4 w-4 text-green-500" />
              Resume
            </Button>
          ) : null}
          
          <Button
            variant="outline"
            className="flex-1 gap-2"
            disabled={status !== 'printing' && status !== 'paused'}
            onClick={controls.stopPrint}
          >
            <Stop className="h-4 w-4 text-red-500" />
            Stop Print
          </Button>
          
          {status === 'error' ? (
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={controls.resetError}
            >
              <Loader className="h-4 w-4 text-blue-500" />
              Reset Error
            </Button>
          ) : (
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={controls.simulateError}
            >
              <AlertCircle className="h-4 w-4 text-red-500" />
              Simulate Error
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
