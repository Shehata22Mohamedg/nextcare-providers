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
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    const q = search.toLowerCase();
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, search]);

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
        {selected.length > 0 && (
          <span className="ms-1 text-primary">({selected.length})</span>
        )}
      </label>
      <div className="rounded-md border border-border bg-card overflow-hidden">
        <div className="px-1.5 pt-1.5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search")}
            className="w-full rounded border border-border bg-background px-2 py-1 text-xs focus:outline-none focus:border-primary placeholder:text-muted-foreground"
          />
        </div>
        <div className="max-h-36 overflow-y-auto p-1.5 space-y-0.5">
          {filteredOptions.length === 0 ? (
            <p className="text-xs text-muted-foreground p-1">{t("noResults")}</p>
          ) : (
            filteredOptions.map((opt) => (
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
    </div>
  );
}

export type { Filters };

/**
 * Compute available options for each filter based on currently selected values
 * of ALL OTHER filters (cascading). This way, selecting a governate narrows
 * city/specialty/etc. options to only those that exist within that governate.
 */
function useCascadingOptions(providers: ProviderRaw[], filters: Filters, language: "en" | "ar") {
  return useMemo(() => {
    const en = language === "en";

    const getVal = (p: ProviderRaw, key: keyof Filters): string => {
      switch (key) {
        case "governate": return en ? p.governateEN : p.governateAR;
        case "city": return en ? p.cityEN : p.cityAR;
        case "specialty": return en ? p.specialtyEN : p.specialtyAR;
        case "services": return en ? p.servicesEN : p.servicesAR;
        case "providerType": return en ? p.providerTypeEN : p.providerTypeAR;
        case "networkType": return p.networkType;
        case "status": return p.status;
        case "mainBranch": return p.mainBranch;
      }
    };

    // For each filter key, compute available options by applying all OTHER filters
    const filterKeys: (keyof Filters)[] = [
      "governate", "city", "specialty", "services",
      "providerType", "networkType", "status", "mainBranch",
    ];

    const result: Record<keyof Filters, string[]> = {} as any;

    for (const targetKey of filterKeys) {
      // Filter providers by all filters EXCEPT the targetKey
      const filtered = providers.filter((p) => {
        for (const otherKey of filterKeys) {
          if (otherKey === targetKey) continue;
          const sel = filters[otherKey];
          if (sel.length > 0 && !sel.includes(getVal(p, otherKey))) return false;
        }
        return true;
      });

      // Collect unique values for targetKey from these filtered providers
      const unique = [...new Set(filtered.map((p) => getVal(p, targetKey)).filter(Boolean))].sort();
      result[targetKey] = unique;
    }

    return result;
  }, [providers, filters, language]);
}

export default function FiltersPanel({ providers, filters, onFilterChange }: FiltersProps) {
  const { language, t } = useLanguage();

  const options = useCascadingOptions(providers, filters, language);

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
