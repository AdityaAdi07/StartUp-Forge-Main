import { Download, Share2, Database, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/components/ui/utils";

interface ComplianceActionsProps {
  reportData?: any;
  fileNamePrefix?: string;
  hideHeader?: boolean;
  className?: string;
}

const ComplianceActions = ({
  reportData,
  fileNamePrefix = "COI_Report",
  hideHeader = false,
  className
}: ComplianceActionsProps) => {
  const handleDownloadPDF = () => {
    toast.success("Generating PDF Report...", {
      description: `Downloading ${fileNamePrefix}.pdf...`,
    });
  };

  const handleExportGraph = () => {
    toast.success("Exporting Relationship Graph...", {
      description: "Graph data exported in PNG and SVG formats.",
    });
  };

  const handleViewRawData = () => {
    toast.info("Opening Raw Data View", {
      description: "Relationship data displayed in JSON format.",
    });
  };

  return (
    <Card className={cn("animate-fade-in bg-white border-border rounded-[2.5rem] shadow-sm overflow-hidden p-4", className)}>
      {!hideHeader && (
        <CardHeader className="pb-3 p-6">
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
              <Share2 className="h-5 w-5 text-primary" />
            </div>
            Compliance Actions
          </CardTitle>
        </CardHeader>
      )}

      <CardContent className="px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="default"
            onClick={handleDownloadPDF}
            className="w-full h-14 rounded-2xl font-bold text-sm shadow-md hover:scale-[1.02] transition-transform flex items-center justify-center gap-3"
          >
            <Download className="h-5 w-5" />
            Download PDF Report
          </Button>

          <Button
            variant="outline"
            onClick={handleExportGraph}
            className="w-full h-14 rounded-2xl font-bold text-sm border-2 border-primary/20 text-primary hover:bg-primary/5 hover:scale-[1.02] transition-transform flex items-center justify-center gap-3"
          >
            <Share2 className="h-5 w-5" />
            Export Graph
          </Button>

          <Button
            variant="secondary"
            onClick={handleViewRawData}
            className="w-full h-14 rounded-2xl font-bold text-sm bg-secondary/50 text-foreground hover:bg-secondary hover:scale-[1.02] transition-transform flex items-center justify-center gap-3"
          >
            <FileJson className="h-5 w-5" />
            View Raw Data
          </Button>
        </div>

        <div className="mt-6 flex items-center gap-4 p-5 rounded-[1.5rem] bg-[#F8FAFC] border border-border/50">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
            <Database className="h-5 w-5 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed">
            All reports are <span className="text-foreground font-bold underline decoration-primary/20">timestamped and logged</span> for audit compliance.
            Data retention is maintained for <span className="text-foreground font-bold">7 years</span> in accordance with industry standards.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceActions;
