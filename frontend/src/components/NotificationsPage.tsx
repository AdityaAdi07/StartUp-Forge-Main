import { useState, useEffect } from 'react';
import {
  ThumbsUp,
  MessageCircle,
  UserPlus,
  Briefcase,
  TrendingUp,
  Sparkles,
  Users,
  Bell,
  MessageSquare,
  BrainCircuit,
  PieChart,
  Building2,
  DollarSign,
  Home,
  Clock,
  History,
  Check,
  X
} from 'lucide-react';

type NotificationsPageProps = {
  currentUser: any;
  onViewJob: (jobId: string) => void;
  onNavigateToChat: (userId: string) => void;
  onNavigate: (page: string) => void;
  onSearch: (query: string) => void;
};

// --- Sub-components for Header (Copied for consistency as per user request) ---
const ActionItem = ({ icon, label, badge = false, onClick }: { icon: any, label: string, badge?: boolean, onClick: () => void }) => (
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

export function NotificationsPage({ currentUser, onViewJob, onNavigateToChat, onNavigate, onSearch }: NotificationsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<any[]>([
    {
      id: '1',
      type: 'like',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      message: 'Michael Chen and 12 others liked your post',
      timestamp: '2h ago',
      unread: true
    },
    {
      id: '2',
      type: 'comment',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      message: 'Emily Rodriguez commented on your post',
      timestamp: '5h ago',
      unread: true
    },
    {
      id: '3',
      type: 'connection',
      avatar: 'https://randomuser.me/api/portraits/men/86.jpg',
      message: 'David Park accepted your connection request',
      timestamp: '1d ago',
      unread: false
    },
    {
      id: '4',
      type: 'job',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      message: 'New job opening: Senior Product Designer at Tech Corp',
      timestamp: '2d ago',
      unread: false,
      isJob: true
    },
    {
      id: '5',
      type: 'job',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      message: 'You might be interested: UX Designer at StartupXYZ',
      timestamp: '3d ago',
      unread: false,
      isJob: true
    }
  ]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!currentUser?.id) return;
        const res = await fetch('/connections/notifications', {
          headers: { 'x-user-id': currentUser.id }
        });
        const data = await res.json();

        const realNotifs = data.map((n: any) => ({
          id: `conn-${n.id}`,
          type: 'connection',
          avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
          message: `User ${n.receiver_id} accepted your connection request`,
          timestamp: new Date(n.responded_at).toLocaleDateString(),
          unread: true,
          metadata: { userId: String(n.receiver_id) }
        }));

        setNotifications(prev => [...realNotifs, ...prev]);

      } catch (e) { console.error(e); }
    };
    fetchNotifications();
  }, [currentUser]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <ThumbsUp className="w-5 h-5 text-blue-600" />;
      case 'comment': return <MessageCircle className="w-5 h-5 text-green-600" />;
      case 'connection': return <UserPlus className="w-5 h-5 text-purple-600" />;
      case 'job': return <Briefcase className="w-5 h-5 text-orange-600" />;
      default: return <TrendingUp className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
      {/* --- Fixed Header (Copied from HomePage) --- */}
      <div className="bg-white px-8 py-6 shadow-sm border-b border-slate-100 z-50 flex-shrink-0">
        <div className="flex items-center justify-between gap-6 w-full h-24">

          {/* Profile */}
          <button
            onClick={() => onNavigate('profile')}
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
          <div className="flex-1 flex justify-center max-w-3xl px-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <div className="bg-slate-800 p-2 rounded-xl">
                  <Sparkles className="h-5 w-5 text-white animate-pulse" />
                </div>
              </div>
              <input
                type="text"
                className="w-full pl-20 pr-20 py-4 bg-slate-900 border border-slate-700 focus:border-slate-500 focus:ring-4 focus:ring-slate-800 rounded-2xl text-base transition-all placeholder-white font-medium outline-none shadow-sm text-white hover:shadow-md hover:border-slate-600"
                placeholder="Ask anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="text-gray-300 text-xs">|</span>
                  <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 border border-slate-600 border-b-2 rounded-lg text-[10px] font-bold text-slate-300 tracking-wider">
                    ⌘ K
                  </kbd>
                </div>
              </div>
            </form>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-8 flex-shrink-0">
            <ActionItem icon={<Home className="w-7 h-7" />} label="Home" onClick={() => onNavigate('home')} />
            <ActionItem icon={<Users className="w-7 h-7" />} label="Network" onClick={() => onNavigate('network')} />
            <ActionItem icon={<Bell className="w-7 h-7" />} label="Alerts" badge={false} onClick={() => onNavigate('notifications')} />
            <ActionItem icon={<MessageSquare className="w-7 h-7" />} label="Inbox" onClick={() => onNavigate('messages')} />
            <ActionItem icon={<BrainCircuit className="w-7 h-7" />} label="Deep Analysis" onClick={() => onNavigate('conflict-report')} />
          </div>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="flex-1 overflow-auto bg-slate-50/50">
        <div className="max-w-[1600px] mx-auto p-4 flex flex-row gap-4 h-full">

          {/* LEFT: Main Notification Details (notifications list) */}
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 flex flex-col min-h-[500px] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-white sticky top-0 z-10 border-t-4 border-t-indigo-500">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-800 tracking-tight">Activity Feed</h2>
                  <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-xs font-bold border border-indigo-100">{notifications.filter(n => n.unread).length} New</span>
                </div>
                <button className="text-[11px] font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-wider transition-colors">Mark all read</button>
              </div>

              <div className="space-y-0.5 flex-1 overflow-y-auto custom-scrollbar p-2 bg-slate-50/30">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    onClick={() => {
                      if (notification.type === 'connection' && notification.metadata?.userId) {
                        onNavigateToChat(notification.metadata.userId);
                      } else if (notification.isJob) {
                        onViewJob(notification.id);
                      }
                    }}
                    className={`group relative p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-4 duration-200 hover:shadow-sm ${notification.unread
                      ? 'bg-white border-l-4 border-l-indigo-500 border-y border-r border-slate-100 shadow-sm'
                      : 'bg-transparent border border-transparent hover:bg-white hover:border-slate-100'
                      }`}
                  >
                    <div className="relative flex-shrink-0 mt-0.5">
                      <img
                        src={notification.avatar}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow border border-slate-100 scale-90">
                        {getIcon(notification.type)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${notification.unread ? 'font-semibold text-slate-800' : 'font-medium text-slate-600'}`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <p className="text-slate-400 text-[11px] font-medium">{notification.timestamp}</p>
                      </div>
                    </div>

                    {notification.unread && (
                      <div className="flex-shrink-0 self-center">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-sm ring-2 ring-indigo-100"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* --- New Sections: Connection Pending & Recently Viewed --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              {/* Connection Pending */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4 flex flex-col gap-3 relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
                <div className="flex items-center gap-2 relative z-10 border-b border-slate-50 pb-2">
                  <UserPlus className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Connections Pending</h3>
                </div>
                <div className="space-y-3 relative z-10">
                  {[1, 2].map(i => (
                    <div key={i} className="flex items-center justify-between gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                      <div className="flex items-center gap-2">
                        <img src={`https://randomuser.me/api/portraits/men/${i + 20}.jpg`} className="w-8 h-8 rounded-full border border-slate-200" />
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-800 text-xs truncate">James Carter</h4>
                          <p className="text-[10px] text-slate-500 truncate">Founder @ SaaSFly</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-100"><Check className="w-3 h-3" /></button>
                        <button className="p-1.5 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-100 transition-colors border border-slate-100"><X className="w-3 h-3" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recently Viewed */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4 flex flex-col gap-3 relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50/50 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
                <div className="flex items-center gap-2 relative z-10 border-b border-slate-50 pb-2">
                  <History className="w-4 h-4 text-purple-600" />
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Recently Viewed</h3>
                </div>
                <div className="flex gap-3 relative z-10 overflow-x-auto pb-1 no-scrollbar pt-1">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex flex-col items-center gap-1.5 min-w-[60px] cursor-pointer group/item">
                      <img src={`https://randomuser.me/api/portraits/women/${i + 30}.jpg`} className="w-10 h-10 rounded-full border border-slate-200 group-hover/item:border-purple-300 group-hover/item:ring-2 group-hover/item:ring-purple-50 transition-all" />
                      <span className="text-[10px] font-medium text-slate-600 truncate w-full text-center group-hover/item:text-purple-600">Sarah M.</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT: Sidebar Widgets */}
          <div className="w-80 flex-shrink-0 flex flex-col gap-4 min-w-0">

            {/* Widget 1: Investment Only Updates */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4 flex flex-col gap-3 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/50 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
              <div className="flex items-center gap-2 relative z-10 border-b border-slate-50 pb-2">
                <PieChart className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Investment Updates</h3>
              </div>
              <div className="space-y-2 relative z-10">
                <div className="p-3 bg-emerald-50/30 rounded-xl border border-emerald-100/50 flex justify-between items-center">
                  <span className="font-bold text-slate-700 text-xs">Portfolio Growth</span>
                  <div className="text-right">
                    <p className="text-emerald-600 font-extrabold text-lg leading-none">+12.4%</p>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-100 hover:border-indigo-100 transition-colors cursor-pointer flex justify-between items-center shadow-sm">
                  <span className="font-bold text-slate-700 text-xs">New Matches</span>
                  <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">3 Found</span>
                </div>
              </div>
            </div>

            {/* Widget 2: Founder Company Updates */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4 flex flex-col gap-3 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 left-0 w-20 h-20 bg-blue-50 rounded-full blur-2xl -ml-8 -mt-8 pointer-events-none opacity-50"></div>
              <div className="flex items-center gap-2 relative z-10 border-b border-slate-50 pb-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Company Updates</h3>
              </div>
              <div className="space-y-2 relative z-10">
                {[1, 2].map(i => (
                  <div key={i} className="flex gap-3 items-center p-2 hover:bg-slate-50 rounded-lg transition-all cursor-pointer border border-transparent hover:border-slate-100">
                    <img src={`https://randomuser.me/api/portraits/lego/${i + 5}.jpg`} className="w-8 h-8 rounded-md bg-slate-100 object-cover shadow-sm" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-800 text-xs leading-tight truncate">TechNovation Inc.</h4>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">Raised Series A • 2d ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 3: Stock Prices */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4 flex flex-col gap-3 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none opacity-50"></div>
              <div className="flex items-center gap-2 relative z-10 border-b border-slate-50 pb-2">
                <DollarSign className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Market Watch</h3>
              </div>
              <div className="space-y-2 relative z-10">
                <div className="flex justify-between items-center py-1">
                  <span className="font-bold text-slate-700 text-xs">NVDA</span>
                  <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded text-[10px] font-bold">+2.4%</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-bold text-slate-700 text-xs">MSFT</span>
                  <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded text-[10px] font-bold">+0.8%</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-bold text-slate-700 text-xs">AAPL</span>
                  <span className="bg-rose-50 text-rose-600 border border-rose-100 px-1.5 py-0.5 rounded text-[10px] font-bold">-0.2%</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-bold text-slate-700 text-xs">GOOGL</span>
                  <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded text-[10px] font-bold">+1.1%</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
