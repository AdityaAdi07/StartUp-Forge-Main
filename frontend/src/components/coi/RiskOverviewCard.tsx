import { CheckCircle2, AlertTriangle, XCircle, TrendingUp, Link2, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/components/ui/utils";

interface RiskOverviewCardProps {
  level: 1 | 2;
  hasConflict: boolean;
  riskScore: number;
  relationships: string[];
  description: string;
  className?: string;
}

const RiskOverviewCard = ({
  level,
  hasConflict,
  riskScore,
  relationships,
  description,
  className,
}: RiskOverviewCardProps) => {
  const getSeverity = (score: number) => {
    if (score <= 30) return { label: "Low", color: "bg-success/10 text-success border-success/20" };
    if (score <= 60) return { label: "Medium", color: "bg-warning/10 text-warning border-warning/20" };
    return { label: "High", color: "bg-destructive/10 text-destructive border-destructive/20" };
  };

  const severity = getSeverity(riskScore);

  const getStatusIcon = () => {
    if (!hasConflict) return <CheckCircle2 className="h-5 w-5 text-success" />;
    if (riskScore <= 60) return <AlertTriangle className="h-5 w-5 text-warning" />;
    return <XCircle className="h-5 w-5 text-destructive" />;
  };

  const getCardVariant = () => {
    if (!hasConflict) return "success" as const;
    if (riskScore <= 60) return "warning" as const;
    return "danger" as const;
  };

  const getRiskBarColor = () => {
    if (riskScore <= 30) return "bg-success";
    if (riskScore <= 60) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <Card
      variant={getCardVariant()}
      className={cn(
        "animate-fade-in bg-white border-border rounded-[2.5rem] shadow-sm overflow-hidden",
        className
      )}
    >
      <CardHeader className="pb-3 p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${level === 1 ? "bg-primary/10" : "bg-accent"
              }`}>
              {level === 1 ? (
                <Link2 className="h-6 w-6 text-primary" />
              ) : (
                <Users className="h-6 w-6 text-accent-foreground" />
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
