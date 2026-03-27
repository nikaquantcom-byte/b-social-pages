import { Newspaper, ChevronRight } from "lucide-react";

const MOCK_NEWS = [
  {
    id: 1,
    title: "Nye MTB ruter i Silkeborg",
    category: "MTB",
    time: "2 timer siden",
    image: "https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=150&h=100&fit=crop"
  },
  {
    id: 2,
    title: "Yoga i det fri: Sommersæson",
    category: "Fitness",
    time: "5 timer siden",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=150&h=100&fit=crop"
  },
  {
    id: 3,
    title: "Fællesløb i Aalborg",
    category: "Løb",
    time: "1 dag siden",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=150&h=100&fit=crop"
  }
];

export default function NewsSidebar() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-600">
          <Newspaper className="w-5 h-5" />
          <h2 className="font-bold text-gray-900">Seneste Nyt</h2>
        </div>
        <button className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-0.5 transition-colors">
          Se alle <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
        {MOCK_NEWS.map((item) => (
          <button 
            key={item.id} 
            className="group w-full text-left flex gap-3 items-start hover:bg-gray-50 p-2 rounded-xl transition-all duration-200"
          >
            <div className="relative flex-shrink-0">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-16 h-16 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform duration-300" 
              />
              <span className="absolute top-1 left-1 bg-white/90 backdrop-blur-sm text-[8px] font-bold px-1.5 py-0.5 rounded text-blue-600 uppercase tracking-wider border border-blue-100">
                {item.category}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-bold text-gray-900 leading-tight mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-[10px] text-gray-400 font-medium">{item.time}</p>
            </div>
          </button>
        ))}

        {/* Pro/Sponsored Slot */}
        <div className="mt-2 p-3 bg-blue-50 rounded-xl border border-blue-100 relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Annonce</span>
            <h4 className="text-xs font-bold text-gray-900 mt-1 mb-2">Opgrader til Pro</h4>
            <button className="w-full bg-blue-600 text-white text-[10px] font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              Læs mere her
            </button>
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100/50 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-500" />
        </div>
      </div>

      <style>{\`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
      \`}</style>
    </div>
  );
}
