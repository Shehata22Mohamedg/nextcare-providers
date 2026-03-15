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
    providerNameAR: row["مقدم الخدمة"] || "",
    specialtyEN: row["Specialty"] || "",
    specialtyAR: row["التخصص"] || "",
    servicesEN: row["Services provided"] || "",
    servicesAR: row["الخدمات المقدمة"] || "",
    addressEN: row["Address"] || "",
    addressAR: row["العنوان"] || "",
    cityEN: row["Area / City"] || "",
    cityAR: row["المنطقة / المدينة"] || "",
    governateEN: row["Governate"] || "",
    governateAR: row["المحافظة"] || "",
    phone: row["Tel. no. - التليفون"] || "",
    email: row["E-MAIL - البريدالإلكتروني"] || "",
    providerTypeEN: row["Provider Type"] || "",
    providerTypeAR: row["نوع مقدم الخدمة"] || "",
    networkType: row["Network Type"] || "",
    mainBranch: row["Main/Branch"] || "",
    status: row["PULSE Status"] || "",
  }));
}