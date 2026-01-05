import { CreditCard } from "lucide-react";

const VirtualCard = () => {
    return (
        <div className="relative w-full h-full min-h-[240px] rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#A7B5FF] to-[#7B8BFF] p-8 text-white shadow-xl shadow-primary/20">
            <div className="flex justify-between items-start mb-12">
                <span className="text-sm font-medium tracking-widest opacity-80">THE BANK OF ANYTHING</span>
                <div className="w-12 h-8 bg-white/20 rounded-md backdrop-blur-sm flex items-center justify-center">
                    <div className="w-8 h-6 bg-yellow-400/80 rounded" />
                </div>
            </div>

            <div className="flex gap-4 mb-4">
                <div className="flex flex-col gap-1">
                    <span className="w-1 h-1 bg-white rounded-full opacity-40" />
                    <span className="w-1 h-1 bg-white rounded-full opacity-40" />
                    <span className="w-1 h-1 bg-white rounded-full opacity-40" />
                </div>
                <div className="flex flex-col gap-1">
                    <span className="w-1 h-1 bg-white rounded-full opacity-40" />
                    <span className="w-1 h-1 bg-white rounded-full opacity-40" />
                    <span className="w-1 h-1 bg-white rounded-full opacity-40" />
                </div>
                <div className="flex flex-col gap-1">
                    <span className="w-1 h-1 bg-white rounded-full opacity-40" />
                    <span className="w-1 h-1 bg-white rounded-full opacity-40" />
                    <span className="w-1 h-1 bg-white rounded-full opacity-40" />
                </div>
                <span className="text-2xl font-bold tracking-[0.2em] ml-2">2734</span>
            </div>

            <div className="flex justify-between items-end mt-auto">
                <div className="flex flex-col gap-4">
                    <div className="flex gap-8 text-xs font-medium opacity-80">
                        <div className="flex flex-col">
                            <span>3/18</span>
                        </div>
                        <div className="flex flex-col">
                            <span>3/28</span>
                        </div>
                    </div>
                    <span className="text-lg font-medium">Alif Reza</span>
                </div>
                <div className="flex -space-x-3">
                    <div className="w-10 h-10 rounded-full bg-red-500/80" />
                    <div className="w-10 h-10 rounded-full bg-yellow-500/80" />
                </div>
            </div>
        </div>
    );
};

export default VirtualCard;
