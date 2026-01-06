import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { ArrowUp } from "lucide-react";

const data = [
    { month: "Nov", value: 400 },
    { month: "Dec", value: 300 },
    { month: "Jan", value: 600 },
    { month: "Feb", value: 500 },
    { month: "Mar", value: 800 },
];

const BalanceStatsCard = () => {
    return (
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-border flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-muted-foreground font-medium mb-1">Balance Statistics</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">$38,729.61</span>
                        <span className="text-sm font-medium text-muted-foreground">Total amount</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 mb-8">
                <div className="flex flex-col">
                    <div className="w-24 h-8 bg-muted rounded-full overflow-hidden relative mb-2">
                        <div className="absolute inset-0 bg-primary/20" />
                        <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
                            <path d="M0,35 Q25,5 50,20 T100,10" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
                        </svg>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-bold">
                        <span className="bg-primary/10 p-1 rounded-full">
                            <ArrowUp className="w-3 h-3 text-primary" />
                        </span>
                        <span>14%</span>
                    </div>
                </div>
                <p className="text-xs text-muted-foreground leading-tight max-w-[100px]">
                    Always see your earning updates
                </p>
            </div>

            <div className="flex-1 min-h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#9CA3AF", fontSize: 12 }}
                            dy={10}
                        />
                        <Tooltip cursor={{ fill: 'transparent' }} />
                        <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={24}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === data.length - 1 ? "#8B93C7" : "#E5E7EB"} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default BalanceStatsCard;
