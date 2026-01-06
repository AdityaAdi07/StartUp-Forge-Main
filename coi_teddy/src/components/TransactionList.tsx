import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Apple, MoreVertical } from "lucide-react";

const transactions = [
    {
        id: 1,
        name: "Apple",
        date: "03 April, 2024",
        amount: "$653",
        icon: <Apple className="w-6 h-6" />,
        isLogo: true,
    },
    {
        id: 2,
        name: "Ralph Edwards",
        date: "01 April, 2024",
        amount: "$2,643",
        image: "https://i.pravatar.cc/150?u=ralph",
    },
    {
        id: 3,
        name: "Jerome Bell",
        date: "27 March, 2024",
        amount: "$20",
        image: "https://i.pravatar.cc/150?u=jerome",
    },
];

const TransactionList = () => {
    return (
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-border h-full">
            <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-lg">Last Transactions</h3>
                <button className="text-muted-foreground hover:text-foreground">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>

            <div className="flex flex-col gap-6">
                {transactions.map((t) => (
                    <div key={t.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-border">
                                {t.isLogo ? (
                                    t.icon
                                ) : (
                                    <Avatar className="w-full h-full">
                                        <AvatarImage src={t.image} />
                                        <AvatarFallback>{t.name.substring(0, 1)}</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-lg">{t.name}</span>
                                <span className="text-sm text-muted-foreground font-medium">{t.date}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="font-bold text-xl">{t.amount}</span>
                            <button className="text-muted-foreground hover:text-foreground">
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransactionList;
