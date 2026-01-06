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
  Home
} from 'lucide-react';

type NotificationsPageProps = {
  currentUser: any;
  onViewJob: (jobId: string) => void;
  onNavigateToChat: (userId: string) => void;
  onNavigate: (page: string) => void;
  onSearch: (query: string) => void;
};

// --- Sub-components for Header (Copied for consistency as per user request) ---
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
      <div className="flex-1 overflow-auto bg-slate-50">
        <div className="max-w-[1600px] mx-auto p-6 flex flex-row gap-6 h-full">

          {/* LEFT: Main Notification Details (notifications list) */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[500px]">
              <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Notifications</h2>
                <button className="text-sm font-semibold text-slate-500 hover:text-slate-900">Mark all as read</button>
              </div>

              <div className="space-y-2">
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
                    className={`group p-4 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all cursor-pointer flex items-start gap-4 ${notification.unread ? 'bg-indigo-50/50' : ''}`}
                  >
                    <div className="relative">
                      <img
                        src={notification.avatar}
                        alt="Avatar"
                        className="w-12 h-12 rounded-full object-cover border border-slate-100"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm">
                        {getIcon(notification.type)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-slate-900 font-medium text-[15px]">{notification.message}</p>
                      <p className="text-slate-500 text-xs mt-1">{notification.timestamp}</p>
                    </div>

                    {notification.unread && (
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full mt-2 self-start ring-4 ring-blue-50"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Sidebar Widgets */}
          <div className="w-96 flex-shrink-0 flex flex-col gap-6 min-w-0">

            {/* Widget 1: Investment Only Updates */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-50 rounded-lg"><PieChart className="w-5 h-5 text-emerald-600" /></div>
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Investment Updates</h3>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-slate-800 text-sm">Portfolio Growth</h4>
                  <p className="text-emerald-600 font-bold text-lg mt-1">+12.4% <span className="text-slate-400 text-xs font-normal text-black">this month</span></p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-slate-800 text-sm">New Opportunities</h4>
                  <p className="text-slate-600 text-sm mt-1">3 new matching startups found</p>
                </div>
              </div>
            </div>

            {/* Widget 2: Founder Company Updates */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg"><Building2 className="w-5 h-5 text-blue-600" /></div>
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Company Updates</h3>
              </div>
              <div className="space-y-3">
                {[1, 2].map(i => (
                  <div key={i} className="flex gap-3 items-center p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                    <img src={`https://randomuser.me/api/portraits/lego/${i + 5}.jpg`} className="w-10 h-10 rounded-lg bg-slate-200" />
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs">TechNovation Inc.</h4>
                      <p className="text-[10px] text-slate-500">Raised Series A • 2d ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 3: Stock Prices */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-50 rounded-lg"><DollarSign className="w-5 h-5 text-amber-600" /></div>
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Market Watch</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="font-bold text-slate-700 text-sm">NVDA</span>
                  <span className="text-emerald-600 font-medium text-sm">+2.4%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="font-bold text-slate-700 text-sm">MSFT</span>
                  <span className="text-emerald-600 font-medium text-sm">+0.8%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="font-bold text-slate-700 text-sm">AAPL</span>
                  <span className="text-red-500 font-medium text-sm">-0.2%</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-bold text-slate-700 text-sm">GOOGL</span>
                  <span className="text-emerald-600 font-medium text-sm">+1.1%</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
