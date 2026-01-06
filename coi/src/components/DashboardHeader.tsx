import { Shield, User, ChevronDown, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DashboardHeader = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-md px-8">
            <div className="flex h-16 items-center justify-between mx-auto max-w-[1600px]">
                <div className="flex items-center gap-8">
                    <a href="/" className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                            <Shield className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-foreground tracking-tight">
                            ComplianceAI
                        </span>
                    </a>

                    <nav className="hidden md:flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="text-muted-foreground font-bold hover:text-foreground">
                            Dashboard
                        </Button>
                        <Button variant="secondary" size="sm" className="bg-primary/10 text-primary font-bold hover:bg-primary/20 rounded-full px-4">
                            COI Analysis
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground font-bold hover:text-foreground">
                            Reports
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground font-bold hover:text-foreground">
                            Entities
                        </Button>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="relative hover:bg-secondary">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive border-2 border-white" />
                    </Button>

                    <Button variant="ghost" size="icon" className="hover:bg-secondary">
                        <Settings className="h-5 w-5 text-muted-foreground" />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="gap-2 px-2 hover:bg-secondary rounded-xl transition-all">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary overflow-hidden border border-primary/20">
                                    <User className="h-5 w-5" />
                                </div>
                                <span className="hidden lg:inline text-sm font-bold text-foreground">Sarah Chen</span>
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px] bg-white rounded-2xl shadow-xl border-border p-2">
                            <DropdownMenuItem className="rounded-xl font-medium focus:bg-secondary">
                                Profile Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl font-medium focus:bg-secondary">
                                Team Management
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border/50" />
                            <DropdownMenuItem className="rounded-xl font-medium focus:bg-secondary">
                                Audit Log
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl font-medium focus:bg-secondary">
                                Help & Support
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border/50" />
                            <DropdownMenuItem className="text-destructive font-bold rounded-xl focus:bg-destructive/10">
                                Sign Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
