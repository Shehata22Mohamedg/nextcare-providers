import { useState, useMemo } from "react";
import { useProviders } from "@/hooks/useProviders";
import { useLanguage } from "@/contexts/LanguageContext";
import AppHeader from "@/components/AppHeader";
import FiltersPanel, { Filters } from "@/components/FiltersPanel";
import DataTable from "@/components/DataTable";
import ProviderDetails from "@/components/ProviderDetails";
import { ProviderRaw } from "@/lib/excelParser";
import { Loader2 } from "lucide-react";

const emptyFilters: Filters = {
  governate: [],
  city: [],
  specialty: [],
  providerType: [],
  networkType: [],
  status: [],
  mainBranch: [],
  services: [],
};

export default function Index() {
  const { data: providers, isLoading } = useProviders();
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [selectedProvider, setSelectedProvider] = useState<ProviderRaw | null>(null);

  const filtered = useMemo(() => {
    if (!providers) return [];
    const en = language === "en";
    const q = searchQuery.toLowerCase();

    return providers.filter((p) => {
      // Search
      if (q) {
        const fields = [
          en ? p.providerNameEN : p.providerNameAR,
          en ? p.specialtyEN : p.specialtyAR,
          en ? p.cityEN : p.cityAR,
          en ? p.servicesEN : p.servicesAR,
        ];
        if (!fields.some((f) => f.toLowerCase().includes(q))) return false;
      }

      // Filters
      const check = (sel: string[], val: string) => sel.length === 0 || sel.includes(val);
      if (!check(filters.governate, en ? p.governateEN : p.governateAR)) return false;
      if (!check(filters.city, en ? p.cityEN : p.cityAR)) return false;
      if (!check(filters.specialty, en ? p.specialtyEN : p.specialtyAR)) return false;
      if (!check(filters.services, en ? p.servicesEN : p.servicesAR)) return false;
      if (!check(filters.providerType, en ? p.providerTypeEN : p.providerTypeAR)) return false;
      if (!check(filters.networkType, p.networkType)) return false;
      if (!check(filters.status, p.status)) return false;
      if (!check(filters.mainBranch, p.mainBranch)) return false;

      return true;
    });
  }, [providers, searchQuery, filters, language]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="container mx-auto px-4 py-6 flex-1 flex gap-6 items-start">
        <div className="w-72 shrink-0 hidden lg:block sticky top-6">
          <FiltersPanel
            providers={providers || []}
            filters={filters}
            onFilterChange={setFilters}
          />
        </div>

        <div className="flex-1 min-w-0 space-y-4">
          <p className="text-sm text-muted-foreground">
            {filtered.length} {t("providers")}
          </p>
          <DataTable providers={filtered} onSelectProvider={setSelectedProvider} />
        </div>
      </div>

      {selectedProvider && (
        <ProviderDetails provider={selectedProvider} onClose={() => setSelectedProvider(null)} />
      )}
    </div>
  );
}
