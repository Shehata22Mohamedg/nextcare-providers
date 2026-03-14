import { useLanguage } from "@/contexts/LanguageContext";
import { ProviderRaw } from "@/lib/excelParser";
import { useMemo, useState, useEffect } from "react";
import { Filter, X, Check } from "lucide-react";
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

const emptyFilters: Filters = {
  governate: [], city: [], specialty: [], providerType: [],
  networkType: [], status: [], mainBranch: [], services: [],
};

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

    const filterKeys: (keyof Filters)[] = [
      "governate", "city", "specialty", "services",
      "providerType", "networkType", "status", "mainBranch",
    ];

    const result: Record<keyof Filters, string[]> = {} as any;

    for (const targetKey of filterKeys) {
      const filtered = providers.filter((p) => {
        for (const otherKey of filterKeys) {
          if (otherKey === targetKey) continue;
          const sel = filters[otherKey];
          if (sel.length > 0 && !sel.includes(getVal(p, otherKey))) return false;
        }
        return true;
      });

      const unique = [...new Set(filtered.map((p) => getVal(p, targetKey)).filter(Boolean))].sort();
      result[targetKey] = unique;
    }

    return result;
  }, [providers, filters, language]);
}

export default function FiltersPanel({ providers, filters, onFilterChange }: FiltersProps) {
  const { language, t } = useLanguage();

  // Draft state: accumulate selections locally, apply on button click
  const [draft, setDraft] = useState<Filters>(filters);

  // Sync draft when external filters change (e.g. clear from parent)
  useEffect(() => {
    setDraft(filters);
  }, [filters]);

  // Cascading options use the DRAFT so users see narrowed options as they pick
  const options = useCascadingOptions(providers, draft, language);

  const hasDraftChanges = JSON.stringify(draft) !== JSON.stringify(filters);
  const hasActiveFilters = Object.values(filters).some((f) => f.length > 0);
  const hasDraftSelections = Object.values(draft).some((f) => f.length > 0);

  const applyFilters = () => onFilterChange(draft);

  const clearAll = () => {
    setDraft(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const updateDraft = (key: keyof Filters) => (val: string[]) =>
    setDraft({ ...draft, [key]: val });

  return (
    <aside className="bg-card rounded-xl border border-border shadow-sm p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold flex items-center gap-2 text-foreground">
          <Filter className="h-4 w-4 text-primary" />
          {t("filters")}
        </h2>
        {(hasActiveFilters || hasDraftSelections) && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-destructive hover:text-destructive gap-1 h-7 text-xs">
            <X className="h-3 w-3" />
            {t("clearFilters")}
          </Button>
        )}
      </div>

      <MultiSelect label={t("governate")} options={options.governate} selected={draft.governate} onChange={updateDraft("governate")} />
      <MultiSelect label={t("city")} options={options.city} selected={draft.city} onChange={updateDraft("city")} />
      <MultiSelect label={t("specialty")} options={options.specialty} selected={draft.specialty} onChange={updateDraft("specialty")} />
      <MultiSelect label={t("services")} options={options.services} selected={draft.services} onChange={updateDraft("services")} />
      <MultiSelect label={t("providerType")} options={options.providerType} selected={draft.providerType} onChange={updateDraft("providerType")} />
      <MultiSelect label={t("networkType")} options={options.networkType} selected={draft.networkType} onChange={updateDraft("networkType")} />
      <MultiSelect label={t("mainBranch")} options={options.mainBranch} selected={draft.mainBranch} onChange={updateDraft("mainBranch")} />
      <MultiSelect label={t("status")} options={options.status} selected={draft.status} onChange={updateDraft("status")} />

      {/* Apply / Clear buttons */}
      <div className="flex gap-2 pt-2 sticky bottom-0 bg-card pb-1">
        <Button
          onClick={applyFilters}
          disabled={!hasDraftChanges}
          size="sm"
          className="flex-1 gap-1.5"
        >
          <Check className="h-3.5 w-3.5" />
          {t("applyFilters")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={clearAll}
          disabled={!hasDraftSelections && !hasActiveFilters}
          className="gap-1.5"
        >
          <X className="h-3.5 w-3.5" />
          {t("clearFilters")}
        </Button>
      </div>
    </aside>
  );
}
