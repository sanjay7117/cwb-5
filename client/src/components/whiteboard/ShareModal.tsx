import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { X, Copy } from "lucide-react";
import type { Room } from "@shared/schema";

interface ShareModalProps {
  room: Room;
  onClose: () => void;
}

export default function ShareModal({ room, onClose }: ShareModalProps) {
  const { toast } = useToast();
  const [isPublic, setIsPublic] = useState(room.isPublic);
  const [allowDrawing, setAllowDrawing] = useState(room.allowDrawing);

  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: { isPublic: boolean; allowDrawing: boolean }) => {
      const res = await apiRequest("PUT", `/api/rooms/${room.code}/settings`, settings);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rooms", room.code] });
      toast({
        title: "Settings Updated",
        description: "Room settings have been updated successfully.",
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
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCopyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(room.code);
      toast({
        title: "Copied!",
        description: "Room code copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy room code.",
        variant: "destructive",
      });
    }
  };

  const handleCopyShareLink = async () => {
    const shareUrl = `${window.location.origin}/room/${room.code}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Copied!",
        description: "Share link copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy share link.",
        variant: "destructive",
      });
    }
  };

  const handlePublicToggle = (value: boolean) => {
    setIsPublic(value);
    updateSettingsMutation.mutate({ isPublic: value, allowDrawing });
  };

  const handleDrawingToggle = (value: boolean) => {
    setAllowDrawing(value);
    updateSettingsMutation.mutate({ isPublic, allowDrawing: value });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <Card className="max-w-md w-full mx-4 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Share Room</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-neutral-700 mb-2 block">
              Room Code
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                value={room.code}
                readOnly
                className="flex-1 bg-neutral-50 font-mono text-center"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyRoomCode}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-neutral-700 mb-2 block">
              Share Link
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                value={`${window.location.origin}/room/${room.code}`}
                readOnly
                className="flex-1 bg-neutral-50 text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyShareLink}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-medium text-neutral-700 mb-3">Room Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="public-room" className="text-sm text-neutral-700">
                  Public Room
                </Label>
                <Switch
                  id="public-room"
                  checked={isPublic}
                  onCheckedChange={handlePublicToggle}
                  disabled={updateSettingsMutation.isPending}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="allow-drawing" className="text-sm text-neutral-700">
                  Allow Drawing
                </Label>
                <Switch
                  id="allow-drawing"
                  checked={allowDrawing}
                  onCheckedChange={handleDrawingToggle}
                  disabled={updateSettingsMutation.isPending}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
