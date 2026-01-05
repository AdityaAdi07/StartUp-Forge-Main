import { useState } from "react";
import { Search, Building2, Users, User, Target, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface EntitySelectionPanelProps {
    onRunCheck: (investorName: string, targetCompany: string) => void;
    isLoading?: boolean;
    preselectedInvestor?: string;
    preselectedTarget?: string;
}

const EntitySelectionPanel = ({ onRunCheck, isLoading, preselectedInvestor, preselectedTarget }: EntitySelectionPanelProps) => {
    const [entityType, setEntityType] = useState<string>("");
    const [selectedEntity, setSelectedEntity] = useState<string>("");
    const [targetCompany, setTargetCompany] = useState<string>("Kapital");

    // Use pre-selected values if available, otherwise use local state
    const activeInvestor = preselectedInvestor || selectedEntity;
    const activeTarget = preselectedTarget || targetCompany;

    const entityTypeIcons: Record<string, React.ReactNode> = {
        investor: <Users className="h-4 w-4" />,
        founder: <User className="h-4 w-4" />,
        company: <Building2 className="h-4 w-4" />,
    };

    const sampleEntities: Record<string, string[]> = {
        investor: ["Eyal Gura", "Sequoia Capital", "Andreessen Horowitz"],
        founder: ["John Smith", "Emily Johnson"],
        company: ["TechCorp Inc.", "StartupXYZ"],
    };

    const targetCompanies = ["Kapital", "Acme Technologies", "GlobalFinance Corp"];

    const handleRun = () => {
        if (activeInvestor && activeTarget) {
            onRunCheck(activeInvestor, activeTarget);
        }
    };

    const isManualMode = !preselectedInvestor;

    return (
        <Card className="animate-fade-in bg-white border-border rounded-[2.5rem] shadow-sm overflow-hidden p-4">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl font-bold">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
                        <Search className="h-5 w-5 text-primary" />
                    </div>
                    {isManualMode ? "Entity Selection" : "Conflict Analysis Scope"}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {isManualMode ? (
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                                Entity Type
                            </label>
                            <Select value={entityType} onValueChange={setEntityType}>
                                <SelectTrigger className="h-14 bg-secondary/30 border-none rounded-2xl font-bold text-foreground focus:ring-2 focus:ring-primary/20">
                                    <SelectValue placeholder="Select type..." />
                                </SelectTrigger>
                                <SelectContent className="bg-white rounded-2xl shadow-xl border-border">
                                    <SelectItem value="investor" className="rounded-xl focus:bg-primary/10">
                                        <span className="flex items-center gap-3 font-medium">
                                            <Users className="h-4 w-4 text-blue-500" />
                                            Investor
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="founder" className="rounded-xl focus:bg-primary/10">
                                        <span className="flex items-center gap-3 font-medium">
                                            <User className="h-4 w-4 text-purple-500" />
                                            Founder
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="company" className="rounded-xl focus:bg-primary/10">
                                        <span className="flex items-center gap-3 font-medium">
                                            <Building2 className="h-4 w-4 text-cyan-500" />
                                            Company
                                        </span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                                Select Entity
                            </label>
                            <Select
                                value={selectedEntity}
                                onValueChange={setSelectedEntity}
                                disabled={!entityType}
                            >
                                <SelectTrigger className="h-14 bg-secondary/30 border-none rounded-2xl font-bold text-foreground focus:ring-2 focus:ring-primary/20 disabled:opacity-50">
                                    <SelectValue placeholder={entityType ? "Search entities..." : "Select type first"} />
                                </SelectTrigger>
                                <SelectContent className="bg-white rounded-2xl shadow-xl border-border">
                                    {entityType && sampleEntities[entityType]?.map((entity) => (
                                        <SelectItem key={entity} value={entity} className="rounded-xl focus:bg-primary/10">
                                            <span className="flex items-center gap-3 font-medium">
                                                {entityTypeIcons[entityType]}
                                                {entity}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                                Target Company <span className="opacity-50 font-medium">(Optional)</span>
                            </label>
                            <Select value={targetCompany} onValueChange={setTargetCompany}>
                                <SelectTrigger className="h-14 bg-secondary/30 border-none rounded-2xl font-bold text-foreground focus:ring-2 focus:ring-primary/20">
                                    <SelectValue placeholder="Select target..." />
                                </SelectTrigger>
                                <SelectContent className="bg-white rounded-2xl shadow-xl border-border">
                                    {targetCompanies.map((company) => (
                                        <SelectItem key={company} value={company} className="rounded-xl focus:bg-primary/10">
                                            <span className="flex items-center gap-3 font-medium">
                                                <Target className="h-4 w-4 text-red-500" />
                                                {company}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-between bg-secondary/20 p-6 rounded-3xl border border-secondary">
                        <div className="flex items-center gap-8">
                            {/* Investor Side */}
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Analyzing Entity</span>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                        <User className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <span className="text-xl font-bold text-foreground">{activeInvestor}</span>
                                </div>
                            </div>

                            {/* Connection Line */}
                            <div className="flex items-center gap-2 opacity-50">
                                <div className="h-1 w-12 bg-border relative overflow-hidden">
                                    <div className="absolute inset-0 bg-primary/20 w-1/2 animate-[shimmer_2s_infinite]" />
                                </div>
                                <div className="text-xs font-bold text-muted-foreground uppercase">vs</div>
                                <div className="h-1 w-12 bg-border" />
                            </div>

                            {/* Target Side */}
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Against Target</span>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center">
                                        <Target className="h-5 w-5 text-red-600" />
                                    </div>
                                    <span className="text-xl font-bold text-foreground">{activeTarget}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-end pt-4">
                    <Button
                        variant="default"
                        size="lg"
                        onClick={handleRun}
                        disabled={!activeInvestor || !activeTarget || isLoading}
                        className="h-14 min-w-[260px] rounded-[1.25rem] font-bold text-base shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                    >
                        {isLoading ? (
                            <>
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2" />
                                Scanning Knowledge Graph...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-5 w-5 mr-2" />
                                Detect Conflict of Interest
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default EntitySelectionPanel;
