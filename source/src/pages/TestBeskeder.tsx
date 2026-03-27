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
  lastMessage: [
    "Ses vi til eventet?",
    "Fedt! Jeg glæder mig",
    "Hej! Skal vi gå en tur?",
    "Tak for sidst!",
    "Har du set det nye event?",
    "Super ide!",
    "Vi ses i morgen",
    "Sender dig detaljerne"
  ][i],
  time: ["Nu", "2m", "15m", "1t", "3t", "I går", "I går", "Man"][i],
  unread: i < 2,
}));

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    text: "Hej! Skal vi mødes til yoga-eventet i weekenden?",
    sender: "them",
    time: "14:30"
  },
  {
    id: "2",
    text: "Ja, det lyder super! Hvor er det henne?",
    sender: "me",
    time: "14:32",
    read: true
  },
  {
    id: "3",
    text: "Det er i Fælledparken kl. 10. Jeg kan tage yogamåtter med",
    sender: "them",
    time: "14:33"
  },
  {
    id: "4",
    text: "Perfekt! Så ses vi der ",
    sender: "me",
    time: "14:35",
    read: true
  },
  {
    id: "5",
    text: "Glæder mig! Husk solcreme ☀️",
    sender: "them",
    time: "14:36"
  },
];

export default function TestBeskeder() {
  const [activeChat, setActiveChat] = useState(0);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const activeUser = MOCK_CHATS[activeChat];

  return (
    <div className="min-h-screen flex bg-[#0a0e23] text-white font-sans">
      {/* Chat list sidebar */}
      <div className="w-80 border-r border-white/10 flex flex-col bg-[#0a0e23]/95 backdrop-blur-sm">
        <div className="p-4 border-b border-white/10">
          <h2 className="font-bold text-lg mb-3">Beskeder</h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="search"
              placeholder="Søg i beskeder..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {MOCK_CHATS.map((chat, i) => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(i)}
              className={`w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors border-l-2 ${
                activeChat === i ? "bg-white/10 border-[#4ECDC4]" : "border-transparent"
              }`}
            >
              <div className="relative flex-shrink-0">
                <img src={chat.image} alt={chat.name} className="w-11 h-11 rounded-full object-cover grayscale-[20%]" />
                {chat.unread && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#4ECDC4] rounded-full border-2 border-[#0a0e23] flex items-center justify-center text-[8px] text-white">1</span>
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex justify-between items-baseline gap-2 mb-0.5">
                  <h3 className="font-semibold text-sm truncate">{chat.name}</h3>
                  <span className="text-[10px] text-white/40 flex-shrink-0">{chat.time}</span>
                </div>
                <p className={`text-xs truncate ${chat.unread ? "text-white/90 font-medium" : "text-white/50"}`}>
                  {chat.lastMessage}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-[#0a0e23]/40">
        {/* Chat header */}
        <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0a0e23]/80">
          <div className="flex items-center gap-3">
            <img src={activeUser.image} alt={activeUser.name} className="w-10 h-10 rounded-full object-cover shadow-lg" />
            <div>
              <h3 className="font-semibold text-sm leading-tight">{activeUser.name}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 bg-[#4ECDC4] rounded-full animate-pulse" />
                <span className="text-[10px] text-white/50">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/5 rounded-lg text-white/60 transition-colors"><Phone size={18} /></button>
            <button className="p-2 hover:bg-white/5 rounded-lg text-white/60 transition-colors"><Video size={18} /></button>
            <button className="p-2 hover:bg-white/5 rounded-lg text-white/60 transition-colors"><MoreVertical size={18} /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          <div className="flex justify-center my-6">
            <span className="text-[10px] uppercase tracking-wider text-white/30 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">I dag</span>
          </div>

          {MOCK_MESSAGES.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] group relative ${msg.sender === "me" ? "items-end" : "items-start"}`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === "me"
                    ? "bg-[#4ECDC4] text-[#0a0e23] rounded-tr-none shadow-[0_4px_12px_rgba(78,205,196,0.2)]"
                    : "bg-[#161b33] text-white/90 rounded-tl-none border border-white/5"
                }`}>
                  {msg.text}
                </div>
                <div className={`flex items-center gap-1.5 mt-1 px-1 ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
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
        <div className="p-4 border-t border-white/10 bg-[#0a0e23]/60 backdrop-blur-md">
          <div className="max-w-4xl mx-auto flex items-center gap-2">
            <button className="p-2.5 hover:bg-white/5 rounded-xl text-white/40 transition-colors"><Smile size={20} /></button>
            <button className="p-2.5 hover:bg-white/5 rounded-xl text-white/40 transition-colors"><Paperclip size={20} /></button>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Skriv en besked..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/50"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#4ECDC4] hover:bg-[#4ECDC4]/10 rounded-lg transition-colors">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <style>{\`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      \`}</style>
    </div>
  );
}
