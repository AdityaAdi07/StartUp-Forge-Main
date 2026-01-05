import { useState, useEffect } from "react";
// New Components
import DashboardHeader from "@/components/coi/DashboardHeader";
import EntitySelectionPanel from "@/components/coi/EntitySelectionPanel";
import RiskOverviewCard from "@/components/coi/RiskOverviewCard";
import RelationshipGraph from "@/components/coi/RelationshipGraph";
import ConflictExplanationPanel from "@/components/coi/ConflictExplanationPanel";
import ComplianceActions from "@/components/coi/ComplianceActions";

// UI Components
import { Badge } from "@/components/ui/badge";
import { Calendar, RefreshCw, Sparkles } from "lucide-react";
import { Toaster, toast } from "sonner";

interface ConflictReportPageProps {
    onBack: () => void;
    currentInvestorName?: string;
    targetCompanyName?: string;
}

const ConflictReportPage = ({ onBack, currentInvestorName, targetCompanyName }: ConflictReportPageProps) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [conflictData, setConflictData] = useState<any>(null);
    const [hasResults, setHasResults] = useState(false);
    const [selectedInvestor, setSelectedInvestor] = useState(currentInvestorName || "");
    const [selectedTarget, setSelectedTarget] = useState(targetCompanyName || "");

    const handleRunCheck = async (investor: string, target: string) => {
        setIsAnalyzing(true);
        setHasResults(false);
        setSelectedInvestor(investor);
        setSelectedTarget(target);

        try {
            const res = await fetch('http://localhost:3000/api/coi/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    investorName: investor,
                    targetCompany: target
                })
            });
            const data = await res.json();
            setConflictData(data);
            setHasResults(true);
            toast.success("Analysis Complete", { description: "Conflict detection finished successfully." });
        } catch (err) {
            console.error("COI Analysis Failed", err);
            toast.error("Analysis Failed", { description: "Could not connect to the analysis engine." });
            setConflictData(null);
        } finally {
            // Minimum loading time for UX
            setTimeout(() => setIsAnalyzing(false), 1200);
        }
    };

    // Auto-run analysis if investor is pre-selected
    useEffect(() => {
        if (currentInvestorName && targetCompanyName) {
            handleRunCheck(currentInvestorName, targetCompanyName);
        }
    }, [currentInvestorName, targetCompanyName]);

    // Helpers to extract display data
    const currentLevel = conflictData?.conflictLevel || 0;
    const hasConflict = conflictData?.hasConflict || false;

    // --- Level 1 Data (Sector Overlap) ---
    const isLevel1 = currentLevel === 1;
    const level1Companies = isLevel1 ? (conflictData.conflictingCompanies || []) : [];
    const level1Tags = isLevel1 ? level1Companies : [];

    // --- Level 2 Data (Subsidiary/Competitor) ---
    const isLevel2 = currentLevel === 2;
    const level2Details = isLevel2 ? (conflictData.conflicts || []) : [];
    const level2Tags = isLevel2 ? level2Details.map((c: any) => c.investedParent) : [];

    // --- Calculate Score ---
    const riskScore = hasConflict ? (isLevel2 ? 85 : 45) : 0;

    // --- Normalize Data for Explanation Panel ---
    let explanationConflicts: any[] = [];
    if (isLevel2) {
        explanationConflicts = level2Details.map((c: any) => ({
            level: 2,
            path: [selectedInvestor, c.investedParent, c.competingSubsidiary, selectedTarget],
            reason: `Parent entity '${c.investedParent}' owns subsidiary '${c.competingSubsidiary}' which competes with the target.`
        }));
    } else if (isLevel1) {
        explanationConflicts = level1Companies.map((name: string) => ({
            level: 1,
            path: [selectedInvestor, name, selectedTarget],
            reason: `Portfolio company '${name}' operates in the same domain as the target.`
        }));
    }

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
                                Welcome, <span className="text-primary">{currentInvestorName || "Investor"}</span>
                            </h2>
                            <p className="text-xl text-muted-foreground mt-4 font-medium max-w-2xl leading-relaxed">
                                Review your direct and indirect relationship analysis below to identify and mitigate institutional conflicts.
                            </p>
                            {onBack && (
                                <button onClick={onBack} className="text-sm font-bold text-primary hover:underline mt-2">
                                    ← Back to Main Profile
                                </button>
                            )}
                        </div>

                        <div className="flex flex-col items-end gap-3">
                            <div className="flex items-center gap-3 bg-white/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/50 shadow-sm">
                                <Calendar className="h-5 w-5 text-primary" />
                                <span className="font-bold text-sm">{new Date().toLocaleDateString()}</span>
                            </div>
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-sm">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                                Compliance Live
                            </Badge>
                        </div>
                    </div>

                    {/* Entity Selection Section */}
                    <div className="px-4">
                        <EntitySelectionPanel
                            onRunCheck={handleRunCheck}
                            isLoading={isAnalyzing}
                            preselectedInvestor={currentInvestorName}
                            preselectedTarget={targetCompanyName}
                        />
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
                                        onClick={() => handleRunCheck(selectedInvestor, selectedTarget)}
                                        className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-all bg-white/60 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-sm border border-white/50"
                                    >
                                        <RefreshCw className={`h-4 w-4 ${isAnalyzing ? "animate-spin" : ""}`} />
                                        Recalculate
                                    </button>
                                </div>

                                <div className="grid lg:grid-cols-2 gap-10">
                                    <RiskOverviewCard
                                        level={1}
                                        hasConflict={isLevel1}
                                        riskScore={isLevel1 ? 45 : 0}
                                        relationships={level1Tags}
                                        description={isLevel1
                                            ? `${conflictData.reason} Direct portfolio overlap detected.`
                                            : "No direct investment or domain conflicts detected."}
                                    />
                                    <RiskOverviewCard
                                        level={2}
                                        hasConflict={isLevel2}
                                        riskScore={isLevel2 ? 85 : 0}
                                        relationships={level2Tags}
                                        description={isLevel2
                                            ? `${conflictData.reason} Indirect subsidiary/competitor conflict.`
                                            : "No subsidiary or competitor conflicts detected."}
                                    />
                                </div>
                            </div>

                            {/* Visualization Section */}
                            <div className="px-4">
                                <RelationshipGraph
                                    investorName={selectedInvestor}
                                    targetCompany={selectedTarget}
                                    conflictLevel={currentLevel}
                                    conflicts={level2Details}
                                    level1Companies={level1Companies}
                                />
                            </div>

                            {/* Detailed Breakdown */}
                            <div className="px-4 flex flex-col gap-12">
                                <ConflictExplanationPanel conflicts={explanationConflicts} />
                                <ComplianceActions
                                    reportData={conflictData}
                                    fileNamePrefix={`COI_${selectedInvestor}_${selectedTarget}`}
                                />
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

export default ConflictReportPage;
