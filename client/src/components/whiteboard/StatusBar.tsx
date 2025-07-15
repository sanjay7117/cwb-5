import { Users, Save, Wifi } from "lucide-react";

interface StatusBarProps {
  isConnected: boolean;
  participantCount: number;
  lastSaved: Date;
}

export default function StatusBar({ isConnected, participantCount, lastSaved }: StatusBarProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 bg-white rounded-full shadow-lg border border-neutral-200 px-4 py-2">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-sm text-neutral-600">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        
        <div className="w-px h-4 bg-neutral-300"></div>
        
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-neutral-600" />
          <span className="text-sm text-neutral-600">
            {participantCount} online
          </span>
        </div>
        
        <div className="w-px h-4 bg-neutral-300"></div>
        
        <div className="flex items-center space-x-2">
          <Save className="w-4 h-4 text-neutral-600" />
          <span className="text-sm text-neutral-600">
            Auto-saved {formatTime(lastSaved)}
          </span>
        </div>
      </div>
    </div>
  );
}
