import { useLanguage } from "@/contexts/LanguageContext";
import { ProviderRaw } from "@/lib/excelParser";
import { Phone, MapPin, Stethoscope, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProviderCardProps {
  provider: ProviderRaw;
  onSelect: (p: ProviderRaw) => void;
}

export default function ProviderCard({ provider, onSelect }: ProviderCardProps) {
  const { language, t } = useLanguage();
  const en = language === "en";
  const Arrow = language === "ar" ? ChevronLeft : ChevronRight;

  const name = en ? provider.providerNameEN : provider.providerNameAR;
  const specialty = en ? provider.specialtyEN : provider.specialtyAR;
  const city = en ? provider.cityEN : provider.cityAR;

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-4 space-y-2">
      <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2">
        {name || "—"}
      </h3>

      {specialty && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Stethoscope className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="truncate">{specialty}</span>
        </div>
      )}

      {city && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="truncate">{city}</span>
        </div>
      )}

      {provider.phone && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="truncate" dir="ltr">{provider.phone}</span>
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onSelect(provider)}
        className="w-full mt-2 gap-1 text-xs h-8"
      >
        {t("viewDetails")}
        <Arrow className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
