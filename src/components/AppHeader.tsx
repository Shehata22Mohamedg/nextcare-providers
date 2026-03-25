import { useLanguage } from "@/contexts/LanguageContext";
import { Search, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function AppHeader({ searchQuery, onSearchChange }: AppHeaderProps) {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-4 flex flex-col gap-1.5">
        <div className="flex items-center gap-2 sm:gap-3">
          <h1 className="text-sm sm:text-lg font-bold tracking-tight whitespace-nowrap shrink-0">
            {t("appTitle")}
          </h1>

          <div className="flex-1 min-w-0 relative">
            <Search className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-primary-foreground/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t("search")}
              className="w-full rounded-lg bg-primary-foreground/15 backdrop-blur-sm border border-primary-foreground/20 py-1.5 ps-9 pe-3 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="border-primary-foreground/30 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 hover:text-primary-foreground gap-1 text-xs shrink-0"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{language === "en" ? "العربية" : "English"}</span>
            <span className="sm:hidden">{language === "en" ? "ع" : "EN"}</span>
          </Button>
        </div>

        <p className="text-[10px] text-primary-foreground/40 text-center">
          Developed by{" "}
          <a href="https://shehata-mekawy-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-foreground/60">
            Shehata Mekawy
          </a>
        </p>
      </div>
    </header>
  );
}
