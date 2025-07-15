import { Users, Save, Wifi, Clock, WifiOff, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StatusBarProps {
  isConnected: boolean;
  participantCount: number;
  lastSaved: Date;
}

export default function StatusBar({ isConnected, participantCount, lastSaved }: StatusBarProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTimeSinceLastSaved = () => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    } else {
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 bg-white rounded-full shadow-lg border border-neutral-200 px-4 py-2 hover:shadow-xl transition-shadow">
      <div className="flex items-center space-x-3">
        {/* Connection Status */}
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <>
              <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
              <Wifi className="w-4 h-4 text-success" />
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                Connected
              </Badge>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <WifiOff className="w-4 h-4 text-red-500" />
              <Badge variant="destructive" className="text-xs">
                Disconnected
              </Badge>
            </>
          )}
        </div>
        
        <div className="w-px h-4 bg-neutral-300"></div>
        
        {/* Participant Count */}
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-neutral-600" />
          <Badge variant="outline" className="text-xs">
            {participantCount} {participantCount === 1 ? 'user' : 'users'}
          </Badge>
        </div>
        
        <div className="w-px h-4 bg-neutral-300"></div>
        
        {/* Auto-save Status */}
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-success" />
          <span className="text-xs text-neutral-600">
            Saved {getTimeSinceLastSaved()}
          </span>
        </div>
        
        <div className="w-px h-4 bg-neutral-300"></div>
        
        {/* Time */}
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-neutral-600" />
          <span className="text-xs text-neutral-600 font-mono">
            {formatTime(new Date())}
          </span>
        </div>
      </div>
    </div>
  );
}
