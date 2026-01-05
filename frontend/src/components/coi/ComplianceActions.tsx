import { Download, Share2, Database, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface ComplianceActionsProps {
  reportData: any;
  fileNamePrefix: string;
}

const ComplianceActions = ({ reportData, fileNamePrefix }: ComplianceActionsProps) => {

  const handleDownloadPDF = () => {
    toast.success("Generating PDF Report...", {
      description: "Your COI report will be ready for download shortly.",
    });
    setTimeout(() => {
      window.print();
    }, 800);
  };

  const handleExportGraph = () => {
    const svgElement = document.getElementById('relationship-graph-svg');
    if (!svgElement) {
      toast.error("Graph Error", { description: "Could not find graph element." });
      return;
    }

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgElement);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileNamePrefix}_graph.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast.success("Export Successful", {
      description: "Graph exported as SVG.",
    });
  };

  const handleViewRawData = () => {
    const jsonString = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileNamePrefix}_data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast.info("Raw Data Downloaded", {
      description: "Relationship data saved as JSON.",
    });
  };

  return (
    <Card className="animate-fade-in bg-white border-border rounded-[2.5rem] shadow-sm overflow-hidden p-4">
      <CardHeader className="pb-3 p-6">
        <CardTitle className="flex items-center gap-3 text-xl font-bold">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
            <Share2 className="h-5 w-5 text-primary" />
          </div>
          Compliance Actions
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <div className="flex flex-wrap gap-4">
          <Button
            variant="default"
            onClick={handleDownloadPDF}
            className="flex-1 min-w-[200px] h-14 rounded-2xl font-bold text-sm shadow-md hover:scale-[1.02] transition-transform"
          >
            <Download className="h-5 w-5 mr-3" />
            Download COI Report (PDF)
          </Button>

          <Button
            variant="outline"
            onClick={handleExportGraph}
            className="flex-1 min-w-[200px] h-14 rounded-2xl font-bold text-sm border-2 border-primary/20 text-primary hover:bg-primary/5 hover:scale-[1.02] transition-transform"
          >
            <Share2 className="h-5 w-5 mr-3" />
            Export Relationship Graph
          </Button>

          <Button
            variant="secondary"
            onClick={handleViewRawData}
            className="flex-1 min-w-[200px] h-14 rounded-2xl font-bold text-sm bg-secondary/50 text-foreground hover:bg-secondary hover:scale-[1.02] transition-transform"
          >
            <FileJson className="h-5 w-5 mr-3" />
            View Raw Relationship Data
          </Button>
        </div>

        <div className="mt-6 flex items-center gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-border/50">
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
