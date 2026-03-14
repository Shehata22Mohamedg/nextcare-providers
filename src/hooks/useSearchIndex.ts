import { useMemo } from "react";
import { ProviderRaw } from "@/lib/excelParser";

interface SearchEntry {
  textEN: string;
  textAR: string;
  provider: ProviderRaw;
}

export function useSearchIndex(providers: ProviderRaw[] | undefined) {
  return useMemo(() => {
    if (!providers) return [];
    return providers.map((p): SearchEntry => ({
      textEN: [
        p.providerNameEN, p.specialtyEN, p.cityEN, p.servicesEN,
        p.governateEN, p.addressEN, p.providerTypeEN,
        p.phone, p.email, p.networkType, p.status,
      ].join(" ").toLowerCase(),
      textAR: [
        p.providerNameAR, p.specialtyAR, p.cityAR, p.servicesAR,
        p.governateAR, p.addressAR, p.providerTypeAR,
        p.phone, p.email, p.networkType, p.status,
      ].join(" ").toLowerCase(),
      provider: p,
    }));
  }, [providers]);
}
