import { motion } from "framer-motion";
import type { ScanResult } from "@/pages/Index";

const riskConfig = {
  Low: { emoji: "🟢", color: "text-success", bg: "bg-success/10 border-success/20" },
  Medium: { emoji: "🟡", color: "text-warning", bg: "bg-warning/10 border-warning/20" },
  High: { emoji: "🔴", color: "text-destructive", bg: "bg-destructive/10 border-destructive/20" },
};

interface Props {
  result: ScanResult | null;
  isScanning: boolean;
}

export const ScanResults = ({ result, isScanning }: Props) => {
  if (isScanning) {
    return (
      <div className="rounded border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-sm text-muted-foreground">
            Initiating quantum audit…
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 rounded bg-secondary animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!result) return null;
  const cfg = riskConfig[result.risk];

  const items = [
    { label: "TLS Version", value: result.tlsVersion },
    { label: "Cipher Suite", value: result.cipher },
    { label: "Key Exchange", value: result.keyExchange },
    { label: "Assessment", value: `${cfg.emoji} ${result.label}` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded border p-6 ${cfg.bg}`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
          Scan Complete — {result.url}
        </span>
        <span className={`font-mono text-sm font-semibold ${cfg.color}`}>
          {result.risk} Risk
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.label} className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {item.label}
            </p>
            <p className="font-mono text-sm font-medium text-foreground">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
