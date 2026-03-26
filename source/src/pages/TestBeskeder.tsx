import { useState } from "react";
import { Search, Send, Smile, Paperclip, Phone, Video, MoreVertical, Check, CheckCheck } from "lucide-react";
import { AMBASSADORS } from "@/data/feedData";
import type { Ambassador } from "@/data/feedData";

interface ChatMessage {
  id: string;
  text: string;
  sender: "me" | "them";
  time: string;
  read?: boolean;
}

const MOCK_CHATS = AMBASSADORS.slice(0, 8).map((amb, i) => ({
  ...amb,
  lastMessage: ["Ses vi til eventet?", "Fedt! Jeg gl\u00e6der mig", "Hej! Skal vi g\u00e5 en tur?", "Tak for sidst!", "Har du set det nye event?", "Super ide!", "Vi ses i morgen", "Sender dig detaljerne"][i],
  time: ["Nu", "2m", "15m", "1t", "3t", "I g\u00e5r", "I g\u00e5r", "Man"][i],
  unread: i < 2,
}));

const MOCK_MESSAGES: ChatMessage[] = [
  { id: "1", text: "Hej! Skal vi m\u00f8des til yoga-eventet i weekenden?", sender: "them", time: "14:30" },
  { id: "2", text: "Ja, det lyder super! Hvor er det henne?", sender: "me", time: "14:32", read: true },
  { id: "3", text: "Det er i F\u00e6lledparken kl. 10. Jeg kan tage yogam\u00e5tter med", sender: "them", time: "14:33" },
  { id: "4", text: "Perfekt! S\u00e5 ses vi der ", sender: "me", time: "14:35", read: true },
  { id: "5", text: "Glæder mig! Husk solcreme \u2600\ufe0f", sender: "them", time: "14:36" },
];

export default function TestBeskeder() {
  const [activeChat, setActiveChat] = useState(0);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const activeUser = MOCK_CHATS[activeChat];

  return (
    <div className="min-h-screen flex">
      {/* Chat list sidebar */}
      <div className="w-80 border-r border-white/8 bg-[#0a0e23]/90 flex flex-col">
        <div className="p-4 border-b border-white/8">
          <h2 className="font-bold text-lg mb-3">Beskeder</h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="search"
              placeholder="S\u00f8g i beskeder..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/8 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/50"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {MOCK_CHATS.map((chat, i) => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(i)}
              className={`w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors ${
                activeChat === i ? "bg-white/8" : ""
              }`}
            >
              <div className="relative">
                <img src={chat.avatar} alt={chat.name} className="w-11 h-11 rounded-full object-cover" />
                {chat.unread && <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#4ECDC4] rounded-full border-2 border-[#0a0e23]" />}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${chat.unread ? "font-semibold" : "font-medium"}`}>{chat.name}</span>
                  <span className={`text-[10px] ${chat.unread ? "text-[#4ECDC4]" : "text-white/30"}`}>{chat.time}</span>
                </div>
                <p className={`text-xs truncate mt-0.5 ${chat.unread ? "text-white/70" : "text-white/40"}`}>{chat.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-[#0a0e23]/50">
        {/* Chat header */}
        <div className="h-16 border-b border-white/8 flex items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <img src={activeUser.avatar} alt={activeUser.name} className="w-9 h-9 rounded-full object-cover" />
            <div>
              <p className="text-sm font-medium">{activeUser.name}</p>
              <p className="text-[11px] text-[#4ECDC4]">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center hover:bg-white/12">
              <Phone size={16} className="text-white/60" />
            </button>
            <button className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center hover:bg-white/12">
              <Video size={16} className="text-white/60" />
            </button>
            <button className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center hover:bg-white/12">
              <MoreVertical size={16} className="text-white/60" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {MOCK_MESSAGES.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[60%] px-4 py-2.5 rounded-2xl ${
                msg.sender === "me"
                  ? "bg-[#4ECDC4]/20 text-white rounded-br-md"
                  : "bg-white/8 text-white/90 rounded-bl-md"
              }`}>
                <p className="text-sm">{msg.text}</p>
                <div className={`flex items-center gap-1 mt-1 ${msg.sender === "me" ? "justify-end" : ""}`}>
                  <span className="text-[10px] text-white/30">{msg.time}</span>
                  {msg.sender === "me" && (
                    msg.read ? <CheckCheck size={12} className="text-[#4ECDC4]" /> : <Check size={12} className="text-white/30" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message input */}
        <div className="p-4 border-t border-white/8">
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center hover:bg-white/12">
              <Paperclip size={16} className="text-white/60" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Skriv en besked..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/50"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2">
                <Smile size={18} className="text-white/30" />
              </button>
            </div>
            <button className="w-9 h-9 rounded-xl bg-[#4ECDC4] flex items-center justify-center hover:bg-[#45b8b0] transition-colors">
              <Send size={16} className="text-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
