import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Palette, Hash, Share, Menu, X } from "lucide-react";
import type { Room, RoomParticipant } from "@shared/schema";

interface HeaderProps {
  room: Room;
  participants: RoomParticipant[];
  onShare: () => void;
}

export default function Header({ room, participants, onShare }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitials = (userId: string) => {
    return userId.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (userId: string) => {
    const colors = [
      "bg-gradient-to-r from-blue-500 to-purple-500",
      "bg-gradient-to-r from-green-500 to-teal-500",
      "bg-gradient-to-r from-orange-500 to-red-500",
      "bg-gradient-to-r from-purple-500 to-pink-500",
      "bg-gradient-to-r from-teal-500 to-blue-500",
    ];
    const index = userId.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo and Room Info */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-brand rounded-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-neutral-800">CollabBoard</span>
          </div>
          
          {/* Room Info */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1 bg-neutral-100 rounded-full">
              <Hash className="w-4 h-4 text-neutral-600" />
              <span className="text-sm font-medium text-neutral-700">{room.code}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm text-neutral-600">
                {participants.length} user{participants.length !== 1 ? 's' : ''} online
              </span>
            </div>
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {/* Online Users */}
          <div className="hidden md:flex items-center -space-x-2">
            {participants.slice(0, 3).map((participant) => (
              <div
                key={participant.id}
                className={`w-8 h-8 rounded-full ${getAvatarColor(participant.userId)} flex items-center justify-center text-white text-sm font-medium border-2 border-white`}
              >
                {getInitials(participant.userId)}
              </div>
            ))}
            {participants.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-neutral-400 flex items-center justify-center text-white text-sm font-medium border-2 border-white">
                +{participants.length - 3}
              </div>
            )}
          </div>

          {/* Share Button */}
          <Button
            className="hidden md:flex items-center space-x-2 bg-gradient-brand hover:opacity-90 text-white"
            onClick={onShare}
          >
            <Share className="w-4 h-4" />
            <span>Share</span>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Room Info</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-neutral-600" />
                    <span className="text-sm font-medium">Room: {room.code}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-sm text-neutral-600">
                      {participants.length} user{participants.length !== 1 ? 's' : ''} online
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-neutral-700">Online Users</h4>
                  <div className="space-y-2">
                    {participants.map((participant) => (
                      <div key={participant.id} className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full ${getAvatarColor(participant.userId)} flex items-center justify-center text-white text-xs font-medium`}>
                          {getInitials(participant.userId)}
                        </div>
                        <span className="text-sm">{participant.userId}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-brand hover:opacity-90 text-white"
                  onClick={() => {
                    onShare();
                    setMobileMenuOpen(false);
                  }}
                >
                  <Share className="w-4 h-4" />
                  <span>Share Room</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
