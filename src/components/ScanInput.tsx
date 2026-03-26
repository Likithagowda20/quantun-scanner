import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crosshair, Loader2 } from "lucide-react";

interface ScanInputProps {
  onScan: (url: string) => void;
  isScanning: boolean;
  error?: string | null;
}

/**
 * Normalizes user input to a proper URL.
 * Accepts: https://example.com, http://example.com, www.example.com, example.com
 */
function normalizeUrl(input: string): string | null {
  let raw = input.trim();
  if (!raw) return null;

  // If user typed www.something or bare domain, prepend https://
  if (!/^https?:\/\//i.test(raw)) {
    raw = `https://${raw}`;
  }

  try {
    const parsed = new URL(raw);
    // Must be http or https
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    // Hostname must have at least one dot (e.g. example.com)
    if (!parsed.hostname.includes(".")) return null;
    // Basic TLD check – at least 2 chars after last dot
    const parts = parsed.hostname.split(".");
    if (parts[parts.length - 1].length < 2) return null;
    return parsed.href;
  } catch {
    return null;
  }
}

export { normalizeUrl };

export const ScanInput = ({ onScan, isScanning, error }: ScanInputProps) => {
  const [url, setUrl] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const normalized = normalizeUrl(url);
    if (!normalized) {
      setLocalError(
        "Please enter a valid URL (e.g. www.example.com or https://example.com)"
      );
      return;
    }
    onScan(normalized);
  };

  const displayError = error || localError;

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          placeholder="www.example.com or https://example-bank.com"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setLocalError(null);
          }}
          className={`flex-1 bg-card border-border font-mono text-sm h-11 placeholder:text-muted-foreground/50 ${
            displayError ? "border-destructive" : ""
          }`}
          disabled={isScanning}
        />
        <Button
          type="submit"
          disabled={isScanning || !url.trim()}
          className="h-11 px-6 bg-primary text-primary-foreground font-semibold text-sm tracking-wide hover:bg-primary/90 gap-2"
        >
          {isScanning ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Crosshair className="h-4 w-4" />
          )}
          {isScanning ? "Scanning…" : "Scan Now"}
        </Button>
      </form>
      {displayError && (
        <p className="text-destructive text-xs font-mono">{displayError}</p>
      )}
    </div>
  );
};
