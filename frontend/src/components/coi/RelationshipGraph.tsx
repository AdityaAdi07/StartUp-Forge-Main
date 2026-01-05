import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RelationshipGraphProps {
  investorName: string;
  targetCompany: string;
  conflictLevel: number;
  conflicts: any[]; // Level 2 data
  level1Companies: string[];
}

interface Node {
  id: string;
  label: string;
  type: "investor" | "founder" | "company" | "target";
  x: number;
  y: number;
}

interface Edge {
  from: string;
  to: string;
  type: "direct" | "indirect";
  label?: string;
}

const RelationshipGraph = ({ investorName, targetCompany, conflictLevel, conflicts, level1Companies }: RelationshipGraphProps) => {
  const [zoom, setZoom] = useState(1);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    // --- Transform Props to Graph Data ---
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    // 1. Investor Node (Root)
    newNodes.push({ id: "investor", label: investorName || "Investor", type: "investor", x: 100, y: 150 });

    // 2. Target Node (End)
    newNodes.push({ id: "target", label: targetCompany || "Target", type: "target", x: 650, y: 150 });

    if (conflictLevel === 1) {
      // Level 1: Investor -> [Company] -> ... Target (Conceptual overlap)
      // For Level 1 we usually show they invest in a competitor.
      // Let's visualize: Investor -> Company (Competitor)
      level1Companies.forEach((company, i) => {
        const nodeId = `comp-${i}`;
        const offsetY = 150 + (i - (level1Companies.length - 1) / 2) * 80; // Spread vertically

        newNodes.push({ id: nodeId, label: company, type: "company", x: 375, y: offsetY });

        // Edges
        newEdges.push({ from: "investor", to: nodeId, type: "direct", label: "Invests In" });
        newEdges.push({ from: nodeId, to: "target", type: "indirect", label: "Sector Overlap" });
      });

    } else if (conflictLevel === 2) {
      // Level 2: Investor -> Parent -> Subsidiary -> Target
      // Or: Investor -> Parent -> Subsidiary (diff) vs Target
      // Based on data: "investedParent" owns "competingSubsidiary"
      conflicts.forEach((c, i) => {
        const parentId = `parent-${i}`;
        const subId = `sub-${i}`;

        // Spread nodes
        const verticalBase = 150;
        const spread = 100;
        const yPos = verticalBase + (i - (conflicts.length - 1) / 2) * spread;

        newNodes.push({ id: parentId, label: c.investedParent, type: "company", x: 280, y: yPos });
        newNodes.push({ id: subId, label: c.competingSubsidiary, type: "company", x: 460, y: yPos });

        newEdges.push({ from: "investor", to: parentId, type: "direct", label: "Invests In" });
        newEdges.push({ from: parentId, to: subId, type: "direct", label: "Owns" });
        newEdges.push({ from: subId, to: "target", type: "indirect", label: "Competes With" });
      });
    } else {
      // No Conflict - Just show discrete nodes
      // Maybe a dotted line or nothing
    }

    // If no conflicts, we might want to show direct link if they are connected? 
    // For now, if no conflict, the graph will just show Investor and Target disconnected.

    setNodes(newNodes);
    setEdges(newEdges);

  }, [investorName, targetCompany, conflictLevel, conflicts, level1Companies]);


  const getNodeColor = (type: string) => {
    const colors: Record<string, string> = {
      investor: "#4F46E5",
      founder: "#9333EA",
      company: "#0EA5E9",
      target: "#EF4444",
    };
    return colors[type] || "#6B7280";
  };

  const getNodeBgColor = (type: string) => {
    const colors: Record<string, string> = {
      investor: "#EEF2FF",
      founder: "#FAF5FF",
      company: "#F0F9FF",
      target: "#FEF2F2",
    };
    return colors[type] || "#F9FAFB";
  };

  const getEdgePath = (from: Node, to: Node) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const cx1 = from.x + dx * 0.4;
    const cy1 = from.y;
    const cx2 = from.x + dx * 0.6;
    const cy2 = to.y;
    return `M ${from.x} ${from.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${to.x} ${to.y}`;
  };

  return (
    <Card className="animate-fade-in bg-white border-border rounded-[2.5rem] shadow-sm overflow-hidden border-none uppercase tracking-widest">
      <CardHeader className="pb-3 p-8">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
              <Network className="h-5 w-5 text-primary" />
            </div>
            Relationship Graph
          </CardTitle>

          <div className="flex items-center gap-2 bg-secondary/30 p-1 rounded-2xl">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-white transition-all"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            >
              <ZoomOut className="h-5 w-5" />
            </Button>
            <span className="text-sm font-bold text-muted-foreground w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-white transition-all"
              onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white transition-all">
              <Maximize2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div id="relationship-graph-container" className="relative border-t border-border/50 bg-[#F8FAFC] overflow-hidden" style={{ height: 400 }}>
          <svg
            id="relationship-graph-svg"
            width="100%"
            height="100%"
            viewBox="0 0 760 300"
            style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
            className="transition-transform duration-200"
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="8"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#9CA3AF" />
              </marker>
              <marker
                id="arrowhead-dashed"
                markerWidth="8"
                markerHeight="6"
                refX="8"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#D1D5DB" />
              </marker>
            </defs>

            {/* Edges */}
            {edges.map((edge, i) => {
              const fromNode = nodes.find(n => n.id === edge.from);
              const toNode = nodes.find(n => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              const midX = (fromNode.x + toNode.x) / 2;
              const midY = (fromNode.y + toNode.y) / 2 - 10;

              return (
                <g key={i}>
                  <path
                    d={getEdgePath(fromNode, toNode)}
                    fill="none"
                    stroke={edge.type === "direct" ? "#9CA3AF" : "#D1D5DB"}
                    strokeWidth={edge.type === "direct" ? 2 : 1.5}
                    strokeDasharray={edge.type === "indirect" ? "6,4" : "none"}
                    markerEnd={edge.type === "direct" ? "url(#arrowhead)" : "url(#arrowhead-dashed)"}
                    className="transition-all duration-200"
                  />
                  {edge.label && (
                    <text
                      x={midX}
                      y={midY}
                      textAnchor="middle"
                      className="fill-muted-foreground text-[10px]"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => (
              <g
                key={node.id}
                className="cursor-pointer transition-transform duration-200"
                style={{
                  transform: hoveredNode === node.id ? "scale(1.05)" : "scale(1)",
                  transformOrigin: `${node.x}px ${node.y}px`,
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={hoveredNode === node.id ? 34 : 30}
                  fill={getNodeBgColor(node.type)}
                  stroke={getNodeColor(node.type)}
                  strokeWidth={2}
                  className="transition-all duration-200"
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={12}
                  fill={getNodeColor(node.type)}
                />
                <text
                  x={node.x}
                  y={node.y + 50}
                  textAnchor="middle"
                  className="fill-foreground text-xs font-medium"
                >
                  {node.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};

export default RelationshipGraph;
