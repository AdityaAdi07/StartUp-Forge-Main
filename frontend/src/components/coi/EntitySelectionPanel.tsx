import { useState } from "react";
import { Search, Building2, Users, User, Target, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/components/ui/utils";

interface EntitySelectionPanelProps {
  onRunCheck: (investor: string, target: string) => void;
  isLoading?: boolean;
  preselectedInvestor?: string;
  preselectedTarget?: string;
  compact?: boolean;
  className?: string;
}

const EntitySelectionPanel = ({
  onRunCheck,
  isLoading,
  preselectedInvestor,
  preselectedTarget,
  compact,
  className
}: EntitySelectionPanelProps) => {
  const [entityType, setEntityType] = useState<string>(preselectedInvestor ? "investor" : "");
  const [selectedEntity, setSelectedEntity] = useState<string>(preselectedInvestor || "");
  const [targetCompany, setTargetCompany] = useState<string>(preselectedTarget || "");

  const entityTypeIcons: Record<string, React.ReactNode> = {
    investor: <Users className="h-4 w-4" />,
    founder: <User className="h-4 w-4" />,
    company: <Building2 className="h-4 w-4" />,
  };

  const sampleEntities: Record<string, string[]> = {
    investor: ["Eyal Gura", "Demo Investor", "Sequoia Capital", "Andreessen Horowitz", "Accel Partners"],
    founder: ["John Smith", "Emily Johnson", "Michael Chen", "Sarah Williams"],
    company: ["TechCorp Inc.", "StartupXYZ", "InnovateCo", "DataDriven LLC"],
  };

  const targetCompanies = ["Kapital", "Acme Targets Inc.", "Acme Technologies", "GlobalFinance Corp", "HealthTech Solutions"];

  const handleRunCheck = () => {
    if (selectedEntity && targetCompany) {
      onRunCheck(selectedEntity, targetCompany);
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center gap-3 mb-6 px-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 shadow-md shadow-slate-900/20">
          <Search className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-xl font-extrabold text-slate-900"><b>Entity Selection</b></h3>
      </div>

      <div className="flex-1 flex flex-col justify-between gap-8 px-2 pb-2">
        <div className={`grid gap-7 ${compact ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
          <div className="space-y-3 group">
            <label className="text-s font-bold text-slate-500 uppercase tracking-wider ml-2 group-hover:text-primary transition-colors">
              <b>Entity Type</b>
            </label>
            <Select value={entityType} onValueChange={setEntityType}>
              <SelectTrigger className="h-14 bg-slate-50 border-slate-200 rounded-3xl px-5 font-bold text-slate-900 shadow-sm focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 hover:border-slate-300 transition-all">
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-3xl shadow-xl border-slate-100 p-2">
                <SelectItem value="investor" className="rounded-xl focus:bg-slate-50 my-1 font-bold text-slate-700 cursor-pointer px-4 py-3">
                  <span className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-slate-400" />
                    <b>Investor</b>
                  </span>
                </SelectItem>
                <SelectItem value="founder" className="rounded-xl focus:bg-slate-50 my-1 font-bold text-slate-700 cursor-pointer px-4 py-3">
                  <span className="flex items-center gap-3">
                    <User className="h-4 w-4 text-slate-400" />
                    <b>Founder</b>
                  </span>
                </SelectItem>
                <SelectItem value="company" className="rounded-xl focus:bg-slate-50 my-1 font-bold text-slate-700 cursor-pointer px-4 py-3">
                  <span className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-slate-400" />
                    <b>Company</b>
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 group">
            <label className="text-s font-bold text-slate-500 uppercase tracking-wider ml-2 group-hover:text-primary transition-colors">
              <b>Select Entity</b>
            </label>
            <Select
              value={selectedEntity}
              onValueChange={setSelectedEntity}
              disabled={!entityType}
            >
              <SelectTrigger className="h-14 bg-slate-50 border-slate-200 rounded-3xl px-5 font-bold text-slate-900 shadow-sm focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 hover:border-slate-300 transition-all disabled:opacity-50 disabled:bg-slate-50">
                <SelectValue placeholder={entityType ? "Search entities..." : "Select type first"} />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-3xl shadow-xl border-slate-100 p-2">
                {entityType && sampleEntities[entityType]?.map((entity) => (
                  <SelectItem key={entity} value={entity} className="rounded-xl focus:bg-slate-50 my-1 font-bold text-slate-700 cursor-pointer px-4 py-3">
                    <span className="flex items-center gap-3">
                      {entityTypeIcons[entityType]}
                      {entity}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 group">
            <label className="text-s font-bold text-slate-500 uppercase tracking-wider ml-2 group-hover:text-primary transition-colors">
              <b>Target Company</b> <span className="opacity-50 font-medium normal-case tracking-normal ml-1 text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-400">(Optional)</span>
            </label>
            <Select value={targetCompany} onValueChange={setTargetCompany}>
              <SelectTrigger className="h-14 bg-slate-50 border-slate-200 rounded-3xl px-5 font-bold text-slate-900 shadow-sm focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 hover:border-slate-300 transition-all">
                <SelectValue placeholder="Select target..." />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-3xl shadow-xl border-slate-100 p-2">
                {targetCompanies.map((company) => (
                  <SelectItem key={company} value={company} className="rounded-xl focus:bg-slate-50 my-1 font-bold text-slate-700 cursor-pointer px-4 py-3">
                    <span className="flex items-center gap-3">
                      <Target className="h-4 w-4 text-slate-400" />
                      {company}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-4">
          <Button
            variant="default"
            size="lg"
            onClick={handleRunCheck}
            disabled={!entityType || !selectedEntity || !targetCompany || isLoading}
            className="h-16 w-full rounded-full font-bold text-lg shadow-lg shadow-slate-900/20 hover:scale-[1.01] active:scale-[0.99] transition-all bg-slate-900 hover:bg-slate-800 text-white border-2 border-transparent hover:border-slate-700"
          >
            {isLoading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-500 border-t-white mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-20 w-20 mr-2 text-indigo-400" />
                <b>Run Conflict Check</b>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default EntitySelectionPanel;
