import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Palette, Plus, Hash, LogOut, Users, Lock, Globe } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [roomCode, setRoomCode] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  
  // Create room form state
  const [isPublic, setIsPublic] = useState(true);
  const [roomPassword, setRoomPassword] = useState("");
  const [displayName, setDisplayName] = useState(user?.firstName || "");
  
  // Join room form state
  const [joinRoomCode, setJoinRoomCode] = useState("");
  const [joinPassword, setJoinPassword] = useState("");
  const [joinDisplayName, setJoinDisplayName] = useState(user?.firstName || "");

  const createRoomMutation = useMutation({
    mutationFn: async (data: { isPublic: boolean; password?: string; displayName: string }) => {
      const res = await apiRequest("POST", "/api/rooms", data);
      return res.json();
    },
    onSuccess: (room) => {
      toast({
        title: "Room Created",
        description: `Room ${room.code} created successfully!`,
      });
      setShowCreateDialog(false);
      navigate(`/room/${room.code}`);
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
        description: "Failed to create room. Please try again.",
        variant: "destructive",
      });
    },
  });

  const joinRoomMutation = useMutation({
    mutationFn: async (data: { code: string; password?: string; displayName: string }) => {
      const res = await apiRequest("POST", `/api/rooms/${data.code}/join`, {
        password: data.password,
        displayName: data.displayName,
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Joined Room",
        description: `Successfully joined room ${joinRoomCode}!`,
      });
      setShowJoinDialog(false);
      navigate(`/room/${joinRoomCode}`);
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
      if (error.message.includes("Invalid password")) {
        toast({
          title: "Invalid Password",
          description: "The password you entered is incorrect.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Error",
        description: "Failed to join room. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateRoom = () => {
    if (!displayName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your display name",
        variant: "destructive",
      });
      return;
    }
    
    if (!isPublic && !roomPassword.trim()) {
      toast({
        title: "Error",
        description: "Please enter a password for the private room",
        variant: "destructive",
      });
      return;
    }

    createRoomMutation.mutate({
      isPublic,
      password: isPublic ? undefined : roomPassword,
      displayName: displayName.trim(),
    });
  };

  const handleJoinRoom = () => {
    if (!joinRoomCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a room code",
        variant: "destructive",
      });
      return;
    }
    
    if (!joinDisplayName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your display name",
        variant: "destructive",
      });
      return;
    }

    joinRoomMutation.mutate({
      code: joinRoomCode.trim().toUpperCase(),
      password: joinPassword.trim() || undefined,
      displayName: joinDisplayName.trim(),
    });
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="min-h-screen bg-gradient-page">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-brand rounded-xl flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-800">CollabBoard</h1>
              <p className="text-neutral-600">Welcome back, {user?.firstName || 'User'}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Button>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Create Room */}
          <Card className="border-neutral-200 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-brand rounded-xl flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <CardTitle>Create New Room</CardTitle>
              <CardDescription>
                Start a new collaborative whiteboard session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-gradient-brand hover:opacity-90 text-white">
                    Create Room
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Room</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="create-display-name">Your Display Name</Label>
                      <Input
                        id="create-display-name"
                        type="text"
                        placeholder="Enter your name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="room-type"
                        checked={isPublic}
                        onCheckedChange={setIsPublic}
                      />
                      <Label htmlFor="room-type" className="flex items-center space-x-2">
                        {isPublic ? (
                          <>
                            <Globe className="w-4 h-4 text-green-600" />
                            <span>Public Room</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 text-purple-600" />
                            <span>Private Room</span>
                          </>
                        )}
                      </Label>
                    </div>
                    
                    {!isPublic && (
                      <div>
                        <Label htmlFor="room-password">Room Password</Label>
                        <Input
                          id="room-password"
                          type="password"
                          placeholder="Enter password for private room"
                          value={roomPassword}
                          onChange={(e) => setRoomPassword(e.target.value)}
                        />
                      </div>
                    )}
                    
                    <Button
                      onClick={handleCreateRoom}
                      disabled={createRoomMutation.isPending}
                      className="w-full bg-gradient-brand hover:opacity-90 text-white"
                    >
                      {createRoomMutation.isPending ? "Creating..." : "Create Room"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Join Room */}
          <Card className="border-neutral-200 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Hash className="w-8 h-8 text-white" />
              </div>
              <CardTitle>Join Existing Room</CardTitle>
              <CardDescription>
                Enter a room code to join a session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="outline">
                    Join Room
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Join Room</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="join-room-code">Room Code</Label>
                      <Input
                        id="join-room-code"
                        type="text"
                        placeholder="Enter room code (e.g., ABC123)"
                        value={joinRoomCode}
                        onChange={(e) => setJoinRoomCode(e.target.value.toUpperCase())}
                        className="text-center font-mono"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="join-display-name">Your Display Name</Label>
                      <Input
                        id="join-display-name"
                        type="text"
                        placeholder="Enter your name"
                        value={joinDisplayName}
                        onChange={(e) => setJoinDisplayName(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="join-password">Password (if private room)</Label>
                      <Input
                        id="join-password"
                        type="password"
                        placeholder="Enter password (leave empty for public rooms)"
                        value={joinPassword}
                        onChange={(e) => setJoinPassword(e.target.value)}
                      />
                    </div>
                    
                    <Button
                      onClick={handleJoinRoom}
                      disabled={joinRoomMutation.isPending}
                      className="w-full bg-gradient-brand hover:opacity-90 text-white"
                    >
                      {joinRoomMutation.isPending ? "Joining..." : "Join Room"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-neutral-800 mb-8">
            Why Choose CollabBoard?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-brand rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-neutral-800 mb-2">Real-time Collaboration</h3>
              <p className="text-neutral-600 text-sm">
                See changes instantly as your team draws and creates together
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-brand rounded-lg flex items-center justify-center mx-auto mb-4">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-neutral-800 mb-2">Powerful Tools</h3>
              <p className="text-neutral-600 text-sm">
                Full suite of drawing tools, shapes, colors, and emojis
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-brand rounded-lg flex items-center justify-center mx-auto mb-4">
                <Hash className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-neutral-800 mb-2">Easy Sharing</h3>
              <p className="text-neutral-600 text-sm">
                Share rooms with simple codes or direct links
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
