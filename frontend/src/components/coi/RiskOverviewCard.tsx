import { CheckCircle2, AlertTriangle, XCircle, Link2, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RiskOverviewCardProps {
    level: 1 | 2;
    hasConflict: boolean;
    riskScore: number;
    relationships: string[];
    description: string;
}

const RiskOverviewCard = ({
    level,
    hasConflict,
    riskScore,
    relationships,
    description,
}: RiskOverviewCardProps) => {
    const getSeverity = (score: number) => {
        if (score <= 30) return { label: "Low", color: "bg-emerald-50 text-emerald-600 border-emerald-200" };
        if (score <= 60) return { label: "Medium", color: "bg-amber-50 text-amber-600 border-amber-200" };
        return { label: "High", color: "bg-red-50 text-red-600 border-red-200" };
    };

    const severity = getSeverity(riskScore);

    const getStatusIcon = () => {
        if (!hasConflict) return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
        if (riskScore <= 60) return <AlertTriangle className="h-5 w-5 text-amber-500" />;
        return <XCircle className="h-5 w-5 text-red-500" />;
    };

    const getRiskBarColor = () => {
        if (riskScore <= 30) return "bg-emerald-500";
        if (riskScore <= 60) return "bg-amber-500";
        return "bg-red-500";
    };

    return (
        <Card className="animate-fade-in bg-white border-border rounded-[2.5rem] shadow-sm overflow-hidden">
            <CardHeader className="pb-3 p-8">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${level === 1 ? "bg-primary/10" : "bg-purple-100"
                            }`}>
                            {level === 1 ? (
                                <Link2 className="h-6 w-6 text-primary" />
                            ) : (
                                <Users className="h-6 w-6 text-purple-600" />
                            )}
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold">
                                Level {level}: {level === 1 ? "Direct Conflict" : "Indirect Conflict"}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-0.5 font-medium">
                                {level === 1 ? "Immediate relationships" : "Multi-hop connections via intermediaries"}
                            </p>
                        </div>
                    </div>

                    <Badge variant="outline" className={`${severity.color} rounded-full px-3 py-1 font-bold text-xs uppercase tracking-wider`}>
                        {severity.label} Risk
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-6 px-8 pb-8">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary min-w-fit">
                        {getStatusIcon()}
                        <span className="text-sm font-bold">
                            {hasConflict ? "Conflict Detected" : "No Conflict"}
                        </span>
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-tight">Risk Score</span>
                            <span className="text-lg font-bold">{riskScore}/100</span>
                        </div>
                        <div className="h-3 rounded-full bg-secondary overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-700 ease-in-out ${getRiskBarColor()}`}
                                style={{ width: `${riskScore}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-base text-muted-foreground font-medium leading-relaxed">{description}</p>

                    {relationships.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {relationships.map((rel, i) => (
                                <Badge
                                    key={i}
                                    variant="secondary"
                                    className="rounded-lg px-3 py-1 text-xs font-bold bg-secondary text-foreground border-none"
                                >
                                    {rel}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default RiskOverviewCard;
