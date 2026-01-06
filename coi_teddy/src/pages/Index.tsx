import { useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import EntitySelectionPanel from "@/components/EntitySelectionPanel";
import RiskOverviewCard from "@/components/RiskOverviewCard";
import RelationshipGraph from "@/components/RelationshipGraph";
import ConflictExplanationPanel from "@/components/ConflictExplanationPanel";
import ComplianceActions from "@/components/ComplianceActions";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, RefreshCw, Sparkles } from "lucide-react";

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasResults, setHasResults] = useState(true);

  const handleRunCheck = () => {
    setIsAnalyzing(true);
    setHasResults(false);

    setTimeout(() => {
      setIsAnalyzing(false);
      setHasResults(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground font-sans selection:bg-primary/20">
      {/* Top Header - Global */}
      <DashboardHeader />

      {/* Main Content Area */}
      <main className="px-8 pb-20 pt-8 transition-all duration-300">
        <div className="max-w-[1600px] mx-auto space-y-10">

          {/* Hero / Header Section */}
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

          {/* Entity Selection Section */}
          <div className="px-4">
            <EntitySelectionPanel onRunCheck={handleRunCheck} isLoading={isAnalyzing} />
          </div>

          {hasResults ? (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
              {/* Risk Assessment Grid */}
              <div className="px-4">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-black text-foreground/90 flex items-center gap-4">
                    <Sparkles className="h-8 w-8 text-primary" />
                    Conflict Risk Summary
                  </h3>
                  <button
                    onClick={handleRunCheck}
                    className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-all bg-white/60 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-sm border border-white/50"
                  >
                    <RefreshCw className={`h-4 w-4 ${isAnalyzing ? "animate-spin" : ""}`} />
                    Recalculate
                  </button>
                </div>

                <div className="grid lg:grid-cols-2 gap-10">
                  <RiskOverviewCard
                    level={1}
                    hasConflict={true}
                    riskScore={72}
                    relationships={["Investment", "Board Seat", "Employment"]}
                    description="Immediate direct relationships detected between the selected entity and target company through investment and governance connections."
                  />
                  <RiskOverviewCard
                    level={2}
                    hasConflict={true}
                    riskScore={45}
                    relationships={["Advisory", "Former Employment", "Shared Investor"]}
                    description="Indirect connections identified via intermediary entities. These multi-hop relationships may influence decision-making."
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
