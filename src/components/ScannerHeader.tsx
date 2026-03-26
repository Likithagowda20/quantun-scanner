import { Shield } from "lucide-react";

export const ScannerHeader = () => (
  <div className="space-y-2">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded bg-primary/10 border border-primary/20">
        <Shield className="h-6 w-6 text-primary" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Quantum-Proof Systems Scanner
      </h1>
    </div>
    <p className="text-muted-foreground text-sm max-w-2xl">
      Post-quantum cryptographic vulnerability assessment tool. Analyze TLS configurations,
      cipher suites, and key exchange protocols to identify quantum-computing threats
      across your banking infrastructure.
    </p>
    <div className="flex items-center gap-2 pt-1">
      <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
      <span className="text-xs font-mono text-primary uppercase tracking-widest">
        System Ready
      </span>
    </div>
  </div>
);
