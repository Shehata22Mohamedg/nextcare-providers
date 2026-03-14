import { Copy, Check } from "lucide-react";
import { useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PhoneNumbersProps {
  phone: string;
  compact?: boolean;
}

function splitPhones(raw: string): string[] {
  if (!raw) return [];
  return raw
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
        <div key={idx} className="flex items-center gap-1.5 group">
          <span className={`font-mono ${compact ? "text-xs" : "text-sm"} text-foreground`} dir="ltr">
            {num}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              copy(num, idx);
            }}
            className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-0.5 rounded hover:bg-muted"
            title={t("copyPhone")}
          >
            {copiedIdx === idx ? (
              <Check className="h-3 w-3 text-green-600" />
            ) : (
              <Copy className="h-3 w-3 text-muted-foreground" />
            )}
          </button>
          {copiedIdx === idx && (
            <span className="text-[10px] text-green-600 animate-in fade-in">{t("copied")}</span>
          )}
        </div>
      ))}
    </div>
  );
}
