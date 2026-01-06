import { useState, useEffect } from 'react';
import { Users, Bell, MessageSquare, BrainCircuit, Sparkles, UserPlus, UserCheck, X, Check, Search, TrendingUp, ShieldCheck, Home } from 'lucide-react';

// --- Types ---
interface AppUser {
  id: string;
  name: string;
  headline: string;
  avatar: string;
  connections: number;
}

interface ConnectionRequest {
  id: string;
  userId: string;
  userName: string;
  userHeadline: string;
  userAvatar: string;
  mutualConnections: number;
}

interface NetworkPageProps {
  currentUser: AppUser;
  suggestedUsers: AppUser[]; // Kept for backward compat or other sections
  founders: AppUser[];
  investors: AppUser[];
  followedUsers: Set<string>;
  connectedUsers: Set<string>;
  onRejectRequest: (id: string) => void;
  onFollowUser: (userId: string) => void;
  onViewProfile: (userId: string) => void;
  onAcceptRequest: (id: string) => void;
  onNavigate: (page: string) => void;
  onSearch?: (query: string) => void;
}

export function NetworkPage({
  currentUser,
  founders,
  investors,
  followedUsers,
  connectedUsers,
  onRejectRequest,
  onAcceptRequest,
  onFollowUser,
  onViewProfile,
  onNavigate,
  onSearch
}: NetworkPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // splitting logic removed as we now receive clear lists


  const fetchRequests = async () => {
    try {
      if (!currentUser.id) return;
      const res = await fetch('/connections/requests/incoming', {
        headers: { 'x-user-id': currentUser.id }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        const mapped = data.map((r: any) => ({
          id: r.id,
          userId: String(r.sender_id),
          userName: `User ${r.sender_id}`,
          userHeadline: r.sender_role || 'Founder',
          userAvatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
          mutualConnections: 0
        }));
        setRequests(mapped);
      }
    } catch (e) {
      console.error("Failed to fetch requests", e);
    }
  };

  useEffect(() => {
    if (currentUser.id) {
      fetchRequests();
    }
  }, [currentUser.id]);

  const handleAcceptInternal = async (reqId: string) => {
    try {
      await fetch(`/connections/accept/${reqId}`, {
        method: 'POST',
        headers: { 'x-user-id': currentUser.id }
      });
      onAcceptRequest(reqId);
      fetchRequests();
    } catch (e) { console.error(e); }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  // --- Render Helpers ---

  const renderTopProfiles = (users: AppUser[]) => (
    <div className="flex flex-row gap-6 overflow-x-auto pb-4 custom-scrollbar">
      {users.slice(0, 5).map((user) => (
        <div key={user.id} className="flex flex-col items-center min-w-[80px] group cursor-pointer" onClick={() => onViewProfile(user.id)}>
          <div className="relative mb-2">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-14 h-14 rounded-full border-2 border-white shadow-sm group-hover:border-slate-300 transition-all object-cover"
            />
            {connectedUsers.has(user.id) && (
              <div className="absolute bottom-0 right-0 bg-green-500 border-2 border-white rounded-full p-0.5">
                <Check className="w-2 h-2 text-white" />
              </div>
            )}
          </div>
          <span className="text-xs font-bold text-slate-800 text-center leading-tight line-clamp-2 w-20">{user.name}</span>
          <span className="text-[10px] text-slate-500 text-center truncate w-20">{user.headline}</span>
        </div>
      ))}
    </div>
  );

  const renderUserCard = (user: AppUser) => (
    <div key={user.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-soft transition-all hover:border-slate-300 group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0" onClick={() => onViewProfile(user.id)}>
          <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full object-cover border border-gray-100 cursor-pointer" />
          <div className="flex-1 min-w-0 py-1">
            <h4 className="font-bold text-slate-900 text-base truncate group-hover:text-blue-600 transition-colors cursor-pointer">{user.name}</h4>
            <p className="text-sm text-slate-500 line-clamp-1 mt-0.5">{user.headline}</p>
            <p className="text-xs text-gray-400 mt-1.5">{user.connections} connections</p>
          </div>
        </div>
        <button
          onClick={() => !connectedUsers.has(user.id) && onFollowUser(user.id)}
          disabled={connectedUsers.has(user.id)}
          className={`p-2.5 rounded-full transition-all flex-shrink-0 ${connectedUsers.has(user.id)
            ? 'bg-green-50 text-green-600'
            : followedUsers.has(user.id)
              ? 'bg-gray-50 text-gray-400'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white'
            }`}
        >
          {connectedUsers.has(user.id) ? <UserCheck className="w-5 h-5" /> : followedUsers.has(user.id) ? <Check className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
      {/* --- Fixed Header (Exact Match to HomePage) --- */}
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
            <ActionItem icon={<Bell className="w-7 h-7" />} label="Alerts" badge={true} onClick={() => onNavigate('notifications')} />
            <ActionItem icon={<MessageSquare className="w-7 h-7" />} label="Inbox" onClick={() => onNavigate('messages')} />
            <ActionItem icon={<BrainCircuit className="w-7 h-7" />} label="Deep Analysis" onClick={() => onNavigate('conflict-report')} />
          </div>
        </div>
      </div>

      {/* --- Main Network Content --- */}
      <div className="flex-1 overflow-y-auto w-full max-w-[1600px] mx-auto p-6" style={{ height: 'calc(100vh - 6rem)' }}>

        {/* Invitations Section (If any) */}
        {requests.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
              <h2 className="text-lg font-bold text-slate-900">Invitations</h2>
              <span className="text-slate-500 text-sm font-medium">{requests.length} pending</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <img src={request.userAvatar} className="w-12 h-12 rounded-full" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{request.userName}</h4>
                      <p className="text-xs text-slate-500">{request.userHeadline}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => onRejectRequest(request.id)} className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors"><X className="w-5 h-5" /></button>
                    <button onClick={() => handleAcceptInternal(request.id)} className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"><Check className="w-5 h-5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2 Halves Layout */}
        <div className="flex flex-row gap-6 h-full">

          {/* LEFT: Founder Connections */}
          <div className="flex-1 flex flex-col gap-6 h-full min-w-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center gap-2 bg-white">
                <div className="p-2 bg-indigo-50 rounded-lg"><Users className="w-5 h-5 text-indigo-600" /></div>
                <h3 className="text-lg font-bold text-slate-900">Founder Connections</h3>
              </div>

              <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
                {/* Top 5 Small Profile Container */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Top 5 Connected</h4>
                  {renderTopProfiles(founders)}
                </div>

                {/* All Founders Cards */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">All Founders</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {founders.map(renderUserCard)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Investor Connections */}
          <div className="flex-1 flex flex-col gap-6 h-full min-w-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center gap-2 bg-white">
                <div className="p-2 bg-emerald-50 rounded-lg"><TrendingUp className="w-5 h-5 text-emerald-600" /></div>
                <h3 className="text-lg font-bold text-slate-900">Investor Connections</h3>
              </div>

              <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
                {/* Top 5 Small Profile Container */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Top 5 Investors</h4>
                  {renderTopProfiles(investors)}
                </div>

                {/* All Investors Cards */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">All Investors</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {investors.map(renderUserCard)}
                  </div>
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

// --- Sub-components (Copied for consistency) ---

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

function ProfileModal({ currentUser, onClose, onNavigate }: { currentUser: AppUser, onClose: () => void, onNavigate: (p: string) => void }) {
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
