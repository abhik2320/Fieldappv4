import { Doctor, Chemist, TourPlan, DCR, SalesRegister, CRNRegister, CollectionRegister, OutstandingReport } from './types';

export const MOCK_CRN_REGISTER: CRNRegister = {
  parties: [
    {
      partyId: 'cp1',
      partyName: 'ANJALI ENTREPRISE',
      headquarter: 'MIDNAPORE',
      division: 'SAF-MAIN',
      cnf: 'SAF FERMION LTD',
      totalProductValue: 1558.70,
      totalTax: 174.94,
      totalAmount: 1733.64,
      creditNotes: [
        {
          cnNo: 'EXP/A/WB/05036/25-26/1828',
          cnDate: '17/03/2026',
          type: 'NON-SALABLE',
          totalProductValue: 1558.70,
          totalTax: 174.94,
          totalAmount: 1733.64,
          products: [
            { id: 'crn-p1', productName: 'PEPSIGARD-O SUSPENSION 200 ML', batch: 'PO2307', expiry: '02/2026', qty: 1.83, free: 0.17, nsr: 186.43, productValue: 341.79, tax: 41.01, total: 382.80 },
            { id: 'crn-p2', productName: 'PEPSIGARD-O SUSPENSION 200 ML', batch: 'PO2227', expiry: '11/2025', qty: 1.00, free: 0.00, nsr: 186.43, productValue: 186.43, tax: 9.32, total: 195.75 },
            { id: 'crn-p3', productName: 'ZYMOSAF SYRUP 200 ML', batch: 'ZS2406', expiry: '01/2026', qty: 0.93, free: 0.07, nsr: 119.79, productValue: 111.81, tax: 13.42, total: 125.23 },
            { id: 'crn-p4', productName: 'E-SYLATE-250 TABLET 20 x 10', batch: 'ES2404', expiry: '03/2026', qty: 1.00, free: 0.00, nsr: 120.57, productValue: 120.57, tax: 14.47, total: 135.04 },
            { id: 'crn-p5', productName: 'E-SYLATE-T TABLET 20 x 10', batch: 'ET2403', expiry: '03/2026', qty: 3.80, free: 0.20, nsr: 210.02, productValue: 798.10, tax: 95.77, total: 893.87 },
          ]
        }
      ]
    }
  ]
};

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Avantika Garg',
    area: 'Ballygaunge Market',
    specialist: 'Cardiologist',
    qualification: 'MD',
    mobile: '9876543210',
    email: 'avantika@example.com',
    address1: '123 Street',
    address2: 'Apt 4',
    address3: '',
    status: 'Rejected',
    state: 'West Bengal',
    city: 'Kolkata',
    headquarter: 'KOLKATA',
    territory: 'SECTOR 5',
    pincode: '700001',
    products: ['ALZINIC'],
  },
  {
    id: '2',
    name: 'BATUK PRAMANIK',
    area: 'NATUNHUT',
    specialist: 'General Physician',
    qualification: 'MBBS',
    mobile: '9876543211',
    email: 'batuk@example.com',
    address1: '456 Road',
    address2: '',
    address3: '',
    status: 'Approved',
    state: 'West Bengal',
    city: 'Kolkata',
    headquarter: 'KOLKATA',
    territory: 'SECTOR 5',
    pincode: '700002',
    products: ['ARIPIPRAZOLE'],
  },
  {
    id: '3',
    name: 'NIRMALYA CHATERJEE',
    area: 'GARIA',
    specialist: 'BHMS',
    qualification: 'BHMS',
    mobile: '9876543212',
    email: 'nirmalya@example.com',
    address1: '789 Lane',
    address2: '',
    address3: '',
    status: 'Pending',
    state: 'West Bengal',
    city: 'Kolkata',
    headquarter: 'KOLKATA',
    territory: 'SECTOR 5',
    pincode: '700003',
    products: ['CEFPARATUM'],
  },
];

export const MOCK_CHEMISTS: Chemist[] = [
  {
    id: '1',
    name: 'Amrit Lal gour',
    area: 'Park Street',
    mobile: '9876543220',
    contactPerson: 'Amrit',
    email: 'amrit@example.com',
    address1: '10 Park St',
    address2: '',
    status: 'Pending',
    state: 'West Bengal',
    city: 'Kolkata',
    headquarter: 'KOLKATA',
    territory: 'SECTOR 5',
    pincode: '700001',
  },
  {
    id: '2',
    name: 'Abc',
    area: 'New Town',
    mobile: '9876543221',
    contactPerson: 'John',
    email: 'abc@example.com',
    address1: '20 New Town',
    address2: '',
    status: 'Pending',
    state: 'West Bengal',
    city: 'Kolkata',
    headquarter: 'KOLKATA',
    territory: 'SECTOR 5',
    pincode: '700002',
  },
];

export const MOCK_TOUR_PLANS: TourPlan[] = [
  {
    id: '1',
    monthYear: "Sep'25",
    status: 'Incomplete',
    days: [],
  },
  {
    id: '2',
    monthYear: "Aug'25",
    status: 'Pending',
    days: [],
  },
  {
    id: '3',
    monthYear: "Jul'25",
    status: 'Approved',
    days: [],
  },
];

export const MOCK_DCRS: DCR[] = [
  {
    id: '1',
    date: '',
    workNature: 'Field Work',
    visitType: 'EX-STATION',
    fromLocation: 'NATUNHUT',
    toLocation: 'GARIA',
    headquarter: 'KOLKATA',
    distance: 15,
    status: 'Draft',
    entries: [],
  },
  {
    id: 'report-sample',
    date: '2024-10-12',
    workNature: 'Field Work',
    visitType: 'EX-STATION',
    fromLocation: 'KOLKATA OFFICE',
    toLocation: 'PARK STREET & GARIA',
    headquarter: 'WEST BENGAL',
    distance: 45,
    status: 'Completed',
    expenseAmount: 450,
    allowanceAmount: 200,
    endDayRemarks: "Productive day. Detailed 3 target doctors. High prescription intent for ALZINIC. Chemist stock levels maintained.",
    entries: [
      {
        id: 'e1',
        type: 'Doctor',
        targetId: '1',
        targetName: 'Avantika Garg',
        superiors: [],
        remarks: "Detailed cardiologist on ALZINIC benefits for post-op recovery. Doctor requested clinical trial data.",
        samples: [{ name: 'ALZINIC 500mg', quantity: 2 }, { name: 'CARDI-PRO Sample', quantity: 1 }],
        leaveBehinds: [{ name: '2025 Table Calendar', quantity: 1 }]
      },
      {
        id: 'e2',
        type: 'Doctor',
        targetId: '2',
        targetName: 'BATUK PRAMANIK',
        superiors: [],
        remarks: "Regular follow up. Prescribing ARIPIPRAZOLE frequently now.",
        samples: [{ name: 'ARIPIPRAZOLE 10mg', quantity: 5 }],
      },
      {
        id: 'e3',
        type: 'Chemist',
        targetId: '1',
        targetName: 'Amrit Lal gour',
        superiors: [],
        remarks: "Stock checked for ALZINIC. Ordered 10 boxes.",
        samples: [],
      },
      {
        id: 'e4',
        type: 'Doctor',
        targetId: '3',
        targetName: 'NIRMALYA CHATERJEE',
        superiors: [],
        remarks: "New visit. Introduced CEFPARATUM range. Interested in pricing.",
        samples: [{ name: 'CEFPARATUM 1g Inj', quantity: 1 }],
      },
      {
        id: 'e5',
        type: 'Chemist',
        targetId: '2',
        targetName: 'Abc',
        superiors: [],
        remarks: "General stock inquiry. No immediate requirements.",
        samples: [],
      },
      {
        id: 'e6',
        type: 'Stockist',
        targetId: 's1',
        targetName: 'Universal Pharma Distributors',
        superiors: [],
        remarks: "Verified primary sales. POB collected for ARIPIPRAZOLE (20 units).",
        samples: [],
      },
      {
        id: 'e7',
        type: 'Non-Listed Doctor',
        targetId: 'nl1',
        targetName: 'Dr. S. K. Roy (Rural PRP)',
        superiors: [],
        remarks: "Visited via referral. High potential for basic antibiotics. Added to prospect list.",
        samples: [{ name: 'CEFPARATUM Sample', quantity: 1 }],
      }
    ],
  }
];

export const MOCK_DEVIATIONS = [
  {
    id: 'dev-1',
    fromPeriod: '16th March',
    toPeriod: '15th April',
    cycle: '2026',
    status: 'Approved',
    entries: [
      {
        id: '2',
        date: '24/03/26',
        plannedFrom: 'HQ',
        plannedTo: 'Khardha',
        plannedNature: 'Field Work',
        plannedVisitType: 'HEAD QUARTER',
        actualFrom: 'HQ',
        actualTo: 'Titagarh',
        actualNature: 'Field Work',
        actualVisitType: 'HEAD QUARTER',
        reason: 'Due to Core Doctor visited in there.',
        status: 'Approved'
      },
      {
        id: '3',
        date: '28/03/26',
        plannedFrom: 'HQ',
        plannedTo: 'Katihat',
        plannedNature: 'Field Work',
        plannedVisitType: 'OUT-STATION',
        actualFrom: 'HQ',
        actualTo: 'Basirhat',
        actualNature: 'Field Work',
        actualVisitType: 'OUT-STATION',
        reason: 'DM TOP 10 Doctors visit Purpose.',
        status: 'Approved'
      },
      {
        id: '4',
        date: '31/03/26',
        plannedFrom: 'HQ',
        plannedTo: 'Barrackpore',
        plannedNature: 'Closing',
        plannedVisitType: 'HEAD QUARTER',
        actualFrom: 'HQ',
        actualTo: 'H.O. For Closing',
        actualNature: 'Closing',
        actualVisitType: 'HEAD QUARTER',
        reason: 'closing Purpose.',
        status: 'Approved'
      },
      {
        id: '5',
        date: '02/04/26',
        plannedFrom: 'Basirhat',
        plannedTo: 'Basirhat',
        plannedNature: 'Field Work',
        plannedVisitType: 'OUT-STATION',
        actualFrom: 'Basirhat',
        actualTo: 'Haroa',
        actualNature: 'Field Work',
        actualVisitType: 'OUT-STATION',
        reason: 'core Doctors visit Purpose.',
        status: 'Rejected',
        remarks: 'Deviation not justified by manager.'
      },
      {
        id: '6',
        date: '03/04/26',
        plannedFrom: 'HQ',
        plannedTo: 'Saguna',
        plannedNature: 'Field Work',
        plannedVisitType: 'HEAD QUARTER',
        actualFrom: 'HQ',
        actualTo: 'Madhyamgram/NBP',
        actualNature: 'Field Work',
        actualVisitType: 'HEAD QUARTER',
        reason: 'As Per SSM Advised with RSM we Worked The Place For Solve The goods Return Problem of M.A. Pharma.',
        status: 'Approved'
      },
      {
        id: '7',
        date: '06/04/26',
        plannedFrom: 'Bongaon',
        plannedTo: 'Bongaon',
        plannedNature: 'Field Work',
        plannedVisitType: 'OUT-STATION',
        actualFrom: 'Bongaon',
        actualTo: 'Admin Day',
        actualNature: 'Admin',
        actualVisitType: 'HEAD QUARTER',
        reason: 'As per Advised By H.O.',
        status: 'Approved'
      }
    ]
  }
];

export const MOCK_SALES_REGISTER: SalesRegister = {
  parties: [
    {
      partyId: 'p1',
      partyName: 'SINHA ENTERPRISE',
      headquarter: 'MIDNAPORE',
      division: 'SAF-MAIN',
      totalProductValue: 69861.42,
      totalNetValue: 59665.00,
      invoices: [
        {
          invoiceNo: 'ING/A/WB/05407/25-26/3756',
          invoiceDate: '27/03/2026',
          productValue: 69861.42,
          discount: 0.00,
          cgst: 1746.54,
          sgst: 1746.54,
          igst: 0.00,
          roundOff: 0.50,
          netValue: 59665.00,
          rsm: 'BARUN MANNA',
          dm: 'DEBDATTA MAITY',
          gstin: '19CGDPS0317P1ZY',
          cnNo: 'EXP/1611, EXP/1609',
          credit: 13690.00,
          marketingValue: 65587.22,
          products: [
            { id: 'prod1', productName: 'Symphony-X', qty: 100, free: 10, rate: 150.00, value: 15000.00, gst: 1800.00, marketingValue: 13500.00 },
            { id: 'prod2', productName: 'Vitality-Z', qty: 50, free: 5, rate: 200.00, value: 10000.00, gst: 1200.00, marketingValue: 9000.00 }
          ]
        }
      ]
    },
    {
      partyId: 'p2',
      partyName: 'HEALTHCARE PHARMA',
      headquarter: 'KOLKATA',
      division: 'SAF-MAIN',
      totalProductValue: 45000.00,
      totalNetValue: 40000.00,
      invoices: [
        {
          invoiceNo: 'ING/A/WB/05500/25-26/3800',
          invoiceDate: '28/03/2026',
          productValue: 25000.00,
          discount: 500.00,
          cgst: 625.00,
          sgst: 625.00,
          igst: 0.00,
          roundOff: 0.00,
          netValue: 23000.00,
          rsm: 'BARUN MANNA',
          dm: 'DEBDATTA MAITY',
          gstin: '19ABCDE1234F1Z1',
          cnNo: 'EXP/2000',
          credit: 0.00,
          marketingValue: 22000.00,
          products: [
            { id: 'prod3', productName: 'Nu-Core', qty: 200, free: 20, rate: 100.00, value: 20000.00, gst: 2400.00, marketingValue: 18000.00 }
          ]
        },
        {
          invoiceNo: 'ING/A/WB/05501/25-26/3801',
          invoiceDate: '30/03/2026',
          productValue: 20000.00,
          discount: 0.00,
          cgst: 500.00,
          sgst: 500.00,
          igst: 0.00,
          roundOff: 0.00,
          netValue: 17000.00,
          rsm: 'BARUN MANNA',
          dm: 'DEBDATTA MAITY',
          gstin: '19ABCDE1234F1Z1',
          cnNo: '-',
          credit: 0.00,
          marketingValue: 16000.00,
          products: [
            { id: 'prod4', productName: 'Glow-Max', qty: 80, free: 0, rate: 250.00, value: 20000.00, gst: 2400.00, marketingValue: 18000.00 }
          ]
        }
      ]
    }
  ]
};

export const MOCK_COLLECTION_REGISTER: CollectionRegister = {
  entries: [
    {
      id: 'col-1',
      hq: 'MIDNAPORE',
      partyName: 'ANJALI ENTREPRISE',
      paymentNo: 'PNA//Mar/WB/05036/25-26/3794',
      paymentDate: '05/03/2026',
      amount: 6671.00,
      adjWithInvoice: 'ING/B/WB/05036/25-26/3592',
      invoiceDate: '28/02/2026',
      days: 5,
      chequeNo: '',
      bank: '',
      paymentMode: 'NEFT'
    },
    {
      id: 'col-2',
      hq: 'MIDNAPORE',
      partyName: 'ANJALI ENTREPRISE',
      paymentNo: 'PNA//Mar/WB/05036/25-26/3794',
      paymentDate: '05/03/2026',
      amount: 978.00,
      adjWithInvoice: 'ING/A/WB/05036/25-26/3591',
      invoiceDate: '28/02/2026',
      days: 5,
      chequeNo: '',
      bank: '',
      paymentMode: 'NEFT'
    },
    {
      id: 'col-3',
      hq: 'MIDNAPORE',
      partyName: 'SINHA ENTERPRISE',
      paymentNo: 'PNA//Mar/WB/05407/25-26/3893',
      paymentDate: '23/03/2026',
      amount: 6675.00,
      adjWithInvoice: 'ING/A/WB/05407/25-26/3265',
      invoiceDate: '31/01/2026',
      days: 51,
      chequeNo: '',
      bank: '',
      paymentMode: 'NEFT'
    },
    {
      id: 'col-4',
      hq: 'MIDNAPORE',
      partyName: 'SINHA ENTERPRISE',
      paymentNo: 'PNA//Mar/WB/05407/25-26/3893',
      paymentDate: '23/03/2026',
      amount: 29731.00,
      adjWithInvoice: 'ING/A/WB/05407/25-26/3381',
      invoiceDate: '16/02/2026',
      days: 35,
      chequeNo: '',
      bank: '',
      paymentMode: 'NEFT'
    },
    {
      id: 'col-5',
      hq: 'MIDNAPORE',
      partyName: 'SINHA ENTERPRISE',
      paymentNo: 'PNA//Mar/WB/05407/25-26/3893',
      paymentDate: '23/03/2026',
      amount: 105095.00,
      adjWithInvoice: 'ING/A/WB/05407/25-26/3521',
      invoiceDate: '28/02/2026',
      days: 23,
      chequeNo: '',
      bank: '',
      paymentMode: 'NEFT'
    },
    {
      id: 'col-6',
      hq: 'MIDNAPORE',
      partyName: 'SINHA ENTERPRISE',
      paymentNo: 'PNA//Mar/WB/05407/25-26/3893',
      paymentDate: '23/03/2026',
      amount: 26201.00,
      adjWithInvoice: 'ING/B/WB/05407/25-26/3251',
      invoiceDate: '31/01/2026',
      days: 51,
      chequeNo: '',
      bank: '',
      paymentMode: 'NEFT'
    },
    {
      id: 'col-7',
      hq: 'MIDNAPORE',
      partyName: 'SINHA ENTERPRISE',
      paymentNo: 'PNA//Mar/WB/05407/25-26/3893',
      paymentDate: '23/03/2026',
      amount: 7707.00,
      adjWithInvoice: 'ING/B/WB/05407/25-26/3295',
      invoiceDate: '31/01/2026',
      days: 51,
      chequeNo: '',
      bank: '',
      paymentMode: 'NEFT'
    },
    {
      id: 'col-8',
      hq: 'MIDNAPORE',
      partyName: 'SINHA ENTERPRISE',
      paymentNo: 'PNA//Mar/WB/05407/25-26/3922',
      paymentDate: '27/03/2026',
      amount: 73059.00,
      adjWithInvoice: 'ING/B/WB/05407/25-26/3585',
      invoiceDate: '28/02/2026',
      days: 27,
      chequeNo: '',
      bank: '',
      paymentMode: 'NEFT'
    }
  ]
};

export const MOCK_OUTSTANDING_REPORT: OutstandingReport = {
  parties: [
    {
      partyId: 'o-p1',
      partyName: 'ANJALI ENTREPRISE',
      headquarter: 'MIDNAPORE',
      division: 'SAF-MAIN',
      totalOutstanding: -12370,
      documents: [
        { id: 'o-d1', docType: 'CREDIT NOTE', docNo: 'EXP/A/WB/05036/23-24/1246', invDate: '18/02/2024', amount: 1 },
        { id: 'o-d2', docType: 'CREDIT NOTE', docNo: 'EXP/A/WB/05036/25-26/1433', invDate: '20/01/2026', amount: -3556 },
        { id: 'o-d3', docType: 'CREDIT NOTE', docNo: 'EXP/A/WB/05036/25-26/1828', invDate: '17/03/2026', amount: -1733 },
        { id: 'o-d4', docType: 'CREDIT NOTE', docNo: 'EXP/B/WB/05036/25-26/1829', invDate: '17/03/2026', amount: -7082 },
      ]
    },
    {
      partyId: 'o-p2',
      partyName: 'S. K. PHARMA',
      headquarter: 'MIDNAPORE',
      division: 'SAF-MAIN',
      totalOutstanding: -645,
      documents: [
        { id: 'o-d5', docType: 'CREDIT NOTE', docNo: 'SR/A/WB/05242/24-25/1359', invDate: '13/03/2025', amount: 1 },
        { id: 'o-d6', docType: 'CREDIT NOTE', docNo: 'EXP/B/WB/05242/25-26/1460', invDate: '21/01/2026', amount: -505 },
        { id: 'o-d7', docType: 'CREDIT NOTE', docNo: 'EXP/B/WB/05242/25-26/1461', invDate: '21/01/2026', amount: -141 },
      ]
    },
    {
      partyId: 'o-p3',
      partyName: 'SINHA ENTERPRISE',
      headquarter: 'MIDNAPORE',
      division: 'SAF-MAIN',
      totalOutstanding: 63562,
      documents: [
        { id: 'o-d8', docType: 'INVOICE', docNo: 'ING/A/WB/05407/22-23/1646', invDate: '25/07/2022', dispatchDate: '26/07/2022', outstandingDays: 1365, amount: -65, comment: 'Old pending' },
        { id: 'o-d9', docType: 'INVOICE', docNo: 'ING/B/WB/05407/22-23/2870', invDate: '17/10/2022', dispatchDate: '18/10/2022', outstandingDays: 1281, amount: 1 },
        { id: 'o-d10', docType: 'INVOICE', docNo: 'ING/B/WB/05407/24-25/3979', invDate: '28/02/2025', dispatchDate: '04/03/2025', outstandingDays: 413, amount: 1 },
        { id: 'o-d11', docType: 'INVOICE', docNo: 'ING/A/WB/05407/25-26/3521', invDate: '28/02/2026', dispatchDate: '05/03/2026', outstandingDays: 47, amount: 1 },
        { id: 'o-d12', docType: 'CREDIT NOTE', docNo: 'EXP/A/WB/05407/25-26/1848', invDate: '18/03/2026', amount: -8153 },
        { id: 'o-d13', docType: 'CREDIT NOTE', docNo: 'EXP/A/WB/05407/25-26/1849', invDate: '18/03/2026', amount: -10176 },
        { id: 'o-d14', docType: 'INVOICE', docNo: 'ING/B/WB/05407/25-26/3720', invDate: '25/03/2026', dispatchDate: '25/03/2026', outstandingDays: 27, amount: 71779 },
      ]
    }
  ]
};
