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
    <header className="bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center gap-4 flex-wrap">
        <h1 className="text-xl font-bold tracking-tight whitespace-nowrap">
          {t("appTitle")}
        </h1>

        <div className="flex-1 min-w-[200px] max-w-xl relative">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-primary-foreground/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("search")}
            className="w-full rounded-lg bg-primary-foreground/15 backdrop-blur-sm border border-primary-foreground/20 py-2 ps-10 pe-4 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleLanguage}
          className="border-primary-foreground/30 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 hover:text-primary-foreground gap-2"
        >
          <Globe className="h-4 w-4" />
          {language === "en" ? "العربية" : "English"}
        </Button>
      </div>
    </header>
  );
}
