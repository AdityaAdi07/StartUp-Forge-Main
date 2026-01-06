import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { MoreVertical } from "lucide-react";

const data = [
    { name: "Done", value: 90, color: "#8B93C7" },
    { name: "In progress", value: 5, color: "#FFD485" },
    { name: "To do", value: 5, color: "#FF9F9F" },
];

const AnalyticsCard = () => {
    return (
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-border h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Analytics</h3>
                <button className="text-muted-foreground hover:text-foreground">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>

            <div className="flex flex-col gap-2 mb-6">
                {data.map((item) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span>{item.name}</span>
                    </div>
                ))}
            </div>

            <div className="flex-1 relative min-h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            startAngle={180}
                            endAngle={-180}
                            cornerRadius={10}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-extrabold">90%</span>
                    <span className="text-xs text-muted-foreground font-medium">Done</span>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsCard;
