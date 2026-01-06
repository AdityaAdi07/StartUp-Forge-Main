import { useState } from 'react';
import { User } from '../App';
import { SearchResultsDropdown } from './SearchResultsDropdown';
import { Users, Bell, MessageSquare, X, BrainCircuit, Sparkles, Send, TrendingUp, PieChart, Newspaper, ArrowUpRight, ShieldCheck, Clock, Paperclip, Home } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

type HomePageProps = {
  currentUser: User;
  onNavigate: (page: string) => void;
  onSearch: (query: string) => void;
  onQueryChange?: (query: string) => void;
  ragResults?: {
    founders: string[];
    investors: string[];
  };
  isSearching?: boolean;
};

// --- Real Data from Dataset ---
const TOP_FOUNDERS = [
  {
    name: "Approximate Labs",
    company: "Approximate Labs",
    round: "Series A",
    year: "2022",
    valuation: 100000000,
    umbrella: "TechGig"
  },
  {
    name: "Rohan Sagar",
    company: "Okra",
    round: "Seed",
    year: "2019",
    valuation: 70000000,
    umbrella: "Lybrate Technologies"
  },
  {
    name: "Wang Xing",
    company: "August",
    round: "Series A",
    year: "1998",
    valuation: 50000000,
    umbrella: "Baidupay"
  },
  {
    name: "John Doe",
    company: "Guestlist",
    round: "Series A",
    year: "2022",
    valuation: 15000000,
    umbrella: "Doe Holdings"
  },
  {
    name: "Lemni",
    company: "Lemni",
    round: "Series A",
    year: "2022",
    valuation: 15000000,
    umbrella: "PlayStation, Xbox"
  },
  {
    name: "Zhao Jianyun",
    company: "Ashvattha Therapeutics",
    round: "Series A",
    year: "2022",
    valuation: 12000000,
    umbrella: "Ashvattha Biosciences"
  }
];

export function HomePage({ currentUser, onNavigate, onSearch, onQueryChange, ragResults, isSearching }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleChatSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg, top_k: 5 })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.response || "Sorry, I couldn't understand that." }]);
    } catch (err) {
      console.error("Chat Error:", err);
      setChatMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to AI Assistant." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
      {/* --- Fixed Header --- */}
      <div className="bg-white px-8 py-6 shadow-sm border-b border-slate-100 z-50 flex-shrink-0">
        <div className="flex items-center justify-between gap-6 w-full h-24">

          {/* Profile */}
          <button
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-4 hover:bg-slate-50 p-2 rounded-xl transition-all group flex-shrink-0 min-w-52"
          >
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-14 h-14 rounded-full border-2 border-gray-100 group-hover:border-slate-300 transition-colors object-cover"
              />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-lg font-bold text-gray-900 leading-tight group-hover:text-slate-800">{currentUser.name}</span>
              <span className="text-xs text-gray-500 font-medium">View Profile</span>
            </div>
          </button>

          {/* Search */}
          <div className="flex-1 flex justify-center max-w-3xl px-8 relative">
            <form onSubmit={handleSearchSubmit} className="relative w-full group !z-50">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <div className="bg-slate-800 p-2 rounded-xl">
                  <Sparkles className="h-5 w-5 text-white animate-pulse" />
                </div>
              </div>
              <input
                type="text"
                className="w-full pl-20 pr-20 py-4 bg-slate-900 border border-slate-700 focus:border-slate-500 focus:ring-4 focus:ring-slate-800 rounded-2xl text-base transition-all placeholder-white font-medium outline-none shadow-sm text-white hover:shadow-md hover:border-slate-600 relative z-50"
                placeholder="Ask anything..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (onQueryChange) onQueryChange(e.target.value);
                }}
              />
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none z-50">
                <div className="flex items-center gap-2">
                  <span className="text-gray-300 text-xs">|</span>
                  <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 border border-slate-600 border-b-2 rounded-lg text-[10px] font-bold text-slate-300 tracking-wider">
                    ⌘ K
                  </kbd>
                </div>
              </div>
            </form>

            {/* RAG Search Results Dropdown */}
            {searchQuery.length >= 2 && ragResults && (
              <div className="absolute top-full left-8 right-8 z-[100] shadow-2xl rounded-xl">
                <SearchResultsDropdown
                  results={ragResults}
                  isVisible={true}
                  isLoading={isSearching || false}
                />
              </div>
            )}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-8 flex-shrink-0">

            <ActionItem icon={<Users className="w-7 h-7" />} label="Network" onClick={() => onNavigate('network')} />
            <ActionItem icon={<Bell className="w-7 h-7" />} label="Alerts" badge={true} onClick={() => onNavigate('notifications')} />
            <ActionItem icon={<MessageSquare className="w-7 h-7" />} label="Inbox" onClick={() => onNavigate('messages')} />
            <ActionItem icon={<BrainCircuit className="w-7 h-7" />} label="Deep Analysis" onClick={() => onNavigate('conflict-report')} />
          </div>
        </div>
      </div>

      {/* --- Main Dashboard Content --- */}
      <div className="w-full px-6 pt-6 pb-2 overflow-hidden" style={{ height: 'calc(95vh - 3rem)' }}>
        <div className="flex flex-row w-full h-full gap-6">

          {/* COLUMN 1: RAG Chatbot (Ratio: 22) */}
          <div style={{ flex: 22 }} className="flex flex-col bg-white rounded-2xl shadow-soft border border-slate-300 overflow-hidden flex-shrink-0 min-w-0 h-full">
            <div className="p-4 border-b border-slate-100 bg-white flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-800">
                <Sparkles className="w-4 h-4 fill-slate-800 text-slate-800" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">
                AI Assistant
                <span className="text-[10px] font-medium text-indigo-500 ml-2 bg-indigo-50 px-2 py-0.5 rounded-full">Llama 3.2</span>
              </h3>
            </div>

            <div className="flex-1 bg-gray-50/30 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-4">
              {chatMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-400">
                  <div className="w-16 h-16 bg-white border border-dashed border-slate-200 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                    <Sparkles className="w-8 h-8 text-indigo-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600">AI Assistant Ready</p>
                  <p className="text-xs mt-1 text-slate-400 max-w-[200px]">Ask questions about your portfolio, market trends, or founder details.</p>
                </div>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>

                    {/* Assistant Avatar */}
                    {msg.role === 'assistant' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                      ? 'bg-slate-900 text-white rounded-br-sm'
                      : 'bg-white border border-slate-100 text-slate-700 rounded-bl-sm icon-message'
                      }`}>
                      {msg.role === 'user' ? (
                        msg.content
                      ) : (
                        <ReactMarkdown
                          components={{
                            strong: ({ node, ...props }) => <span className="font-bold text-indigo-700 bg-indigo-50 px-1 rounded" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-1 my-2" {...props} />,
                            li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      )}
                    </div>

                    {/* User Avatar */}
                    {msg.role === 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-white shadow-sm overflow-hidden">
                        <img src={currentUser.avatar} alt="Me" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                ))
              )}

              {/* Loading Indicator */}
              {isChatLoading && (
                <div className="flex items-end gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                    <div className="flex gap-1.5">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-gray-100 bg-white flex-shrink-0">
              <form onSubmit={handleChatSubmit} className="relative flex items-center gap-2">
                <button type="button" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors hidden sm:flex">
                  <Paperclip className="w-5 h-5" />
                </button>
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Ask about your portfolio..."
                    className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all font-normal text-slate-800 placeholder:text-slate-400"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={isChatLoading || !chatInput.trim()}
                    className="absolute right-1.5 top-1.5 p-1.5 bg-slate-900 text-white rounded-full hover:bg-indigo-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center w-8 h-8"
                  >
                    <Send className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* COLUMN 2: Feed (Ratio: 54) */}
          <div style={{ flex: 54 }} className="flex flex-col gap-6 flex-shrink-0 min-w-0 h-full">
            {/* Top: Founders */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-0">
              <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center bg-white flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-700" />
                  <h3 className="text-xl font-black tracking-tight text-slate-800">
                    Top Rising Founders
                  </h3>
                </div>
                <button className="text-[10px] font-semibold text-slate-500 hover:text-slate-800 hover:underline">View All</button>
              </div>
              <div className="p-4 overflow-y-auto flex-1 h-full bg-gray-50/20 grid grid-cols-2 gap-4 content-start">
                {TOP_FOUNDERS.map((founder, i) => (
                  <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 bg-white hover:bg-slate-50 rounded-2xl border border-gray-100 hover:border-slate-200 shadow-sm hover:shadow-soft transition-all cursor-pointer group">
                    {/* Avatar & Basic Info */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <img src={`https://i.pravatar.cc/150?u=${i + 50}`} className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-gray-900 text-base truncate pr-2">{founder.name}</h4>
                          <span className="shrink-0 text-[10px] font-bold text-white bg-green-500 px-2 py-0.5 rounded-full shadow-sm">
                            ${(founder.valuation / 1000000).toFixed(0)}M
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-teal-700">{founder.company}</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-md">
                            <TrendingUp className="w-3 h-3 text-gray-400" />
                            {founder.round} • {founder.year}
                          </span>
                          {founder.umbrella && (
                            <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-md truncate max-w-[150px]">
                              <ShieldCheck className="w-3 h-3 text-gray-400" />
                              {founder.umbrella}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom: News */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-0">
              <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-slate-700" />
                  <h3 className="font-bold text-slate-900 text-lg">Market Intelligence</h3>
                </div>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-50 text-[10px] font-bold text-teal-600 animate-pulse border border-teal-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                  LIVE
                </span>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
                <div className="flex flex-wrap -m-1.5">
                  {[
                    {
                      source: "TechCrunch",
                      title: "Meta acquires AI agent platform Manus for $2B",
                      time: "2h ago",
                      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=200&h=200",
                      link: "#"
                    },
                    {
                      source: "VentureBeat",
                      title: "Liquid AI receives $250M Series A valuation boost",
                      time: "4h ago",
                      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=200&h=200",
                      link: "#"
                    },
                    {
                      source: "The Verge",
                      title: "Global AI startup funding hits record $150B",
                      time: "8h ago",
                      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=200&h=200",
                      link: "#"
                    },
                    {
                      source: "Reuters",
                      title: "Nvidia hits $4T market cap amid chip demand",
                      time: "10h ago",
                      image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=200&h=200",
                      link: "#"
                    },
                    {
                      source: "Sifted",
                      title: "Mistral releases new large open model 'Large 2'",
                      time: "11h ago",
                      image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=200&h=200",
                      link: "#"
                    },
                    {
                      source: "Wired",
                      title: "Humane's AI Pin: The full hardware review",
                      time: "12h ago",
                      image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=200&h=200",
                      link: "#"
                    },
                    {
                      source: "The Information",
                      title: "Perplexity to raise new round at $3B valuation",
                      time: "14h ago",
                      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=200&h=200",
                      link: "#"
                    },
                    {
                      source: "Forbes",
                      title: "Stability AI CEO steps down amid restructuring",
                      time: "1d ago",
                      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=200&h=200",
                      link: "#"
                    },
                    {
                      source: "Bloomberg",
                      title: "Apple said to integrating Gemini into iPhone 16",
                      time: "1d ago",
                      image: "https://images.unsplash.com/photo-1592609931095-54a2168ae893?auto=format&fit=crop&q=80&w=200&h=200",
                      link: "#"
                    }
                  ].map((news, i) => (
                    <div key={i} className="w-1/3 p-1.5">
                      <a href={news.link} className="group flex flex-row gap-3 bg-white hover:bg-slate-50 border border-gray-200 hover:border-slate-200 rounded-xl overflow-hidden transition-all hover:shadow-md cursor-pointer h-20">
                        <div className="w-16 h-full relative overflow-hidden flex-shrink-0">
                          <img
                            src={news.image}
                            alt="News thumbnail"
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex flex-col justify-between p-2.5 flex-1 min-w-0">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide leading-none">{news.source}</span>
                            <h4 className="text-[11px] font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-slate-800 transition-colors">
                              {news.title}
                            </h4>
                          </div>
                          <div className="flex items-center gap-1 text-[9px] text-gray-400 font-medium">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{news.time}</span>
                          </div>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 3: Stats (Ratio: 20) */}
          <div style={{ flex: 20 }} className="flex flex-col gap-6 flex-shrink-0 min-w-0 h-full">
            {/* Conflict (Flex 3 -> ~30%) to fit inputs */}
            <div style={{ flex: 3.5 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex-shrink-0 flex flex-col min-h-0">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <h3 className="font-bold text-gray-800 text-base">Conflict of Interest</h3>
              </div>

              <div className="flex flex-col gap-3 flex-1 justify-center pt-2">
                <input
                  type="text"
                  placeholder="Company Name"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-slate-400 outline-none transition-all placeholder:text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Domain (e.g. tech.com)"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-slate-400 outline-none transition-all placeholder:text-gray-400"
                />
                <button className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold py-3 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
                  Check Conflict <ShieldCheck className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Find Investors (Flex 3.5 -> ~35%) */}
            <div style={{ flex: 3.5 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col min-h-0 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-slate-200 transition-colors"></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-slate-800" />
                  <h3 className="font-bold text-gray-900 text-lg">Find Investors Like Me</h3>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center text-center">
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                    Match with the perfect investors for your startup's stage and industry.
                  </p>

                  <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group-hover:scale-[1.02]">
                    Find Investors <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Invested Companies (Flex 3.5 -> ~35%) */}
            <div style={{ flex: 3.5 }} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex flex-col min-h-0">
              <div className="flex items-center gap-2 mb-3">
                <PieChart className="w-4 h-4 text-slate-800" />
                <h3 className="font-bold text-gray-800 text-base">My Invested Company Stats</h3>
              </div>

              <div className="flex flex-col h-full justify-center gap-4 px-1">
                {/* Row 1 */}
                <div className="flex items-center justify-between">
                  {[
                    { name: "Nebula AI", img: 88 }, { name: "Zephyr", img: 52 },
                    { name: "Flux Sys", img: 33 }, { name: "Apex Bio", img: 11 }
                  ].map((company, i) => (
                    <div key={i} className="relative group">
                      <img src={`https://i.pravatar.cc/150?u=${company.img}`} title={company.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm hover:scale-110 hover:border-slate-300 transition-all cursor-pointer" />
                    </div>
                  ))}
                </div>
                {/* Row 2 */}
                <div className="flex items-center justify-between">
                  {[
                    { name: "Vortex", img: 95 }, { name: "Horizon", img: 61 },
                    { name: "Pulse", img: 72 }, { name: "Echo Lab", img: 48 }
                  ].map((company, i) => (
                    <div key={i} className="relative group">
                      <img src={`https://i.pravatar.cc/150?u=${company.img}`} title={company.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm hover:scale-110 hover:border-slate-300 transition-all cursor-pointer" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- Profile Modal --- */}
      {showProfileModal && (
        <ProfileModal
          currentUser={currentUser}
          onClose={() => setShowProfileModal(false)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

// Sub-components
function ActionItem({ icon, label, onClick, badge }: { icon: React.ReactNode, label: string, onClick: () => void, badge?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center text-slate-600 hover:text-white hover:bg-slate-900 p-2 rounded-xl transition-all group min-w-20 relative"
    >
      <div className="relative mb-0.5 transform group-hover:scale-105 transition-transform duration-200">
        {icon}
        {badge && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
      </div>
      <span className="text-xs font-medium tracking-wide group-hover:text-white">{label}</span>
    </button>
  );
}

function ProfileModal({ currentUser, onClose, onNavigate }: { currentUser: User, onClose: () => void, onNavigate: (p: string) => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative">
        <button onClick={onClose} className="absolute top-3 right-3 p-2 bg-black/10 hover:bg-black/20 text-white rounded-full transition-colors z-10 backdrop-blur-md">
          <X className="w-4 h-4" />
        </button>
        <div className="h-28 bg-gradient-to-r from-gray-800 to-gray-900"></div>
        <div className="px-6 pb-6 -mt-12 text-center">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-24 h-24 rounded-full border-4 border-white shadow-md mx-auto object-cover bg-white" />
          <h2 className="mt-3 text-xl font-bold text-gray-900">{currentUser.name}</h2>
          <p className="text-sm text-gray-500 mb-4">{currentUser.headline}</p>
          <button onClick={() => { onClose(); onNavigate('profile'); }} className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold transition-all shadow-lg">
            View Full Profile
          </button>
        </div>
      </div>
    </div>
  );
}
