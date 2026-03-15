export interface ProviderRaw {
  providerNameEN: string;
  providerNameAR: string;
  specialtyEN: string;
  specialtyAR: string;
  servicesEN: string;
  servicesAR: string;
  addressEN: string;
  addressAR: string;
  cityEN: string;
  cityAR: string;
  governateEN: string;
  governateAR: string;
  phone: string;
  email: string;
  providerTypeEN: string;
  providerTypeAR: string;
  networkType: string;
  mainBranch: string;
  status: string;
}

// Lazy-load xlsx to avoid blocking initial render (~800KB)
let xlsxModule: typeof import("xlsx") | null = null;

async function getXLSX() {
  if (!xlsxModule) {
    xlsxModule = await import("xlsx");
  }
  return xlsxModule;
}

export async function loadProviders(): Promise<ProviderRaw[]> {
  // Start both fetches in parallel
  const [response, XLSX] = await Promise.all([
    fetch("/data/providers.xlsx"),
    getXLSX(),
  ]);
  
  const buffer = await response.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<any>(sheet);

  const s = (v: unknown): string => (v == null ? "" : String(v).trim());

  return rows.map((row: any) => ({
    providerNameEN: s(row["TATSH Names"]),
    providerNameAR: s(row["مقدم الخدمة"]),
    specialtyEN: s(row["Specialty"]),
    specialtyAR: s(row["التخصص"]),
    servicesEN: s(row["Services provided"]),
    servicesAR: s(row["الخدمات المقدمة"]),
    addressEN: s(row["Address"]),
    addressAR: s(row["العنوان"]),
    cityEN: s(row["Area / City"]),
    cityAR: s(row["المنطقة / المدينة"]),
    governateEN: s(row["Governate"]),
    governateAR: s(row["المحافظة"]),
    phone: s(row["Tel. no. - التليفون"]),
    email: s(row["E-MAIL - البريدالإلكتروني"]),
    providerTypeEN: s(row["Provider Type"]),
    providerTypeAR: s(row["نوع مقدم الخدمة"]),
    networkType: s(row["Network Type"]),
    mainBranch: s(row["Main/Branch"]),
    status: s(row["PULSE Status"]),
  }));
}