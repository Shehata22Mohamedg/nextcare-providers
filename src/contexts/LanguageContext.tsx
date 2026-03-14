import React, { createContext, useContext, useState, useCallback } from "react";

export type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const translations: Record<string, Record<Language, string>> = {
  appTitle: { en: "Provider Directory", ar: "دليل مقدمي الخدمات" },
  search: { en: "Search providers...", ar: "...بحث عن مقدمي الخدمات" },
  filters: { en: "Filters", ar: "الفلاتر" },
  clearFilters: { en: "Clear Filters", ar: "مسح الفلاتر" },
  providerName: { en: "Provider Name", ar: "اسم مقدم الخدمة" },
  specialty: { en: "Specialty", ar: "التخصص" },
  services: { en: "Services", ar: "الخدمات المقدمة" },
  address: { en: "Address", ar: "العنوان" },
  city: { en: "City", ar: "المدينة" },
  governate: { en: "Governate", ar: "المحافظة" },
  phone: { en: "Phone", ar: "التليفون" },
  email: { en: "Email", ar: "البريد الإلكتروني" },
  providerType: { en: "Provider Type", ar: "نوع مقدم الخدمة" },
  networkType: { en: "Network Type", ar: "نوع الشبكة" },
  mainBranch: { en: "Main / Branch", ar: "رئيسي / فرع" },
  status: { en: "Status", ar: "الحالة" },
  providerDetails: { en: "Provider Details", ar: "تفاصيل مقدم الخدمة" },
  results: { en: "Results", ar: "النتائج" },
  of: { en: "of", ar: "من" },
  showing: { en: "Showing", ar: "عرض" },
  providers: { en: "providers", ar: "مقدم خدمة" },
  noResults: { en: "No providers found", ar: "لا يوجد مقدمي خدمات" },
  loading: { en: "Loading data...", ar: "...جاري تحميل البيانات" },
  all: { en: "All", ar: "الكل" },
  close: { en: "Close", ar: "إغلاق" },
  previous: { en: "Previous", ar: "السابق" },
  next: { en: "Next", ar: "التالي" },
  page: { en: "Page", ar: "صفحة" },
  rowsPerPage: { en: "Rows per page", ar: "صفوف في الصفحة" },
  columns: { en: "Columns", ar: "الأعمدة" },
  viewDetails: { en: "View Details", ar: "عرض التفاصيل" },
  copied: { en: "Phone number copied!", ar: "!تم نسخ رقم الهاتف" },
  copyPhone: { en: "Copy", ar: "نسخ" },
  applyFilters: { en: "Apply Filters", ar: "تطبيق الفلاتر" },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("ar");

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === "en" ? "ar" : "en"));
  }, []);

  const t = useCallback(
    (key: string) => translations[key]?.[language] ?? key,
    [language]
  );

  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
