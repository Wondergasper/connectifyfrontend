import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Send, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Messages = () => {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState("");

  const chats = [
    {
      id: 1,
      name: "Chioma Nwosu",
      service: "House Cleaning",
      lastMessage: "I'll be there at 10 AM tomorrow",
      time: "2h ago",
      unread: 2,
    },
    {
      id: 2,
      name: "Emeka Okafor",
      service: "Plumbing",
      lastMessage: "Thanks for choosing my service!",
      time: "5h ago",
      unread: 0,
    },
    {
      id: 3,
      name: "Fatima Hassan",
      service: "Tutoring",
      lastMessage: "What time works best for you?",
      time: "1d ago",
      unread: 1,
    },
  ];

  const messages = selectedChat
    ? [
        { id: 1, text: "Hi! I'm interested in your cleaning service", sent: true, time: "10:30 AM" },
        { id: 2, text: "Hello! I'd be happy to help. What area do you need cleaned?", sent: false, time: "10:32 AM" },
        { id: 3, text: "My 3-bedroom apartment in Lekki", sent: true, time: "10:35 AM" },
        { id: 4, text: "Perfect! I can do that tomorrow at 10 AM. Would that work?", sent: false, time: "10:36 AM" },
        { id: 5, text: "Yes, that works for me!", sent: true, time: "10:38 AM" },
        { id: 6, text: "I'll be there at 10 AM tomorrow", sent: false, time: "10:40 AM" },
      ]
    : [];

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-md border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => {
                if (selectedChat) {
                  setSelectedChat(null);
                } else {
                  navigate(-1);
                }
              }}
              className="p-2 hover:bg-muted rounded-xl transition-smooth"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-xl font-bold text-foreground">
              {selectedChat ? chats.find((c) => c.id === selectedChat)?.name : "Messages"}
            </h1>
          </div>

          {!selectedChat && (
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                className="h-12 pl-12 pr-4 bg-muted/30 border-0"
              />
            </div>
          )}
        </div>
      </div>

      {/* Chat List or Conversation */}
      <div className="flex-1 overflow-y-auto">
        {!selectedChat ? (
          // Chat List
          <div className="px-6 pt-4 space-y-2">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className="w-full p-4 rounded-2xl bg-card border border-border hover:border-primary transition-smooth text-left shadow-soft hover:shadow-medium"
              >
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-soft">
                    <User className="w-7 h-7 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h3 className="font-semibold text-foreground">{chat.name}</h3>
                        <p className="text-xs text-muted-foreground">{chat.service}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{chat.time}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                      {chat.unread > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-accent text-white text-xs font-medium">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          // Conversation View
          <div className="px-6 py-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sent ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[75%] ${message.sent ? "order-2" : "order-1"}`}>
                  <div
                    className={`p-4 rounded-2xl ${
                      message.sent
                        ? "bg-accent text-white rounded-br-sm"
                        : "bg-card border border-border rounded-bl-sm"
                    }`}
                  >
                    <p className={`text-sm ${message.sent ? "text-white" : "text-foreground"}`}>
                      {message.text}
                    </p>
                  </div>
                  <span
                    className={`text-xs text-muted-foreground mt-1 block ${
                      message.sent ? "text-right" : "text-left"
                    }`}
                  >
                    {message.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Input (only in conversation view) */}
      {selectedChat && (
        <div className="p-6 bg-background/80 backdrop-blur-md border-t border-border">
          <div className="flex gap-3">
            <Input
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="h-12 bg-muted/30 border-0"
            />
            <Button className="h-12 w-12 p-0 bg-accent hover:bg-accent/90">
              <Send className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
