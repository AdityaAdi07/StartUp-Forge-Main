import { ChevronRight, FileText, AlertCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

interface ConflictPath {
  id: string;
  path: string[];
  severity: "low" | "medium" | "high";
  explanation: string;
}

interface ConflictExplanationPanelProps {
  conflicts: any[];
}

const ConflictExplanationPanel = ({ conflicts = [] }: ConflictExplanationPanelProps) => {
  const [conflictPaths, setConflictPaths] = useState<ConflictPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>("0");

  useEffect(() => {
    if (!conflicts || conflicts.length === 0) {
      setConflictPaths([]);
      return;
    }

    const mapped = conflicts.map((c, i) => ({
      id: i.toString(),
      path: c.path || [c.company || "Entity"],
      severity: (c.level === 2 ? "high" : "medium") as "high" | "medium" | "low",
      explanation: c.reason || "Automatic conflict detection."
    }));
    setConflictPaths(mapped);
    if (mapped.length > 0) setSelectedPath("0");

  }, [conflicts]);

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "high":
        return {
          badge: "bg-destructive/10 text-destructive border-destructive/20",
          dot: "bg-destructive",
        };
      case "medium":
        return {
          badge: "bg-warning/10 text-warning border-warning/20",
          dot: "bg-warning",
        };
      default:
        return {
          badge: "bg-success/10 text-success border-success/20",
          dot: "bg-success",
        };
    }
  };

  const selectedConflict = conflictPaths.find(p => p.id === selectedPath);

  if (conflictPaths.length === 0) return null;

  return (
    <Card className="animate-fade-in h-full bg-white border-border rounded-[2.5rem] shadow-sm overflow-hidden border-none">
      <CardHeader className="pb-3 p-8">
        <CardTitle className="flex items-center gap-3 text-xl font-bold">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          Conflict Explanation
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid md:grid-cols-2">
          {/* Left: Conflict Paths */}
          <div className="p-8 border-r border-border/50">
            <h4 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-wider">
              Detected Conflict Paths
            </h4>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {conflictPaths.map((conflict) => {
                  const styles = getSeverityStyles(conflict.severity);
                  const isSelected = selectedPath === conflict.id;

                  return (
                    <button
                      key={conflict.id}
                      onClick={() => setSelectedPath(conflict.id)}
                      className={`w-full text-left p-4 rounded-[1.5rem] border transition-all duration-300 ${isSelected
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                        : "border-border/50 hover:border-primary/20 hover:bg-secondary/30"
                        }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline" className={`${styles.badge} rounded-full font-bold px-2 py-0.5 text-[10px] uppercase tracking-tighter`}>
                          {conflict.severity} severity
                        </Badge>
                        <ChevronRight className={`h-4 w-4 transition-transform ${isSelected ? "text-primary rotate-90" : "text-muted-foreground"
                          }`} />
                      </div>
                      <div className="flex flex-wrap items-center gap-1">
                        {conflict.path.map((node, i) => (
                          <span key={i} className="flex items-center text-xs">
                            <span className={`font-bold ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                              {node}
                            </span>
                            {i < conflict.path.length - 1 && (
                              <ChevronRight className="h-3 w-3 text-muted-foreground/50 mx-1" />
                            )}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Right: Explanation */}
          <div className="p-8 bg-[#F8FAFC]">
            <h4 className="text-sm font-bold text-muted-foreground mb-4 flex items-center gap-2 uppercase tracking-wider">
              <Info className="h-4 w-4" />
              Plain-English Explanation
            </h4>

            {selectedConflict && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-wrap items-center gap-2 p-4 rounded-[1.5rem] bg-white border border-border shadow-sm">
                  {selectedConflict.path.map((node, i) => (
                    <span key={i} className="flex items-center">
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${i === 0
                        ? "bg-primary text-white"
                        : i === selectedConflict.path.length - 1
                          ? "bg-destructive text-white"
                          : "bg-secondary text-foreground"
                        }`}>
                        {node}
                      </span>
                      {i < selectedConflict.path.length - 1 && (
                        <ChevronRight className="h-4 w-4 text-muted-foreground/30 mx-1" />
                      )}
                    </span>
                  ))}
                </div>

                <div className="p-6 rounded-[1.5rem] bg-white border border-border shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className={`mt-1.5 h-3 w-3 rounded-full shrink-0 ${getSeverityStyles(selectedConflict.severity).dot}`} />
                    <p className="text-base text-foreground font-medium leading-relaxed">
                      {selectedConflict.explanation}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-[1.5rem] bg-primary/5 border border-primary/10">
                  <AlertCircle className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-xs text-muted-foreground font-medium leading-normal">
                    This explanation is audit-ready and suitable for compliance documentation.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConflictExplanationPanel;
