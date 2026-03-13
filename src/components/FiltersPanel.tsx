import { useLanguage } from "@/contexts/LanguageContext";
import { ProviderRaw } from "@/lib/excelParser";
import { useMemo } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Filters {
  governate: string[];
  city: string[];
  specialty: string[];
  providerType: string[];
  networkType: string[];
  status: string[];
  mainBranch: string[];
  services: string[];
}

interface FiltersProps {
  providers: ProviderRaw[];
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

function MultiSelect({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      <div className="max-h-36 overflow-y-auto rounded-md border border-border bg-card p-1.5 space-y-0.5">
        {options.length === 0 ? (
          <p className="text-xs text-muted-foreground p-1">{t("noResults")}</p>
        ) : (
          options.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 text-sm px-2 py-1 rounded hover:bg-secondary cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => {
                  onChange(
                    selected.includes(opt)
                      ? selected.filter((s) => s !== opt)
                      : [...selected, opt]
                  );
                }}
                className="rounded border-border text-primary focus:ring-ring"
              />
              <span className="truncate">{opt || "—"}</span>
            </label>
          ))
        )}
      </div>
    </div>
  );
}

export type { Filters };

export default function FiltersPanel({ providers, filters, onFilterChange }: FiltersProps) {
  const { language, t } = useLanguage();

  const getUnique = (key: keyof ProviderRaw) =>
    [...new Set(providers.map((p) => p[key]).filter(Boolean))].sort();

  const options = useMemo(
    () => ({
      governate: getUnique(language === "en" ? "governateEN" : "governateAR"),
      city: getUnique(language === "en" ? "cityEN" : "cityAR"),
      specialty: getUnique(language === "en" ? "specialtyEN" : "specialtyAR"),
      providerType: getUnique(language === "en" ? "providerTypeEN" : "providerTypeAR"),
      networkType: getUnique("networkType"),
      status: getUnique("status"),
      mainBranch: getUnique("mainBranch"),
      services: getUnique(language === "en" ? "servicesEN" : "servicesAR"),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [providers, language]
  );

  const hasActiveFilters = Object.values(filters).some((f) => f.length > 0);

  const clearAll = () =>
    onFilterChange({
      governate: [],
      city: [],
      specialty: [],
      providerType: [],
      networkType: [],
      status: [],
      mainBranch: [],
      services: [],
    });

  const update = (key: keyof Filters) => (val: string[]) =>
    onFilterChange({ ...filters, [key]: val });

  return (
    <aside className="bg-card rounded-xl border border-border shadow-sm p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold flex items-center gap-2 text-foreground">
          <Filter className="h-4 w-4 text-primary" />
          {t("filters")}
        </h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-destructive hover:text-destructive gap-1 h-7 text-xs">
            <X className="h-3 w-3" />
            {t("clearFilters")}
          </Button>
        )}
      </div>

      <MultiSelect label={t("governate")} options={options.governate} selected={filters.governate} onChange={update("governate")} />
      <MultiSelect label={t("city")} options={options.city} selected={filters.city} onChange={update("city")} />
      <MultiSelect label={t("specialty")} options={options.specialty} selected={filters.specialty} onChange={update("specialty")} />
      <MultiSelect label={t("services")} options={options.services} selected={filters.services} onChange={update("services")} />
      <MultiSelect label={t("providerType")} options={options.providerType} selected={filters.providerType} onChange={update("providerType")} />
      <MultiSelect label={t("networkType")} options={options.networkType} selected={filters.networkType} onChange={update("networkType")} />
      <MultiSelect label={t("mainBranch")} options={options.mainBranch} selected={filters.mainBranch} onChange={update("mainBranch")} />
      <MultiSelect label={t("status")} options={options.status} selected={filters.status} onChange={update("status")} />
    </aside>
  );
}
