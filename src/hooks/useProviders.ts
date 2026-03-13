import { useQuery } from "@tanstack/react-query";
import { loadProviders, ProviderRaw } from "@/lib/excelParser";

export function useProviders() {
  return useQuery<ProviderRaw[]>({
    queryKey: ["providers"],
    queryFn: loadProviders,
    staleTime: Infinity,
  });
}
