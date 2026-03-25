import { Mail, Phone, Linkedin, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const links = [
  { icon: Phone, href: "tel:+201207596261", label: "+201207596261" },
  { icon: Mail, href: "mailto:shehata22mohamed@gmail.com", label: "shehata22mohamed@gmail.com" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/shehata-mekawy/", label: "LinkedIn" },
  { icon: Globe, href: "https://shehata-mekawy-portfolio.vercel.app/", label: "Portfolio" },
];

export default function AppFooter() {
  const { language } = useLanguage();
  const fixedClass = language === "en" ? "fixed bottom-0 left-0 right-0 z-30 w-full" : "";
  return (
    <footer dir="ltr" className={`${fixedClass} bg-primary text-primary-foreground/70 py-3`}>
      <div className="container mx-auto px-3 sm:px-4 flex flex-col items-center gap-2">
        <p className="text-xs font-semibold text-primary-foreground/90">
          Developed by Shehata Mekawy
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
          {links.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary-foreground transition-colors"
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
