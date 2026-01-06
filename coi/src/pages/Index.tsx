import { useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import EntitySelectionPanel from "@/components/EntitySelectionPanel";
import RiskOverviewCard from "@/components/RiskOverviewCard";
import RelationshipGraph from "@/components/RelationshipGraph";
import ConflictExplanationPanel from "@/components/ConflictExplanationPanel";
import ComplianceActions from "@/components/ComplianceActions";
import { Badge } from "@/components/ui/badge";
import { Calendar, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface ConflictResult {
  hasConflict: boolean;
  conflictLevel: number;
  conflictType?: string;
  confidence?: string;
  investor: string;
  targetCompany: string;
  conflicts?: any[];
  reason?: string;
  sector?: string;
  conflictingCompanies?: string[];
}

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ConflictResult | null>(null);

  const handleRunCheck = async (investorName: string, targetCompany: string) => {
    setIsAnalyzing(true);
    setHasResults(false);
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/coi/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ investorName, targetCompany }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      setAnalysisResult(data);
      setHasResults(true);
      toast.success("Conflict analysis complete");
    } catch (error) {
      console.error("Error analyzing conflict:", error);
      toast.error("Failed to run analysis. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground font-sans selection:bg-primary/20">
      <DashboardHeader />

      <main className="px-8 pb-20 pt-8 transition-all duration-300">
        <div className="max-w-[1600px] mx-auto space-y-10">

          {/* Hero Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 px-4">
            <div>
              <h2 className="text-5xl font-extrabold tracking-tight text-foreground">
                Welcome back, <span className="text-primary">Sarah Chen</span>
              </h2>
              <p className="text-xl text-muted-foreground mt-4 font-medium max-w-2xl leading-relaxed">
                Review your direct and indirect relationship analysis below to identify and mitigate institutional conflicts.
              </p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-3 bg-white/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/50 shadow-sm">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="font-bold text-sm">January 3, 2026</span>
              </div>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-sm">
                <div className="h-2 w-2 rounded-full bg-success mr-2 animate-pulse" />
                Compliance Live
              </Badge>
            </div>
          </div>

          {/* Entity Selection */}
          <div className="px-4">
            <EntitySelectionPanel onRunCheck={handleRunCheck} isLoading={isAnalyzing} />
          </div>

          {hasResults && analysisResult ? (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
              {/* Risk Assessment Grid */}
              <div className="px-4">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-black text-foreground/90 flex items-center gap-4">
                    <Sparkles className="h-8 w-8 text-primary" />
                    Conflict Risk Summary
                  </h3>
                  <button
                    onClick={() => setHasResults(false)}
                    className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-all bg-white/60 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-sm border border-white/50"
                  >
                    <RefreshCw className={`h-4 w-4 ${isAnalyzing ? "animate-spin" : ""}`} />
                    New Analysis
                  </button>
                </div>

                <div className="grid lg:grid-cols-2 gap-10">
                  {/* Show specific card based on result */}
                  <RiskOverviewCard
                    level={analysisResult.conflictLevel}
                    hasConflict={analysisResult.hasConflict}
                    riskScore={analysisResult.hasConflict ? (analysisResult.conflictLevel === 2 ? 85 : 45) : 10}
                    relationships={[
                      analysisResult.conflictType || "None",
                      analysisResult.confidence || "Low Risk"
                    ]}
                    description={analysisResult.reason || "No conflict detected."}
                  />
                </div>
              </div>

              {/* Visualization Section */}
              <div className="px-4">
                <RelationshipGraph />
              </div>

              {/* Detailed Breakdown */}
              <div className="px-4 flex flex-col gap-12">
                <ConflictExplanationPanel />
                <ComplianceActions />
              </div>
            </div>
          ) : !isAnalyzing && (
            <div className="px-4 py-32 text-center">
              <div className="bg-white/40 backdrop-blur-xl rounded-[3rem] p-16 shadow-xl border border-white/40 inline-block max-w-xl">
                <div className="w-24 h-24 bg-primary/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                  <Sparkles className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-3xl font-black mb-4">No analysis data</h3>
                <p className="text-muted-foreground text-lg font-semibold leading-relaxed">Select an entity above and run the conflict check to generate the relationship graph and risk assessment.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
