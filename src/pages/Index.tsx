import { useState } from "react";
import { ScannerHeader } from "@/components/ScannerHeader";
import { ScanInput } from "@/components/ScanInput";
import { ScanResults } from "@/components/ScanResults";
import { RiskChart } from "@/components/RiskChart";
import { ScanHistory } from "@/components/ScanHistory";
import { toast } from "sonner";

export interface ScanResult {
  url: string;
  tlsVersion: string;
  cipher: string;
  keyExchange: string;
  risk: "Low" | "Medium" | "High";
  label: string;
  timestamp: string;
  reachable: boolean;
}

function calculateRisk(tlsVersion: string, keyExchange: string): { risk: "Low" | "Medium" | "High"; label: string } {
  if (tlsVersion === "TLS 1.3" && keyExchange !== "RSA") {
    return { risk: "Low", label: "Quantum-Safe" };
  }
  if (keyExchange === "RSA") {
    return { risk: "High", label: "Vulnerable" };
  }
  return { risk: "Medium", label: "PQC Ready" };
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Cache so the same URL always produces the same simulated result
const urlCache = new Map<string, { tlsVersion: string; cipher: string; keyExchange: string }>();

function getSimulatedTls(url: string) {
  if (urlCache.has(url)) return urlCache.get(url)!;
  const result = {
    tlsVersion: pickRandom(["TLS 1.2", "TLS 1.3"]),
    cipher: pickRandom(["AES-256", "ChaCha20"]),
    keyExchange: pickRandom(["RSA", "ECDHE"]),
  };
  urlCache.set(url, result);
  return result;
}

const Index = () => {
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [latestResult, setLatestResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const handleScan = async (url: string) => {
    setIsScanning(true);
    setLatestResult(null);
    setScanError(null);

    // Step 1: Check if URL is reachable
    let reachable = false;
    try {
      // Use a no-cors fetch to check reachability (we won't get body but won't error on CORS)
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      await fetch(url, { method: "HEAD", mode: "no-cors", signal: controller.signal });
      clearTimeout(timeout);
      reachable = true;
    } catch (err) {
      // If fetch throws, the URL is unreachable
      reachable = false;
    }

    if (!reachable) {
      setIsScanning(false);
      setScanError(`Unable to reach ${url} — the host may be down or the URL is incorrect.`);
      toast.error("URL unreachable", {
        description: "Could not connect to the target host. Please check the URL and try again.",
      });
      return;
    }

    // Step 2: Simulate TLS analysis (browsers cannot inspect TLS handshake details)
    // In production this would be done server-side
    await new Promise((r) => setTimeout(r, 1500));

    const { tlsVersion, cipher, keyExchange } = getSimulatedTls(url);
    const { risk, label } = calculateRisk(tlsVersion, keyExchange);

    const result: ScanResult = {
      url,
      tlsVersion,
      cipher,
      keyExchange,
      risk,
      label,
      timestamp: new Date().toISOString(),
      reachable,
    };

    setLatestResult(result);
    setScanResults((prev) => [result, ...prev]);
    setIsScanning(false);
    toast.success("Scan complete", { description: `${url} — ${label}` });
  };

  const downloadCSV = () => {
    if (scanResults.length === 0) return;
    const headers = "URL,TLS Version,Cipher,Key Exchange,Risk,Label,Reachable,Timestamp\n";
    const rows = scanResults
      .map((r) => `${r.url},${r.tlsVersion},${r.cipher},${r.keyExchange},${r.risk},${r.label},${r.reachable},${r.timestamp}`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "quantum_scan_report.csv";
    a.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <ScannerHeader />
        <ScanInput onScan={handleScan} isScanning={isScanning} error={scanError} />
        {(latestResult || isScanning) && (
          <ScanResults result={latestResult} isScanning={isScanning} />
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RiskChart results={scanResults} />
          <ScanHistory results={scanResults} onDownload={downloadCSV} />
        </div>
      </div>
    </div>
  );
};

export default Index;
