import { useLanguage } from "@/contexts/LanguageContext";
import FiltersPanel, { Filters } from "@/components/FiltersPanel";
import { ProviderRaw } from "@/lib/excelParser";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

interface MobileFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providers: ProviderRaw[];
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export default function MobileFilterDrawer({
  open,
  onOpenChange,
  providers,
  filters,
  onFilterChange,
}: MobileFilterDrawerProps) {
  const { t } = useLanguage();

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DrawerHeader className="pb-2">
          <DrawerTitle>{t("filters")}</DrawerTitle>
          <DrawerDescription className="sr-only">
            {t("filters")}
          </DrawerDescription>
        </DrawerHeader>
        <div
          className="overflow-y-auto px-4 pb-6"
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <FiltersPanel
            providers={providers}
            filters={filters}
            onFilterChange={(f) => {
              onFilterChange(f);
              onOpenChange(false);
            }}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}