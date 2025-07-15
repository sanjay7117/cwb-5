import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Undo, Redo, Trash2 } from "lucide-react";
import type { CanvasData } from "@shared/schema";

interface CanvasProps {
  canvasData: CanvasData[];
  onSave: (tool: string, data: any) => void;
  onClear: () => void;
  isCreator: boolean;
}

export default function Canvas({ canvasData, onSave, onClear, isCreator }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState("pen");
  const [currentColor, setCurrentColor] = useState("#6366F1");
  const [currentLineWidth, setCurrentLineWidth] = useState(3);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Set up canvas properties
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.imageSmoothingEnabled = true;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  useEffect(() => {
    // Render canvas data
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    canvasData.forEach((item) => {
      renderCanvasItem(ctx, item);
    });
  }, [canvasData]);

  const renderCanvasItem = (ctx: CanvasRenderingContext2D, item: CanvasData) => {
    const { tool, data } = item;
    
    ctx.save();
    ctx.strokeStyle = data.color || "#6366F1";
    ctx.lineWidth = data.lineWidth || 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    switch (tool) {
      case "pen":
        if (data.points && data.points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(data.points[0].x, data.points[0].y);
          for (let i = 1; i < data.points.length; i++) {
            ctx.lineTo(data.points[i].x, data.points[i].y);
          }
          ctx.stroke();
        }
        break;
      
      case "rectangle":
        ctx.strokeRect(data.x, data.y, data.width, data.height);
        break;
      
      case "circle":
        ctx.beginPath();
        ctx.arc(data.x + data.radius, data.y + data.radius, data.radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      
      case "line":
        ctx.beginPath();
        ctx.moveTo(data.startX, data.startY);
        ctx.lineTo(data.endX, data.endY);
        ctx.stroke();
        break;
      
      case "emoji":
        ctx.font = `${data.size || 24}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(data.emoji, data.x, data.y);
        break;
    }

    ctx.restore();
  };

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    setIsDrawing(true);
    
    if (currentTool === "pen") {
      // Start drawing path
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || currentTool !== "pen") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pos = getMousePos(e);
    
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentLineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const pos = getMousePos(e);
    setIsDrawing(false);

    // Save the drawing action
    if (currentTool === "pen") {
      // For pen tool, we would need to track the path points
      // This is a simplified version
      onSave(currentTool, {
        points: [pos], // In a real implementation, track all points
        color: currentColor,
        lineWidth: currentLineWidth,
      });
    }

    saveCanvasState();
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      setHistoryStep(historyStep - 1);
      const imageData = history[historyStep - 1];
      ctx.putImageData(imageData, 0, 0);
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      setHistoryStep(historyStep + 1);
      const imageData = history[historyStep + 1];
      ctx.putImageData(imageData, 0, 0);
    }
  };

  const handleClear = () => {
    if (isCreator) {
      onClear();
    }
  };

  return (
    <div className="relative">
      {/* Canvas Controls */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30 bg-white rounded-xl shadow-lg border border-neutral-200 p-2 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full p-2 hover:bg-neutral-100"
          onClick={handleUndo}
          disabled={historyStep <= 0}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full p-2 hover:bg-neutral-100"
          onClick={handleRedo}
          disabled={historyStep >= history.length - 1}
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </Button>
        
        <div className="h-px bg-neutral-200"></div>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full p-2 hover:bg-red-50 text-red-600"
          onClick={handleClear}
          disabled={!isCreator}
          title={isCreator ? "Clear Canvas" : "Only room creator can clear canvas"}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Drawing Canvas */}
      <div
        className="bg-white rounded-xl shadow-lg border border-neutral-200 mx-auto cursor-crosshair"
        style={{
          width: "calc(100vw - 240px)",
          height: "calc(100vh - 140px)",
          maxWidth: "1200px",
        }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full rounded-xl"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => setIsDrawing(false)}
        />
      </div>

      {/* Mobile Tool Panel */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 md:hidden z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant={currentTool === "pen" ? "default" : "ghost"}
              size="sm"
              className={currentTool === "pen" ? "bg-gradient-brand text-white" : ""}
              onClick={() => setCurrentTool("pen")}
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              variant={currentTool === "rectangle" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentTool("rectangle")}
            >
              <Square className="w-4 h-4" />
            </Button>
            <Button
              variant={currentTool === "circle" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentTool("circle")}
            >
              <Circle className="w-4 h-4" />
            </Button>
            <Button
              variant={currentTool === "line" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentTool("line")}
            >
              <Minus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="color"
              className="w-8 h-8 rounded border border-neutral-300 cursor-pointer"
              value={currentColor}
              onChange={(e) => setCurrentColor(e.target.value)}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUndo}
              disabled={historyStep <= 0}
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRedo}
              disabled={historyStep >= history.length - 1}
            >
              <Redo className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
