import { useState, useEffect } from "react";
import { Search, Send, Smile, Paperclip, Phone, Video, MoreVertical, Check, CheckCheck, Newspaper, ExternalLink } from "lucide-react";
import { AMBASSADORS } from "@/data/feedData";
import type { Ambassador } from "@/data/feedData";
import { fetchNews, formatNewsTime, type NewsItem } from "@/lib/newsEngine";

interface ChatMessage {
  id: string;
  text: string;
  sender: "me" | "them";
  time: string;
  read?: boolean;
}

const MOCK_CHATS = AMBASSADORS.slice(0, 8).map((amb, i) => ({
  ...amb,
  lastMessage: ["Ses vi til eventet?", "Fedt! Jeg glæder mig", "Hej! Skal vi gå en tur?", "Tak for sidst!", "Har du set det nye event?", "Super ide!", "Vi ses i morgen", "Sender dig detaljerne"][i],
  time: ["Nu", "2m", "15m", "1t", "3t", "I går", "I går", "Man"][i],
  unread: i < 2,
}));

const MOCK_MESSAGES: ChatMessage[] = [
  { id: "1", text: "Hej! Skal vi mødes til yoga-eventet i weekenden?", sender: "them", time: "14:30" },
  { id: "2", text: "Ja, det lyder super! Hvor er det henne?", sender: "me", time: "14:32", read: true },
  { id: "3", text: "Det er i Fælledparken kl. 10. Jeg kan tage yogamåtter med", sender: "them", time: "14:33" },
  { id: "4", text: "Perfekt! Så ses vi der ", sender: "me", time: "14:35", read: true },
  { id: "5", text: "Glæder mig! Husk solcreme ☀️", sender: "them", time: "14:36" },
];

export default function TestBeskeder() {
  const [activeChat, setActiveChat] = useState(0);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const activeUser = MOCK_CHATS[activeChat];

  useEffect(() => {
    fetchNews()
      .then(items => { setAllNews(items); setNewsLoading(false); })
      .catch(() => setNewsLoading(false));
  }, []);

  return (
    <div className="flex h-full bg-[#0a0f1a] text-white overflow-hidden">
      {/* Chat list */}
      <div className="w-72 border-r border-white/10 flex flex-col flex-shrink-0">
        <div className="px-6 pt-8 pb-4 border-b border-white/10">
          <h1 className="text-xl font-bold mb-4">Beskeder</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
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
              className={`w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors ${
                activeChat === i ? "bg-white/5" : ""
              }`}
            >
              <div className="relative flex-shrink-0">
                <img src={chat.avatar} alt={chat.name} className="w-11 h-11 rounded-xl object-cover" />
                {chat.unread && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#4ECDC4] border-2 border-[#0a0f1a] rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`font-bold text-sm truncate ${chat.unread ? "text-white" : "text-white/70"}`}>{chat.name}</span>
                  <span className="text-[10px] text-white/30 ml-2">{chat.time}</span>
                </div>
                <p className={`text-xs truncate ${chat.unread ? "text-white/60" : "text-white/35"}`}>{chat.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="h-16 border-b border-white/10 px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <img src={activeUser.avatar} alt={activeUser.name} className="w-9 h-9 rounded-xl object-cover" />
            <div>
              <h3 className="font-bold text-sm leading-none mb-1">{activeUser.name}</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-[#4ECDC4] rounded-full" />
                <span className="text-[10px] text-white/40">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 text-white/30 hover:text-white hover:bg-white/5 rounded-lg transition-all"><Phone size={16} /></button>
            <button className="p-2 text-white/30 hover:text-white hover:bg-white/5 rounded-lg transition-all"><Video size={16} /></button>
            <button className="p-2 text-white/30 hover:text-white hover:bg-white/5 rounded-lg transition-all"><MoreVertical size={16} /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {MOCK_MESSAGES.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.sender === "me" ? "bg-[#4ECDC4] text-[#0a0f1a]" : "bg-white/8 text-white/90"
              }`}>
                <p className="mb-1">{msg.text}</p>
                <div className={`flex items-center justify-end gap-1 text-[9px] ${
                  msg.sender === "me" ? "text-[#0a0f1a]/50" : "text-white/30"
                }`}>
                  {msg.time}
                  {msg.sender === "me" && (msg.read ? <CheckCheck size={10} /> : <Check size={10} />)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message input */}
        <div className="p-4 border-t border-white/10 flex-shrink-0">
          <div className="bg-white/5 border border-white/10 rounded-2xl px-3 py-2 flex items-center gap-2">
            <button className="p-1.5 text-white/30 hover:text-[#4ECDC4] transition-colors"><Paperclip size={16} /></button>
            <input
              type="text"
              placeholder="Skriv en besked..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-transparent border-none focus:outline-none text-sm text-white/90 placeholder:text-white/30"
            />
            <button className="p-1.5 text-white/30 hover:text-[#4ECDC4] transition-colors"><Smile size={16} /></button>
            <button className="p-2 bg-[#4ECDC4] text-[#0a0f1a] rounded-xl hover:bg-[#3dbdb5] transition-all"><Send size={16} /></button>
          </div>
        </div>
      </div>

      {/* Right Column - News Sidebar */}
      <div className="w-80 px-6 py-8 space-y-6 overflow-y-auto hidden xl:flex flex-col custom-scrollbar border-l border-white/10">
        {/* Seneste Nyt */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Newspaper size={16} className="text-[#4ECDC4]" />
              <h3 className="text-sm font-bold">Seneste Nyt</h3>
            </div>
            <span className="text-[9px] font-bold text-[#4ECDC4] bg-[#4ECDC4]/10 px-2 py-0.5 rounded-full">LIVE</span>
          </div>
          {newsLoading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-3 bg-white/10 rounded mb-1.5 w-full" />
                  <div className="h-2 bg-white/5 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : allNews.length > 0 ? (
            <div className="space-y-3">
              {allNews.slice(0, 6).map(news => (
                <a
                  key={news.link}
                  href={news.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex gap-3 hover:bg-white/5 rounded-xl p-1.5 -mx-1.5 transition-all"
                >
                  {news.image && (
                    <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={news.image} alt="" className="w-full h-full object-cover opacity-80" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white/80 group-hover:text-[#4ECDC4] transition-colors line-clamp-2 mb-1">{news.title}</p>
                    <div className="flex items-center gap-1 text-[9px] text-white/30">
                      <span>{news.sourceEmoji} {news.source}</span>
                      <span>•</span>
                      <span>{formatNewsTime(news.pubDate)}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-xs text-white/30 text-center py-4">Ingen nyheder tilgængelige</p>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}
