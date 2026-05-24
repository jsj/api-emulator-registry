export const COMPANIES = [
  {
    cik: '0000001001',
    name: 'Example Robotics Inc.',
    tickers: ['EXRB'],
    sic: '3571',
    sicDescription: 'Electronic Computers',
    exchanges: ['NYSE'],
    fiscalYearEnd: '1231',
    stateOfIncorporation: 'DE',
    filings: {
      recent: {
        accessionNumber: ['0000001001-26-000001', '0000001001-25-000010'],
        form: ['10-K', '10-Q'],
        filingDate: ['2026-02-15', '2025-11-05'],
        primaryDocument: ['exrb-20261231.htm', 'exrb-20250930.htm'],
      },
    },
  },
  {
    cik: '0000001002',
    name: 'Example Foods Corp.',
    tickers: ['EXFD'],
    sic: '2000',
    sicDescription: 'Food and Kindred Products',
    exchanges: ['NASDAQ'],
    fiscalYearEnd: '0630',
    stateOfIncorporation: 'CA',
    filings: {
      recent: {
        accessionNumber: ['0000001002-26-000001'],
        form: ['8-K'],
        filingDate: ['2026-01-20'],
        primaryDocument: ['exfd-8k.htm'],
      },
    },
  },
  {
    cik: '0000320193',
    name: 'Apple Inc.',
    tickers: ['AAPL'],
    sic: '3571',
    sicDescription: 'Electronic Computers',
    exchanges: ['NASDAQ'],
    fiscalYearEnd: '0927',
    stateOfIncorporation: 'CA',
    filings: {
      recent: {
        accessionNumber: ['0000320193-26-000001', '0000320193-25-000079'],
        form: ['10-K', '10-Q'],
        filingDate: ['2026-10-30', '2025-08-01'],
        primaryDocument: ['aapl-20250927.htm', 'aapl-20250628.htm'],
      },
    },
  },
  {
    cik: '0001045810',
    name: 'NVIDIA Corporation',
    tickers: ['NVDA'],
    sic: '3674',
    sicDescription: 'Semiconductors and Related Devices',
    exchanges: ['NASDAQ'],
    fiscalYearEnd: '0126',
    stateOfIncorporation: 'DE',
    filings: {
      recent: {
        accessionNumber: ['0001045810-26-000001', '0001045810-25-000023'],
        form: ['10-K', '10-Q'],
        filingDate: ['2026-02-26', '2025-11-20'],
        primaryDocument: ['nvda-20260126.htm', 'nvda-20251026.htm'],
      },
    },
  },
];

export const COMPANY_FACTS = {
  '0000001001': {
    cik: 1001,
    entityName: 'Example Robotics Inc.',
    facts: {
      'us-gaap': {
        RevenueFromContractWithCustomerExcludingAssessedTax: {
          units: {
            USD: [
              { start: '2025-01-01', end: '2025-12-31', val: 100000000000, accn: '0000001001-26-000001', fy: 2025, fp: 'FY', form: '10-K', filed: '2026-02-15' },
              { start: '2024-01-01', end: '2024-12-31', val: 90000000000, accn: '0000001001-25-000001', fy: 2024, fp: 'FY', form: '10-K', filed: '2025-02-15' },
            ],
          },
        },
        GrossProfit: {
          units: { USD: [{ start: '2025-01-01', end: '2025-12-31', val: 42000000000, accn: '0000001001-26-000001', fy: 2025, fp: 'FY', form: '10-K', filed: '2026-02-15' }] },
        },
        NetIncomeLoss: {
          units: { USD: [{ start: '2025-01-01', end: '2025-12-31', val: 25000000000, accn: '0000001001-26-000001', fy: 2025, fp: 'FY', form: '10-K', filed: '2026-02-15' }] },
        },
        EarningsPerShareDiluted: {
          units: {
            'USD/shares': [
              { start: '2025-01-01', end: '2025-12-31', val: 6.2, accn: '0000001001-26-000001', fy: 2025, fp: 'FY', form: '10-K', filed: '2026-02-15' },
              { start: '2025-07-01', end: '2025-09-30', val: 1.55, accn: '0000001001-25-000010', fy: 2025, fp: 'Q3', form: '10-Q', filed: '2025-11-05' },
            ],
          },
        },
        EntityCommonStockSharesOutstanding: {
          units: { shares: [{ end: '2026-02-01', val: 1000000000, accn: '0000001001-26-000001', fy: 2025, fp: 'FY', form: '10-K', filed: '2026-02-15' }] },
        },
      },
    },
  },
  '0000320193': {
    cik: 320193,
    entityName: 'Apple Inc.',
    facts: {
      'us-gaap': {
        RevenueFromContractWithCustomerExcludingAssessedTax: {
          units: { USD: [{ start: '2024-09-29', end: '2025-09-27', val: 391035000000, accn: '0000320193-26-000001', fy: 2025, fp: 'FY', form: '10-K', filed: '2026-10-30' }] },
        },
        GrossProfit: {
          units: { USD: [{ start: '2024-09-29', end: '2025-09-27', val: 180683000000, accn: '0000320193-26-000001', fy: 2025, fp: 'FY', form: '10-K', filed: '2026-10-30' }] },
        },
        NetIncomeLoss: {
          units: { USD: [{ start: '2024-09-29', end: '2025-09-27', val: 93736000000, accn: '0000320193-26-000001', fy: 2025, fp: 'FY', form: '10-K', filed: '2026-10-30' }] },
        },
        EarningsPerShareDiluted: {
          units: {
            'USD/shares': [
              { start: '2024-09-29', end: '2025-09-27', val: 6.08, accn: '0000320193-26-000001', fy: 2025, fp: 'FY', form: '10-K', filed: '2026-10-30' },
              { start: '2025-03-30', end: '2025-06-28', val: 1.57, accn: '0000320193-25-000079', fy: 2025, fp: 'Q3', form: '10-Q', filed: '2025-08-01' },
            ],
          },
        },
        EntityCommonStockSharesOutstanding: {
          units: { shares: [{ end: '2025-10-17', val: 14840343000, accn: '0000320193-26-000001', fy: 2025, fp: 'FY', form: '10-K', filed: '2026-10-30' }] },
        },
      },
    },
  },
  '0001045810': {
    cik: 1045810,
    entityName: 'NVIDIA Corporation',
    facts: {
      'us-gaap': {
        RevenueFromContractWithCustomerExcludingAssessedTax: {
          units: { USD: [{ start: '2025-01-27', end: '2026-01-26', val: 130497000000, accn: '0001045810-26-000001', fy: 2026, fp: 'FY', form: '10-K', filed: '2026-02-26' }] },
        },
        GrossProfit: {
          units: { USD: [{ start: '2025-01-27', end: '2026-01-26', val: 97858000000, accn: '0001045810-26-000001', fy: 2026, fp: 'FY', form: '10-K', filed: '2026-02-26' }] },
        },
        NetIncomeLoss: {
          units: { USD: [{ start: '2025-01-27', end: '2026-01-26', val: 72880000000, accn: '0001045810-26-000001', fy: 2026, fp: 'FY', form: '10-K', filed: '2026-02-26' }] },
        },
        EarningsPerShareDiluted: {
          units: {
            'USD/shares': [
              { start: '2025-01-27', end: '2026-01-26', val: 2.94, accn: '0001045810-26-000001', fy: 2026, fp: 'FY', form: '10-K', filed: '2026-02-26' },
              { start: '2025-07-28', end: '2025-10-26', val: 0.78, accn: '0001045810-25-000023', fy: 2026, fp: 'Q3', form: '10-Q', filed: '2025-11-20' },
            ],
          },
        },
        EntityCommonStockSharesOutstanding: {
          units: { shares: [{ end: '2026-02-13', val: 24300000000, accn: '0001045810-26-000001', fy: 2026, fp: 'FY', form: '10-K', filed: '2026-02-26' }] },
        },
      },
    },
  },
};

export const FILING_DOCUMENTS = {
  '/Archives/edgar/data/1001/000000100126000001/exrb-20261231.htm': `
    <xbrli:context id="product-context">
      <xbrli:period><xbrli:startDate>2025-01-01</xbrli:startDate><xbrli:endDate>2025-12-31</xbrli:endDate></xbrli:period>
      <xbrli:scenario><xbrldi:explicitMember dimension="us-gaap:ProductOrServiceAxis">exrb:RoboticsPlatformMember</xbrldi:explicitMember></xbrli:scenario>
    </xbrli:context>
    <xbrli:context id="geo-context">
      <xbrli:period><xbrli:startDate>2025-01-01</xbrli:startDate><xbrli:endDate>2025-12-31</xbrli:endDate></xbrli:period>
      <xbrli:scenario><xbrldi:explicitMember dimension="us-gaap:StatementGeographicalAxis">exrb:UnitedStatesMember</xbrldi:explicitMember></xbrli:scenario>
    </xbrli:context>
    <ix:nonFraction name="us-gaap:RevenueFromContractWithCustomerExcludingAssessedTax" contextRef="product-context" unitRef="usd" scale="6">42</ix:nonFraction>
    <ix:nonFraction name="us-gaap:Revenues" contextRef="geo-context" unitRef="usd" scale="6">58</ix:nonFraction>
  `,
  '/Archives/edgar/data/320193/000032019326000001/aapl-20250927.htm': `
    <xbrli:context id="iphone-context"><xbrli:period><xbrli:startDate>2024-09-29</xbrli:startDate><xbrli:endDate>2025-09-27</xbrli:endDate></xbrli:period><xbrli:scenario><xbrldi:explicitMember dimension="us-gaap:ProductOrServiceAxis">aapl:iPhoneMember</xbrldi:explicitMember></xbrli:scenario></xbrli:context>
    <xbrli:context id="services-context"><xbrli:period><xbrli:startDate>2024-09-29</xbrli:startDate><xbrli:endDate>2025-09-27</xbrli:endDate></xbrli:period><xbrli:scenario><xbrldi:explicitMember dimension="us-gaap:ProductOrServiceAxis">aapl:ServicesMember</xbrldi:explicitMember></xbrli:scenario></xbrli:context>
    <ix:nonFraction name="us-gaap:RevenueFromContractWithCustomerExcludingAssessedTax" contextRef="iphone-context" unitRef="usd" scale="6">201183</ix:nonFraction>
    <ix:nonFraction name="us-gaap:RevenueFromContractWithCustomerExcludingAssessedTax" contextRef="services-context" unitRef="usd" scale="6">96169</ix:nonFraction>
  `,
  '/Archives/edgar/data/1045810/000104581026000001/nvda-20260126.htm': `
    <xbrli:context id="datacenter-context"><xbrli:period><xbrli:startDate>2025-01-27</xbrli:startDate><xbrli:endDate>2026-01-26</xbrli:endDate></xbrli:period><xbrli:scenario><xbrldi:explicitMember dimension="us-gaap:ProductOrServiceAxis">nvda:ComputeAndNetworkingMember</xbrldi:explicitMember></xbrli:scenario></xbrli:context>
    <xbrli:context id="gaming-context"><xbrli:period><xbrli:startDate>2025-01-27</xbrli:startDate><xbrli:endDate>2026-01-26</xbrli:endDate></xbrli:period><xbrli:scenario><xbrldi:explicitMember dimension="us-gaap:ProductOrServiceAxis">nvda:GraphicsMember</xbrldi:explicitMember></xbrli:scenario></xbrli:context>
    <ix:nonFraction name="us-gaap:RevenueFromContractWithCustomerExcludingAssessedTax" contextRef="datacenter-context" unitRef="usd" scale="6">115200</ix:nonFraction>
    <ix:nonFraction name="us-gaap:RevenueFromContractWithCustomerExcludingAssessedTax" contextRef="gaming-context" unitRef="usd" scale="6">15297</ix:nonFraction>
  `,
};

export function state(store) {
  const existing = store.getData?.('sec:state');
  if (existing) return existing;
  const initial = {
    companies: Object.fromEntries(COMPANIES.map((company) => [company.cik, company])),
    companyFacts: COMPANY_FACTS,
    filingDocuments: FILING_DOCUMENTS,
    requests: [],
  };
  store.setData?.('sec:state', initial);
  return initial;
}

export function saveState(store, value) {
  store.setData?.('sec:state', value);
}
