import { Copy, Check } from "lucide-react";
import { useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PhoneNumbersProps {
  phone: string;
  compact?: boolean;
}

function splitPhones(raw: unknown): string[] {
  if (raw == null) return [];
  const str = String(raw);
  if (!str.trim()) return [];
  return str
    .split(/[\/\-]/)
    .map((n) => n.trim())
    .filter(Boolean);
}

export default function PhoneNumbers({ phone, compact }: PhoneNumbersProps) {
  const numbers = splitPhones(phone);
  const { t } = useLanguage();
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const copy = useCallback((num: string, idx: number) => {
    navigator.clipboard.writeText(num).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    });
  }, []);

  if (numbers.length === 0) return null;

  return (
    <div className={compact ? "space-y-1" : "space-y-1.5"}>
      {numbers.map((num, idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          <span className={`font-mono ${compact ? "text-xs" : "text-sm"} text-foreground`} dir="ltr">
            {num}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              copy(num, idx);
            }}
            className="p-1 rounded hover:bg-muted transition-colors"
            title={t("copyPhone")}
          >
            {copiedIdx === idx ? (
              <Check className="h-3.5 w-3.5 text-accent" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>
          {copiedIdx === idx && (
            <span className="text-[10px] text-accent animate-in fade-in">{t("copied")}</span>
          )}
        </div>
      ))}
    </div>
  );
}