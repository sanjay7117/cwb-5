import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

interface EmojiPickerProps {
  onClose: () => void;
  onEmojiSelect: (emoji: string) => void;
}

export default function EmojiPicker({ onClose, onEmojiSelect }: EmojiPickerProps) {
  const emojis = [
    "😀", "😊", "😍", "🤔", "👍", "👎", "❤️", "🎉",
    "🔥", "💯", "✨", "🚀", "💡", "⭐", "🎯", "🔴",
    "🟡", "🟢", "🔵", "🟣", "🟠", "⚫", "⚪", "🟤",
    "📝", "💼", "🎨", "🖼️", "📊", "📈", "📉", "💰",
    "🏆", "🎖️", "🏅", "🥇", "🥈", "🥉", "🎁", "🎊",
    "🎈", "🎂", "🍰", "🎵", "🎶", "🎤", "🎸", "🎹",
  ];

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <Card className="max-w-sm w-full mx-4 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Add Emoji</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-8 gap-2">
            {emojis.map((emoji, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="text-2xl p-2 hover:bg-neutral-100 transition-colors"
                onClick={() => handleEmojiClick(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
