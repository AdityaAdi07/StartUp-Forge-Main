import { MoreVertical } from "lucide-react";

const ExpensesIncomeCard = () => {
    return (
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-border h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-lg">Expenses & Income</h3>
                <button className="text-muted-foreground hover:text-foreground">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="flex flex-col gap-1">
                    <span className="text-3xl font-bold">60%</span>
                    <span className="text-xs text-muted-foreground font-medium">Expenses</span>
                </div>
                <div className="flex flex-col gap-1 text-right">
                    <span className="text-3xl font-bold">40%</span>
                    <span className="text-xs text-muted-foreground font-medium">Income</span>
                </div>
            </div>

            <div className="flex w-full h-8 rounded-full overflow-hidden bg-muted gap-1">
                <div className="h-full bg-[#8B93C7] transition-all duration-500" style={{ width: "60%" }} />
                <div className="h-full bg-[#FFE8A3] transition-all duration-500" style={{ width: "40%" }} />
            </div>

            <div className="mt-auto pt-8">
                <div className="bg-[#2D2D2D] rounded-3xl p-6 text-white flex items-center justify-between shadow-lg">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="text-[10px]">💎</span>
                            </div>
                            <span className="font-bold">More features?</span>
                        </div>
                        <p className="text-[10px] text-white/60 leading-tight">
                            Update your account to<br />premium to get more features
                        </p>
                    </div>
                    <button className="bg-white text-black text-xs font-bold px-4 py-3 rounded-full hover:bg-white/90 transition-colors">
                        Go to premium
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExpensesIncomeCard;
