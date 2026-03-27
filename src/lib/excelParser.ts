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

// Lazy-load exceljs
let excelModule: typeof import("exceljs") | null = null;

async function getExcelJS() {
  if (!excelModule) {
    excelModule = await import("exceljs");
  }
  return excelModule;
}

export async function loadProviders(): Promise<ProviderRaw[]> {
  const providersFileUrl = `${import.meta.env.BASE_URL}data/providers.xlsx`;

  const [response, ExcelJS] = await Promise.all([
    fetch(providersFileUrl),
    getExcelJS(),
  ]);

  const buffer = await response.arrayBuffer();

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const worksheet = workbook.worksheets[0];

  const rows: any[] = [];

  // أول row = headers
  let headers: string[] = [];

  worksheet.eachRow((row, rowNumber) => {
    const values = row.values as any[];

    if (rowNumber === 1) {
      headers = values.map((v) => String(v || "").trim());
    } else {
      const obj: any = {};
      headers.forEach((header, i) => {
        obj[header] = values[i];
      });
      rows.push(obj);
    }
  });

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