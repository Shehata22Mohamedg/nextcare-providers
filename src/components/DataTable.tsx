import { useLanguage } from "@/contexts/LanguageContext";
import { ProviderRaw } from "@/lib/excelParser";
import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Columns3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

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

export default function DataTable({ providers, onSelectProvider }: DataTableProps) {
  const { language, t } = useLanguage();
  const [sortKey, setSortKey] = useState<string>("providerName");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [visibleKeys, setVisibleKeys] = useState<string[]>(DEFAULT_VISIBLE);

  const getField = (p: ProviderRaw, key: string): string => {
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
  };

  const sorted = useMemo(() => {
    return [...providers].sort((a, b) => {
      const va = getField(a, sortKey).toLowerCase();
      const vb = getField(b, sortKey).toLowerCase();
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providers, sortKey, sortDir, language]);

  const totalPages = Math.ceil(sorted.length / rowsPerPage);
  const paginated = sorted.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(0);
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

  const PrevIcon = language === "ar" ? ChevronRight : ChevronLeft;
  const NextIcon = language === "ar" ? ChevronLeft : ChevronRight;

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      {/* Column chooser toolbar */}
      <div className="flex items-center justify-end px-4 py-2 border-b border-border bg-secondary/30">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <Columns3 className="h-3.5 w-3.5" />
              {t("columns") || "Columns"}
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

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
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
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-muted-foreground">
                  {t("noResults")}
                </td>
              </tr>
            ) : (
              paginated.map((provider, idx) => (
                <tr
                  key={idx}
                  onClick={() => onSelectProvider(provider)}
                  className="border-t border-border hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 max-w-[250px] truncate">
                      {getField(provider, col.key)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-secondary/50 flex-wrap gap-2">
        <span className="text-sm text-muted-foreground">
          {t("showing")} {sorted.length > 0 ? page * rowsPerPage + 1 : 0}–{Math.min((page + 1) * rowsPerPage, sorted.length)} {t("of")} {sorted.length} {t("providers")}
        </span>

        <div className="flex items-center gap-2">
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(0);
            }}
            className="text-sm border border-border rounded-md bg-card px-2 py-1"
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            <PrevIcon className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-[60px] text-center">
            {page + 1} / {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            <NextIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
