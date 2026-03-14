import { useLanguage } from "@/contexts/LanguageContext";
import { ProviderRaw } from "@/lib/excelParser";
import { useState, useMemo, useRef, useCallback } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Columns3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { useVirtualizer } from "@tanstack/react-virtual";

interface DataTableProps {
  providers: ProviderRaw[];
  onSelectProvider: (provider: ProviderRaw) => void;
}

type SortDir = "asc" | "desc";

const ALL_COLUMNS = [
  { key: "providerName", labelKey: "providerName" },
  { key: "specialty", labelKey: "specialty" },
  { key: "providerType", labelKey: "providerType" },
  { key: "city", labelKey: "city" },
  { key: "governate", labelKey: "governate" },
  { key: "phone", labelKey: "phone" },
  { key: "address", labelKey: "address" },
  { key: "services", labelKey: "services" },
  { key: "networkType", labelKey: "networkType" },
  { key: "mainBranch", labelKey: "mainBranch" },
  { key: "status", labelKey: "status" },
  { key: "email", labelKey: "email" },
] as const;

const DEFAULT_VISIBLE = ["providerName", "specialty", "providerType", "city", "governate", "phone"];

const ROW_HEIGHT = 44;

export default function DataTable({ providers, onSelectProvider }: DataTableProps) {
  const { language, t } = useLanguage();
  const [sortKey, setSortKey] = useState<string>("providerName");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [visibleKeys, setVisibleKeys] = useState<string[]>(DEFAULT_VISIBLE);
  const parentRef = useRef<HTMLDivElement>(null);

  const getField = useCallback((p: ProviderRaw, key: string): string => {
    const en = language === "en";
    const map: Record<string, string> = {
      providerName: en ? p.providerNameEN : p.providerNameAR,
      specialty: en ? p.specialtyEN : p.specialtyAR,
      providerType: en ? p.providerTypeEN : p.providerTypeAR,
      city: en ? p.cityEN : p.cityAR,
      governate: en ? p.governateEN : p.governateAR,
      phone: p.phone,
      address: en ? p.addressEN : p.addressAR,
      services: en ? p.servicesEN : p.servicesAR,
      networkType: p.networkType,
      mainBranch: p.mainBranch,
      status: p.status,
      email: p.email,
    };
    return map[key] || "";
  }, [language]);

  const sorted = useMemo(() => {
    return [...providers].sort((a, b) => {
      const va = getField(a, sortKey).toLowerCase();
      const vb = getField(b, sortKey).toLowerCase();
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
  }, [providers, sortKey, sortDir, getField]);

  const virtualizer = useVirtualizer({
    count: sorted.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 20,
  });

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const columns = ALL_COLUMNS.filter((c) => visibleKeys.includes(c.key));

  const toggleColumn = (key: string) => {
    setVisibleKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const SortIcon = ({ col }: { col: string }) => {
    if (sortKey !== col) return null;
    return sortDir === "asc" ? (
      <ChevronUp className="h-3 w-3 inline" />
    ) : (
      <ChevronDown className="h-3 w-3 inline" />
    );
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      {/* Column chooser toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/30">
        <span className="text-sm text-muted-foreground">
          {sorted.length} {t("providers")}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <Columns3 className="h-3.5 w-3.5" />
              {t("columns")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {ALL_COLUMNS.map((col) => (
              <DropdownMenuCheckboxItem
                key={col.key}
                checked={visibleKeys.includes(col.key)}
                onCheckedChange={() => toggleColumn(col.key)}
              >
                {t(col.labelKey)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Virtualized scrollable area */}
      <div ref={parentRef} className="overflow-auto max-h-[70vh]">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="bg-secondary">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-4 py-3 text-start font-semibold text-secondary-foreground cursor-pointer hover:bg-muted select-none whitespace-nowrap"
                >
                  {t(col.labelKey)} <SortIcon col={col.key} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-muted-foreground">
                  {t("noResults")}
                </td>
              </tr>
            ) : (
              <>
                {virtualizer.getVirtualItems().length > 0 && (
                  <tr style={{ height: virtualizer.getVirtualItems()[0].start }}>
                    <td colSpan={columns.length} />
                  </tr>
                )}
                {virtualizer.getVirtualItems().map((virtualRow) => {
                  const provider = sorted[virtualRow.index];
                  return (
                    <tr
                      key={virtualRow.index}
                      onClick={() => onSelectProvider(provider)}
                      className="border-t border-border hover:bg-muted/50 cursor-pointer transition-colors"
                      style={{ height: ROW_HEIGHT }}
                    >
                      {columns.map((col) => (
                        <td key={col.key} className="px-4 py-2 max-w-[250px] truncate">
                          {getField(provider, col.key)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
                {virtualizer.getVirtualItems().length > 0 && (
                  <tr
                    style={{
                      height:
                        virtualizer.getTotalSize() -
                        (virtualizer.getVirtualItems().at(-1)?.end ?? 0),
                    }}
                  >
                    <td colSpan={columns.length} />
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
