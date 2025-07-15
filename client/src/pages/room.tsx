import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/whiteboard/Header";
import Canvas from "@/components/whiteboard/Canvas";
import ToolPanel from "@/components/whiteboard/ToolPanel";
import StatusBar from "@/components/whiteboard/StatusBar";
import EmojiPicker from "@/components/whiteboard/EmojiPicker";
import ShareModal from "@/components/whiteboard/ShareModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import type { Room, CanvasData } from "@shared/schema";

export default function RoomPage() {
  const { code } = useParams<{ code: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());
  const [currentTool, setCurrentTool] = useState("pen");
  const [currentColor, setCurrentColor] = useState("#6366F1");

  // Fetch room data
  const { data: room, isLoading: roomLoading, error: roomError } = useQuery({
    queryKey: ["/api/rooms", code],
    enabled: !!code,
    retry: false,
  });

  // Fetch participants
  const { data: participants } = useQuery({
    queryKey: ["/api/rooms", code, "participants"],
    enabled: !!code,
    refetchInterval: 5000, // Poll every 5 seconds
  });

  // Fetch canvas data
  const { data: canvasData } = useQuery({
    queryKey: ["/api/rooms", code, "canvas"],
    enabled: !!code,
    refetchInterval: 2000, // Poll every 2 seconds for real-time updates
  });

  // Join room mutation
  const joinRoomMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/rooms/${code}/join`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rooms", code, "participants"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to join room. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Heartbeat mutation to keep user active
  const heartbeatMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/rooms/${code}/heartbeat`);
      return res.json();
    },
  });

  // Save canvas data mutation
  const saveCanvasDataMutation = useMutation({
    mutationFn: async (data: { tool: string; data: any }) => {
      const res = await apiRequest("POST", `/api/rooms/${code}/canvas`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rooms", code, "canvas"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to save drawing. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Clear canvas mutation
  const clearCanvasMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("DELETE", `/api/rooms/${code}/canvas`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rooms", code, "canvas"] });
      toast({
        title: "Canvas Cleared",
        description: "The canvas has been cleared successfully.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to clear canvas. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Join room on mount
  useEffect(() => {
    if (code && room) {
      joinRoomMutation.mutate();
    }
  }, [code, room]);

  // Heartbeat interval
  useEffect(() => {
    if (code && room) {
      const interval = setInterval(() => {
        heartbeatMutation.mutate();
      }, 30000); // Send heartbeat every 30 seconds

      return () => clearInterval(interval);
    }
  }, [code, room]);

  // Handle canvas data save
  const handleCanvasDataSave = (tool: string, data: any) => {
    saveCanvasDataMutation.mutate({ tool, data });
  };

  // Handle clear canvas
  const handleClearCanvas = () => {
    clearCanvasMutation.mutate();
  };

  // Handle tool change with interactive feedback
  const handleToolChange = (tool: string, color: string, lineWidth: number) => {
    if (tool !== currentTool) {
      setCurrentTool(tool);
      toast({
        title: `${tool.charAt(0).toUpperCase() + tool.slice(1)} Tool Selected`,
        description: `Now drawing with ${tool}`,
        duration: 2000,
      });
    }
    if (color !== currentColor) {
      setCurrentColor(color);
    }
  };

  // Handle emoji selection with feedback
  const handleEmojiSelect = (emoji: string) => {
    // Add emoji to canvas center
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = rect.width / 2;
      const y = rect.height / 2;
      
      saveCanvasDataMutation.mutate({
        tool: "emoji",
        data: {
          x,
          y,
          emoji,
        },
      });
      
      toast({
        title: "Emoji Added!",
        description: `Added ${emoji} to the canvas`,
        duration: 1500,
      });
    }
    
    setShowEmojiPicker(false);
  };

  if (roomLoading) {
    return (
      <div className="min-h-screen bg-gradient-page">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (roomError) {
    return (
      <div className="min-h-screen bg-gradient-page flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <h1 className="text-2xl font-bold text-neutral-900">Room Not Found</h1>
            </div>
            <p className="mt-4 text-sm text-neutral-600">
              The room code "{code}" does not exist or you don't have permission to access it.
            </p>
            <Button
              className="mt-4 w-full"
              onClick={() => window.location.href = "/"}
            >
              Go Back Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-page">
      <Header
        room={room}
        participants={participants || []}
        onShare={() => setShowShareModal(true)}
      />
      
      <main className="pt-20 pb-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <ToolPanel
              onEmojiClick={() => setShowEmojiPicker(true)}
              onToolChange={handleToolChange}
            />
            
            <Canvas
              canvasData={canvasData || []}
              onSave={handleCanvasDataSave}
              onClear={handleClearCanvas}
              isCreator={room?.createdBy === user?.id}
            />
            
            <StatusBar
              isConnected={true}
              participantCount={participants?.length || 0}
              lastSaved={lastSync}
            />
          </div>
        </div>
      </main>

      {showEmojiPicker && (
        <EmojiPicker
          onClose={() => setShowEmojiPicker(false)}
          onEmojiSelect={handleEmojiSelect}
        />
      )}

      {showShareModal && (
        <ShareModal
          room={room}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}
