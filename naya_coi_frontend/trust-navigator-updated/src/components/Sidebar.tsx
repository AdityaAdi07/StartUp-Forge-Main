import { Shield, LayoutGrid, Briefcase, Code, Settings, HelpCircle, LogOut, Bell, Globe, User } from "lucide-react";
import { cn } from "@/lib/utils";

const SidebarItem = ({ icon: Icon, active = false }: { icon: any, active?: boolean }) => (
  <div className={cn(
    "flex items-center justify-center w-12 h-12 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-110",
    active ? "bg-white text-primary shadow-lg shadow-primary/10" : "text-muted-foreground hover:bg-white hover:text-primary hover:shadow-md"
  )}>
    <Icon className="w-5 h-5 font-bold" />
  </div>
);

const Sidebar = () => {
  return (
    <aside className="fixed left-4 top-4 bottom-4 w-20 bg-white/40 backdrop-blur-xl rounded-[2.5rem] flex flex-col items-center py-8 gap-8 shadow-xl border border-white/20 z-50 transition-all duration-300">
      <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20 rotate-0 hover:rotate-12 transition-transform cursor-pointer">
        <Shield className="w-6 h-6 text-white" />
      </div>

      <nav className="flex flex-col gap-6 flex-1">
        <SidebarItem icon={LayoutGrid} active />
        <SidebarItem icon={Briefcase} />
        <SidebarItem icon={Code} />
        <SidebarItem icon={Settings} />
      </nav>

      <div className="flex flex-col gap-6 mt-auto">
        <SidebarItem icon={Bell} />
        <SidebarItem icon={Globe} />
        <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-white overflow-hidden shadow-sm cursor-pointer hover:scale-110 transition-transform">
          <User className="w-full h-full p-2 text-primary" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
