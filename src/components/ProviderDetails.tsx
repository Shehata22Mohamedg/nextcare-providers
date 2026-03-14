import { useLanguage } from "@/contexts/LanguageContext";
import { ProviderRaw } from "@/lib/excelParser";
import { X, Phone, Mail, MapPin, Building, Stethoscope, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import PhoneNumbers from "@/components/PhoneNumbers";

interface ProviderDetailsProps {
  provider: ProviderRaw;
  onClose: () => void;
}

export default function ProviderDetails({ provider, onClose }: ProviderDetailsProps) {
  const { language, t } = useLanguage();
  const en = language === "en";

  const fields = [
    { label: t("providerName"), value: en ? provider.providerNameEN : provider.providerNameAR, icon: Building },
    { label: t("providerType"), value: en ? provider.providerTypeEN : provider.providerTypeAR, icon: Building },
    { label: t("specialty"), value: en ? provider.specialtyEN : provider.specialtyAR, icon: Stethoscope },
    { label: t("services"), value: en ? provider.servicesEN : provider.servicesAR, icon: Activity },
    { label: t("address"), value: en ? provider.addressEN : provider.addressAR, icon: MapPin },
    { label: t("city"), value: en ? provider.cityEN : provider.cityAR, icon: MapPin },
    { label: t("governate"), value: en ? provider.governateEN : provider.governateAR, icon: MapPin },
    { label: t("email"), value: provider.email, icon: Mail },
    { label: t("networkType"), value: provider.networkType },
    { label: t("mainBranch"), value: provider.mainBranch },
    { label: t("status"), value: provider.status },
  ];

  return (
    <div className="fixed inset-0 bg-foreground/40 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div
        className="bg-card rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border bg-primary/5 rounded-t-2xl sticky top-0 z-10">
          <h2 className="font-bold text-base sm:text-lg text-foreground">{t("providerDetails")}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 sm:p-5 space-y-3">
          {fields.map(
            (f) =>
              f.value && (
                <div key={f.label} className="flex gap-3 items-start">
                  {f.icon && <f.icon className="h-4 w-4 mt-1 text-primary shrink-0" />}
                  {!f.icon && <div className="w-4" />}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{f.label}</p>
                    <p className="text-sm text-foreground break-words">{f.value}</p>
                  </div>
                </div>
              )
          )}

          {/* Phone numbers with copy */}
          {provider.phone && (
            <div className="flex gap-3 items-start">
              <Phone className="h-4 w-4 mt-1 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t("phone")}</p>
                <PhoneNumbers phone={provider.phone} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
