import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface EmojiPickerProps {
  onClose: () => void;
  onEmojiSelect: (emoji: string) => void;
}

export default function EmojiPicker({ onClose, onEmojiSelect }: EmojiPickerProps) {
  const [selectedCategory, setSelectedCategory] = useState("Smileys");
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);

  const categories = [
    { name: "Smileys", emojis: ["😀", "😂", "😍", "😊", "😎", "🤔", "😴", "😢", "🥳", "😋", "🤗", "🤓"] },
    { name: "Gestures", emojis: ["👍", "👎", "👌", "✌️", "🤝", "👋", "🙌", "👏", "🤲", "🙏", "✋", "🤚"] },
    { name: "Objects", emojis: ["💡", "🔥", "⭐", "❤️", "💯", "🎉", "🚀", "⚡", "🌟", "✨", "🎯", "🔴"] },
    { name: "Animals", emojis: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🦄", "🐸", "🐢", "🦋"] },
    { name: "Food", emojis: ["🍕", "🍔", "🍟", "🌮", "🍰", "🍪", "☕", "🥤", "🍎", "🍌", "🍓", "🥕"] },
    { name: "Travel", emojis: ["🚗", "✈️", "🚢", "🚲", "🏠", "🏢", "🌍", "🏖️", "🗻", "🎪", "🎭", "🎨"] },
  ];

  const handleEmojiClick = (emoji: string) => {
    // Add to recent emojis
    setRecentEmojis(prev => {
      const newRecent = [emoji, ...prev.filter(e => e !== emoji)].slice(0, 12);
      return newRecent;
    });
    
    onEmojiSelect(emoji);
  };

  const currentCategory = categories.find(cat => cat.name === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <Card className="max-w-lg w-full mx-4 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Add Emoji</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                size="sm"
                className={`text-xs ${
                  selectedCategory === category.name 
                    ? "bg-gradient-brand text-white" 
                    : "hover:bg-neutral-100"
                }`}
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Recent Emojis */}
          {recentEmojis.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-neutral-700">Recent</span>
                <Badge variant="secondary" className="text-xs">
                  {recentEmojis.length}
                </Badge>
              </div>
              <div className="grid grid-cols-8 gap-2">
                {recentEmojis.map((emoji, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="text-xl p-2 emoji-hover"
                    onClick={() => handleEmojiClick(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Category Emojis */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-700">{selectedCategory}</span>
              <Badge variant="outline" className="text-xs">
                {currentCategory?.emojis.length || 0}
              </Badge>
            </div>
            <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto">
              {currentCategory?.emojis.map((emoji, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="text-xl p-2 emoji-hover"
                  onClick={() => handleEmojiClick(emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
