export type Status = 'Pending' | 'Approved' | 'Rejected' | 'Incomplete';

export interface Doctor {
  id: string;
  name: string;
  area: string;
  specialist: string;
  qualification: string;
  mobile: string;
  email: string;
  address1: string;
  address2: string;
  address3: string;
  status: Status;
  state: string;
  city: string;
  headquarter: string;
  territory: string;
  pincode: string;
  products: string[];
}

export interface Chemist {
  id: string;
  name: string;
  area: string;
  mobile: string;
  contactPerson: string;
  email: string;
  address1: string;
  address2: string;
  status: Status;
  state: string;
  city: string;
  headquarter: string;
  territory: string;
  pincode: string;
  stocklist1?: string;
  stocklist2?: string;
  avgPurchase?: string;
}

export interface TourPlan {
  id: string;
  monthYear: string; // e.g., "Sep'25"
  status: Status;
  days: TourDay[];
}

export interface TourDay {
  date: string;
  nature: string;
  visitType: string;
  from: string;
  to: string;
  remarks?: string;
  isEdited?: boolean;
}

export interface DCR {
  id: string;
  date: string;
  workNature: string;
  visitType: string;
  fromLocation: string;
  toLocation: string;
  distance: number;
  entries: DCREntry[];
  status: 'Draft' | 'Started' | 'Completed';
  endDayRemarks?: string;
  expenseAmount?: number;
  allowanceAmount?: number;
  headquarter?: string;
  expenseDocs?: string[]; // URLs or base64 strings
  miscExpenses?: MiscExpense[];
}

export interface MiscExpense {
  id: string;
  type: string;
  amount: number;
  attachments: string[];
}

export interface DCREntry {
  id: string;
  type: 'Doctor' | 'Chemist' | 'Stockist' | 'Non-Listed Doctor';
  targetId: string; // ID of Doctor or Chemist
  targetName: string;
  superiors: string[];
  samples: { name: string; quantity: number }[];
  leaveBehinds?: { name: string; quantity: number }[];
  remarks?: string;
}

export interface Expense {
  id: string;
  date: string;
  name: string;
  km: number;
  fareAllow: number;
  fileName?: string;
}

export interface DeviationReport {
  id: string;
  fromPeriod: string;
  toPeriod: string;
  cycle: string;
  status: Status;
  entries: DeviationEntry[];
}

export interface DeviationEntry {
  id: string;
  date: string;
  plannedFrom: string;
  plannedTo: string;
  plannedNature: string;
  plannedVisitType: string;
  actualFrom: string;
  actualTo: string;
  actualNature: string;
  actualVisitType: string;
  reason: string;
  status: 'Approved' | 'Rejected' | 'Pending';
  remarks?: string;
}

export interface SalesRegister {
  parties: PartySummary[];
}

export interface PartySummary {
  partyId: string;
  partyName: string;
  headquarter: string;
  division: string;
  totalProductValue: number;
  totalNetValue: number;
  invoices: InvoiceSummary[];
}

export interface InvoiceSummary {
  invoiceNo: string;
  invoiceDate: string;
  productValue: number;
  discount: number;
  cgst: number;
  sgst: number;
  igst: number;
  roundOff: number;
  netValue: number;
  rsm: string;
  dm: string;
  gstin: string;
  cnNo: string;
  credit: number;
  marketingValue: number;
  products: ProductDetail[];
}

export interface ProductDetail {
  id: string;
  productName: string;
  qty: number;
  free: number;
  rate: number;
  value: number;
  gst: number;
  marketingValue: number;
}

export interface CRNRegister {
  parties: CRNPartySummary[];
}

export interface CRNPartySummary {
  partyId: string;
  partyName: string;
  headquarter: string;
  division: string;
  cnf: string;
  totalProductValue: number;
  totalTax: number;
  totalAmount: number;
  creditNotes: CRNSummary[];
}

export interface CRNSummary {
  cnNo: string;
  cnDate: string;
  type: string;
  totalProductValue: number;
  totalTax: number;
  totalAmount: number;
  products: CRNProductDetail[];
}

export interface CRNProductDetail {
  id: string;
  productName: string;
  batch: string;
  expiry: string;
  qty: number;
  free: number;
  nsr: number;
  productValue: number;
  tax: number;
  total: number;
}

export interface CollectionRegister {
  entries: CollectionEntry[];
}

export interface CollectionEntry {
  id: string;
  hq: string;
  partyName: string;
  paymentNo: string;
  paymentDate: string;
  amount: number;
  adjWithInvoice: string;
  invoiceDate: string;
  days: number;
  chequeNo: string;
  bank: string;
  paymentMode: string;
  range61to90?: number;
  rangeOver90?: number;
}

export interface OutstandingReport {
  parties: OutstandingPartySummary[];
}

export interface OutstandingPartySummary {
  partyId: string;
  partyName: string;
  headquarter: string;
  division: string;
  totalOutstanding: number;
  documents: OutstandingDocument[];
}

export interface OutstandingDocument {
  id: string;
  docType: 'INVOICE' | 'CREDIT NOTE';
  docNo: string;
  invDate: string;
  dispatchDate?: string;
  outstandingDays?: number;
  amount: number;
  comment?: string;
}
