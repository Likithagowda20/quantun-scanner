import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { ScanResult } from "@/pages/Index";

const riskBadge: Record<string, string> = {
  Low: "bg-success/10 text-success",
  Medium: "bg-warning/10 text-warning",
  High: "bg-destructive/10 text-destructive",
};

interface Props {
  results: ScanResult[];
  onDownload: () => void;
}

export const ScanHistory = ({ results, onDownload }: Props) => (
  <div className="rounded border border-border bg-card p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
        Scan History
      </h2>
      <Button
        variant="outline"
        size="sm"
        onClick={onDownload}
        disabled={results.length === 0}
        className="gap-2 text-xs font-mono"
      >
        <Download className="h-3.5 w-3.5" />
        Download CSV
      </Button>
    </div>

    {results.length === 0 ? (
      <p className="text-sm text-muted-foreground font-mono py-8 text-center">
        No scans recorded yet. Enter a URL above to begin.
      </p>
    ) : (
      <div className="overflow-auto max-h-64">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 pr-3">URL</th>
              <th className="text-left py-2 pr-3">TLS</th>
              <th className="text-left py-2 pr-3">Risk</th>
              <th className="text-left py-2">Label</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i} className="border-b border-border/50">
                <td className="py-2 pr-3 text-foreground truncate max-w-[160px]">{r.url}</td>
                <td className="py-2 pr-3 text-muted-foreground">{r.tlsVersion}</td>
                <td className="py-2 pr-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${riskBadge[r.risk]}`}>
                    {r.risk}
                  </span>
                </td>
                <td className="py-2 text-muted-foreground">{r.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);
