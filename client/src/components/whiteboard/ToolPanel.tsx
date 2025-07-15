import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Edit3, 
  Square, 
  Circle, 
  Minus, 
  Triangle, 
  ArrowRight,
  Smile,
  Star,
  Palette
} from "lucide-react";

interface ToolPanelProps {
  onEmojiClick: () => void;
  onToolChange?: (tool: string, color: string, lineWidth: number) => void;
}

export default function ToolPanel({ onEmojiClick, onToolChange }: ToolPanelProps) {
  const [selectedTool, setSelectedTool] = useState("pen");
  const [selectedColor, setSelectedColor] = useState("#6366F1");
  const [lineWidth, setLineWidth] = useState(3);
  const [isAnimating, setIsAnimating] = useState(false);

  const tools = [
    { id: "pen", icon: Edit3, label: "Pen Tool", shortcut: "P" },
    { id: "rectangle", icon: Square, label: "Rectangle", shortcut: "R" },
    { id: "circle", icon: Circle, label: "Circle", shortcut: "C" },
    { id: "line", icon: Minus, label: "Line", shortcut: "L" },
    { id: "triangle", icon: Triangle, label: "Triangle", shortcut: "T" },
    { id: "arrow", icon: ArrowRight, label: "Arrow", shortcut: "A" },
  ];

  const colors = [
    "#1F2937", // neutral-800
    "#6366F1", // primary
    "#EF4444", // red-500
    "#10B981", // green-500
    "#F59E0B", // amber-500
    "#8B5CF6", // purple-500
    "#EC4899", // pink-500
    "#06B6D4", // cyan-500
  ];

  // Notify parent component when tool changes
  useEffect(() => {
    if (onToolChange) {
      onToolChange(selectedTool, selectedColor, lineWidth);
    }
  }, [selectedTool, selectedColor, lineWidth, onToolChange]);

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  const handleLineWidthChange = (value: number[]) => {
    setLineWidth(value[0]);
  };

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-30 bg-white rounded-xl shadow-lg border border-neutral-200 p-2 space-y-2">
      {/* Tool Selection */}
      <div className="space-y-1">
        <div className="grid grid-cols-2 gap-1">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Button
                key={tool.id}
                variant={selectedTool === tool.id ? "default" : "ghost"}
                size="sm"
                className={`p-2 relative group transition-all duration-200 ${
                  selectedTool === tool.id
                    ? "bg-gradient-brand text-white hover:opacity-90 shadow-md transform scale-105"
                    : "hover:bg-neutral-100 hover:scale-105"
                } ${isAnimating && selectedTool === tool.id ? 'animate-pulse' : ''}`}
                onClick={() => handleToolSelect(tool.id)}
                title={`${tool.label} (${tool.shortcut})`}
              >
                <Icon className="w-4 h-4" />
                {selectedTool === tool.id && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full"></div>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Color Picker */}
      <div className="space-y-2">
        <div className="grid grid-cols-4 gap-1">
          {colors.map((color) => (
            <button
              key={color}
              className={`w-6 h-6 rounded-lg cursor-pointer hover:scale-110 transition-all duration-200 hover:shadow-lg ${
                selectedColor === color ? "ring-2 ring-neutral-400 ring-offset-1 shadow-md" : "hover:ring-1 hover:ring-neutral-300"
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorSelect(color)}
              title={`Color: ${color}`}
            />
          ))}
        </div>
        <input
          type="color"
          className="w-full h-8 rounded border border-neutral-300 cursor-pointer"
          value={selectedColor}
          onChange={(e) => handleColorSelect(e.target.value)}
        />
      </div>

      <Separator />

      {/* Line Width */}
      <div className="space-y-2">
        <div className="flex items-center space-x-1">
          <Minus className="w-3 h-3 text-neutral-600" />
          <Slider
            value={[lineWidth]}
            onValueChange={handleLineWidthChange}
            max={20}
            min={1}
            step={1}
            className="flex-1"
          />
          <Minus className="w-4 h-4 text-neutral-600" />
        </div>
        <div className="flex justify-center">
          <div
            className="rounded-full"
            style={{
              width: "32px",
              height: `${lineWidth}px`,
              backgroundColor: selectedColor,
            }}
          />
        </div>
      </div>

      <Separator />

      {/* Emoji Tool */}
      <Button
        variant="ghost"
        size="sm"
        className="w-full p-2 hover:bg-neutral-100"
        onClick={onEmojiClick}
        title="Add Emoji"
      >
        <Smile className="w-4 h-4" />
      </Button>
    </div>
  );
}
