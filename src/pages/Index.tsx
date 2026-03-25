import { useState, useMemo, useCallback } from "react";
import { useProviders } from "@/hooks/useProviders";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSearchIndex } from "@/hooks/useSearchIndex";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useIsMobile } from "@/hooks/use-mobile";
import AppHeader from "@/components/AppHeader";
import FiltersPanel, { Filters } from "@/components/FiltersPanel";
import DataTable from "@/components/DataTable";
import ProviderCard from "@/components/ProviderCard";
import ProviderDetails from "@/components/ProviderDetails";
import MobileFilterDrawer from "@/components/MobileFilterDrawer";
import AppFooter from "@/components/AppFooter";
import { ProviderRaw } from "@/lib/excelParser";
import { Loader2, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const emptyFilters: Filters = {
  governate: [], city: [], specialty: [], providerType: [],
  networkType: [], status: [], mainBranch: [], services: [],
};

export default function Index() {
  const { data: providers, isLoading } = useProviders();
  const { language, t } = useLanguage();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebouncedValue(searchQuery, 300);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [selectedProvider, setSelectedProvider] = useState<ProviderRaw | null>(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [mobilePage, setMobilePage] = useState(1);
  const MOBILE_PAGE_SIZE = 30;

  const searchIndex = useSearchIndex(providers);

  const filtered = useMemo(() => {
    if (!providers) return [];
    const en = language === "en";
    const q = debouncedQuery.toLowerCase();

    return searchIndex
      .filter((entry) => {
        // Free text search via pre-indexed text
        if (q && !(en ? entry.textEN : entry.textAR).includes(q)) return false;

        const p = entry.provider;
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
      })
      .map((e) => e.provider);
  }, [providers, searchIndex, debouncedQuery, filters, language]);

  // Reset mobile page when results change
  useMemo(() => { setMobilePage(1); }, [filtered.length]);

  const activeFilterCount = useMemo(
    () => Object.values(filters).reduce((sum, f) => sum + f.length, 0),
    [filters]
  );

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

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 flex-1 flex gap-6 items-start">
        {/* Desktop sidebar filters */}
        <div className="w-72 shrink-0 hidden lg:block sticky top-[72px]">
          <FiltersPanel
            providers={providers || []}
            filters={filters}
            onFilterChange={setFilters}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-center justify-end">
            {/* Mobile filter button */}
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden gap-2 text-xs"
              onClick={() => setFilterDrawerOpen(true)}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {t("filters")}
              {activeFilterCount > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-[10px] leading-none font-bold">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>

          {/* Mobile: card layout with pagination, Desktop: table */}
          {isMobile ? (
            <div className="space-y-3">
              {filtered.length === 0 ? (
                <p className="text-center py-12 text-muted-foreground">
                  {t("noResults")}
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filtered.slice((mobilePage - 1) * MOBILE_PAGE_SIZE, mobilePage * MOBILE_PAGE_SIZE).map((provider, idx) => (
                      <ProviderCard
                        key={idx}
                        provider={provider}
                        onSelect={setSelectedProvider}
                      />
                    ))}
                  </div>
                  {/* Pagination */}
                  {filtered.length > MOBILE_PAGE_SIZE && (() => {
                    const totalPages = Math.ceil(filtered.length / MOBILE_PAGE_SIZE);
                    return (
                      <div className="flex items-center justify-center gap-2 py-4">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={mobilePage <= 1}
                          onClick={() => { setMobilePage((p) => p - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                          className="text-xs"
                        >
                          {t("previous")}
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          {t("page")} {mobilePage} / {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={mobilePage >= totalPages}
                          onClick={() => { setMobilePage((p) => p + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                          className="text-xs"
                        >
                          {t("next")}
                        </Button>
                      </div>
                    );
                  })()}
                </>
              )}
            </div>
          ) : (
            <DataTable providers={filtered} onSelectProvider={setSelectedProvider} />
          )}
        </div>
      </div>

      <AppFooter />

      {/* Mobile filter drawer */}
      <MobileFilterDrawer
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
        providers={providers || []}
        filters={filters}
        onFilterChange={setFilters}
      />

      {selectedProvider && (
        <ProviderDetails provider={selectedProvider} onClose={() => setSelectedProvider(null)} />
      )}
    </div>
  );
}
