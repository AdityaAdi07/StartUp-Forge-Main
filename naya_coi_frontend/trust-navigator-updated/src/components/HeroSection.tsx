import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight } from "lucide-react";

const contacts = [
    { name: "User 1", image: "https://i.pravatar.cc/150?u=1" },
    { name: "User 2", image: "https://i.pravatar.cc/150?u=2" },
    { name: "User 3", image: "https://i.pravatar.cc/150?u=3" },
    { name: "User 4", image: "https://i.pravatar.cc/150?u=4" },
    { name: "User 5", image: "https://i.pravatar.cc/150?u=5" },
    { name: "User 6", image: "https://i.pravatar.cc/150?u=6" },
    { name: "User 7", image: "https://i.pravatar.cc/150?u=7" },
];

const HeroSection = () => {
    return (
        <div className="flex items-center justify-between px-8 py-4">
            <div className="flex flex-col">
                <h2 className="text-5xl font-bold">
                    Hello, <span className="text-[#8B93C7]">Alif Reza</span>
                </h2>
                <p className="text-muted-foreground mt-2">View and control your finances here!</p>
            </div>

            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm p-1.5 rounded-full pr-4 border border-white/50 shadow-sm">
                <div className="flex -space-x-3">
                    {contacts.map((contact, i) => (
                        <Avatar key={i} className="w-12 h-12 border-4 border-white">
                            <AvatarImage src={contact.image} />
                            <AvatarFallback>U{i}</AvatarFallback>
                        </Avatar>
                    ))}
                </div>
                <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-muted transition-colors ml-2 border border-border">
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default HeroSection;
