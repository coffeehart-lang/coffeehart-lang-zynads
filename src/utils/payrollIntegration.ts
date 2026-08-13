import { Employee } from '../components/PayrollView';

export interface QuickBooksExportOptions {
  companyName: string;
  payPeriod: string;
  payDate: string;
  isCashOnlyMode: boolean; // Special setting for Dispensaries & Cash-Only Businesses
  vaultAccountName?: string; // e.g., 'Vault Cash / Safe Reserve'
  isSection280ECompliant?: boolean; // For Cannabis Dispensaries (IRC 280E Cost of Goods Sold tracking)
  applyTaxWithholdings?: boolean; // Whether tax calculations/withholdings are active or bypassed for direct cash draws
}

export interface QuickBooksJournalEntry {
  date: string;
  refNumber: string;
  account: string;
  accountType: 'Expense' | 'Cost of Goods Sold' | 'Bank' | 'Other Current Asset' | 'Other Current Liability' | 'Equity';
  debit: number;
  credit: number;
  memo: string;
  classOrLocation?: string;
}

/**
 * Maps ZyncastCFO payroll totals & employee roster into standard QuickBooks Journal Entries.
 * Supports special Cash-Only / Dispensary (280E) tax and vault accounting rules.
 */
export function generateQuickBooksJournalEntries(
  employees: Employee[],
  options: QuickBooksExportOptions
): QuickBooksJournalEntry[] {
  const { payDate, payPeriod, isCashOnlyMode, isSection280ECompliant = false, applyTaxWithholdings = true } = options;

  let totalGross = 0;
  let totalTaxes = 0;
  let totalDeductions = 0;
  let totalNet = 0;

  // Calculate totals
  employees.forEach(emp => {
    let gross = 0;
    if (emp.type === 'W-2 Salary') {
      gross = emp.payRate + emp.bonus;
    } else {
      gross = (emp.hoursWorked * emp.payRate) + (emp.overtimeHours * emp.payRate * 1.5) + emp.bonus;
    }
    const tax = applyTaxWithholdings ? (gross * emp.taxWithholdingPct) / 100 : 0;
    const net = Math.max(0, gross - tax - emp.deductions);

    totalGross += gross;
    totalTaxes += tax;
    totalDeductions += emp.deductions;
    totalNet += net;
  });

  const entries: QuickBooksJournalEntry[] = [];
  const refNum = `PR-${payDate.replace(/[^0-9]/g, '').slice(0, 8) || '001'}`;

  if (isCashOnlyMode) {
    // CASH-ONLY / DISPENSARY ACCOUNTING RULES:
    // 1. If Section 280E applies (Cannabis), Wages directly related to product handling are Cost of Goods Sold (COGS),
    //    which ARE deductible under 280E, whereas admin wages are non-deductible expenses.
    // 2. Credit goes to 'Physical Vault Cash / Safe Reserve' instead of 'Operating Checking Account'.
    // 3. Includes Cash Count Envelope reconciliation reference.

    const wageAccount = isSection280ECompliant
      ? 'COGS - Direct Production & Dispensary Labor (280E Eligible)'
      : 'Cash Payroll Wages Expense';

    const cashVaultAccount = options.vaultAccountName || 'Vault Cash Safe Account (1010-Cash)';

    entries.push({
      date: payDate,
      refNumber: refNum,
      account: wageAccount,
      accountType: isSection280ECompliant ? 'Cost of Goods Sold' : 'Expense',
      debit: totalGross,
      credit: 0,
      memo: `Cash-Only Payroll Gross Wages [Period: ${payPeriod}]`,
      classOrLocation: isSection280ECompliant ? 'Dispensary Floor Ops' : 'Cash Operations'
    });

    if (totalTaxes > 0) {
      entries.push({
        date: payDate,
        refNumber: refNum,
        account: 'Payroll Tax Reserve Payable (2020)',
        accountType: 'Other Current Liability',
        debit: 0,
        credit: totalTaxes,
        memo: `Cash Payroll Estimated Tax Reserve [IRS/State Deposit]`,
        classOrLocation: 'Tax Escrow'
      });
    }

    if (totalDeductions > 0) {
      entries.push({
        date: payDate,
        refNumber: refNum,
        account: 'Employee Benefits & Cash Advances Payable',
        accountType: 'Other Current Liability',
        debit: 0,
        credit: totalDeductions,
        memo: `Cash Deductions & Withholdings`,
        classOrLocation: 'Payroll'
      });
    }

    entries.push({
      date: payDate,
      refNumber: refNum,
      account: cashVaultAccount,
      accountType: 'Bank',
      debit: 0,
      credit: totalNet,
      memo: `Physical Vault Cash Payroll Payout [Form 8300 Audited Envelope Distribution]`,
      classOrLocation: 'Vault Operations'
    });

  } else {
    // STANDARD ELECTRONIC / DIRECT DEPOSIT ACCOUNTING RULES
    entries.push({
      date: payDate,
      refNumber: refNum,
      account: 'Wages & Salaries Expense (6000)',
      accountType: 'Expense',
      debit: totalGross,
      credit: 0,
      memo: `Gross Payroll Expense [Period: ${payPeriod}]`
    });

    if (totalTaxes > 0) {
      entries.push({
        date: payDate,
        refNumber: refNum,
        account: 'Payroll Tax Liabilities (2100)',
        accountType: 'Other Current Liability',
        debit: 0,
        credit: totalTaxes,
        memo: `Employer & Employee Tax Withholdings`
      });
    }

    if (totalDeductions > 0) {
      entries.push({
        date: payDate,
        refNumber: refNum,
        account: 'Employee Benefits Payable (2150)',
        accountType: 'Other Current Liability',
        debit: 0,
        credit: totalDeductions,
        memo: `Health Insurance & 401(k) Deductions`
      });
    }

    entries.push({
      date: payDate,
      refNumber: refNum,
      account: 'Operating Checking Account (1000)',
      accountType: 'Bank',
      debit: 0,
      credit: totalNet,
      memo: `Direct Deposit Net Payroll Outflow on ${payDate}`
    });
  }

  return entries;
}

/**
 * Formats QuickBooks IIF (Intuit Interchange Format) for desktop import.
 */
export function formatQuickBooksIIF(
  employees: Employee[],
  options: QuickBooksExportOptions
): string {
  const entries = generateQuickBooksJournalEntries(employees, options);

  let iif = `!TRNS\tTRNSID\tTRNSTYPE\tDATE\tACCNT\tNAME\tAMOUNT\tDOCNUM\tMEMO\n`;
  iif += `!SPL\tSPLID\tTRNSTYPE\tDATE\tACCNT\tNAME\tAMOUNT\tDOCNUM\tMEMO\n`;
  iif += `!ENDTRNS\n`;

  const header = entries[0];
  iif += `TRNS\t\tGENERAL JOURNAL\t${header.date}\t${header.account}\t${options.companyName}\t${header.debit}\t${header.refNumber}\t${header.memo}\n`;

  for (let i = 1; i < entries.length; i++) {
    const e = entries[i];
    const amount = e.credit > 0 ? -e.credit : e.debit;
    iif += `SPL\t\tGENERAL JOURNAL\t${e.date}\t${e.account}\t${options.companyName}\t${amount}\t${e.refNumber}\t${e.memo}\n`;
  }

  iif += `ENDTRNS\n`;
  return iif;
}

/**
 * Formats QuickBooks Online (QBO) compatible CSV Journal Entry export.
 */
export function formatQuickBooksOnlineCSV(
  employees: Employee[],
  options: QuickBooksExportOptions
): string {
  const entries = generateQuickBooksJournalEntries(employees, options);

  const rows = [
    ['JournalNo', 'JournalDate', 'AccountName', 'AccountType', 'Debit', 'Credit', 'Description', 'ClassLocation', 'SpecialTaxNote'],
    ...entries.map(e => [
      e.refNumber,
      e.date,
      `"${e.account}"`,
      e.accountType,
      e.debit > 0 ? e.debit.toFixed(2) : '',
      e.credit > 0 ? e.credit.toFixed(2) : '',
      `"${e.memo}"`,
      e.classOrLocation ? `"${e.classOrLocation}"` : 'General',
      options.isCashOnlyMode 
        ? (options.isSection280ECompliant ? 'Cannabis 280E COGS Labor Deductible' : 'Cash Vault Audit Record')
        : 'Standard ACH/W2'
    ])
  ];

  if (options.isCashOnlyMode) {
    rows.push([]);
    rows.push(['# CASH-ONLY & VAULT PAYROLL AUDIT RECORD']);
    rows.push(['Employee Name', 'Payout Method', 'Gross ($)', 'Net Cash Envelope ($)', 'Form 8300 Audit Tag']);
    employees.forEach(emp => {
      let gross = emp.type === 'W-2 Salary' ? (emp.payRate + emp.bonus) : ((emp.hoursWorked * emp.payRate) + (emp.overtimeHours * emp.payRate * 1.5) + emp.bonus);
      let tax = (options.applyTaxWithholdings ?? true) ? (gross * emp.taxWithholdingPct) / 100 : 0;
      let net = Math.max(0, gross - tax - emp.deductions);
      rows.push([
        `"${emp.name}"`,
        'Physical Cash Envelope',
        gross.toFixed(2),
        net.toFixed(2),
        net >= 10000 ? 'IRS Form 8300 Cash Threshold Flagged' : 'Standard Cash Envelope'
      ]);
    });
  }

  return rows.map(r => r.join(',')).join('\n');
}

export class QuickBooksIntegration {
  /**
   * Formats current payroll entries and summary data into a CSV string compliant with QuickBooks Online import requirements.
   */
  static formatPayrollToCSV(employees: Employee[], options: QuickBooksExportOptions): string {
    return formatQuickBooksOnlineCSV(employees, options);
  }

  /**
   * Generates a high-level Payroll Summary CSV specifically structured for QuickBooks Online summary import.
   */
  static exportPayrollSummaryCSV(employees: Employee[], options: QuickBooksExportOptions): string {
    const { companyName, payPeriod, payDate, vaultAccountName, isCashOnlyMode, isSection280ECompliant } = options;
    const accountName = vaultAccountName || (isCashOnlyMode ? 'Vault Cash Safe Account' : 'Operating Payroll Checking Account');

    let totalGross = 0;
    let totalTax = 0;
    let totalDeductions = 0;
    let totalNet = 0;

    employees.forEach(emp => {
      const gross = emp.type === 'W-2 Salary' ? (emp.payRate + emp.bonus) : ((emp.hoursWorked * emp.payRate) + (emp.overtimeHours * emp.payRate * 1.5) + emp.bonus);
      const tax = (options.applyTaxWithholdings ?? true) ? (gross * emp.taxWithholdingPct) / 100 : 0;
      const net = Math.max(0, gross - tax - emp.deductions);

      totalGross += gross;
      totalTax += tax;
      totalDeductions += emp.deductions;
      totalNet += net;
    });

    const summaryRows = [
      ['QuickBooks Online - Payroll Summary Import File'],
      ['Company Name', `"${companyName}"`],
      ['Pay Period', `"${payPeriod}"`],
      ['Posting Date', payDate],
      ['Disbursement Account', `"${accountName}"`],
      ['Disbursement Mode', isCashOnlyMode ? 'Physical Cash Vault Envelopes' : 'Standard Direct Deposit ACH'],
      ['Tax Compliance Tag', isCashOnlyMode && isSection280ECompliant ? 'IRC §280E COGS Labor Deductible' : 'Standard W-2/1099 Payroll'],
      [],
      ['Summary Account Name', 'QuickBooks Account Type', 'Amount ($)', 'Memo / Description'],
      ['Gross Wages & Salaries Expense', 'Expense', totalGross.toFixed(2), `Total Gross Payroll for ${payPeriod}`],
      ['Payroll Tax Withholding Payable', 'Other Current Liability', (-totalTax).toFixed(2), 'Total Estimated Federal/State Tax Withholdings'],
      ['Employee Benefits & Deductions Payable', 'Other Current Liability', (-totalDeductions).toFixed(2), 'Total Voluntary Deductions & Benefits'],
      ['Net Payout Disbursement', 'Bank / Cash Vault', (-totalNet).toFixed(2), `Net Payroll Payout via ${accountName}`],
      [],
      ['# Employee Roster Payout Breakdown'],
      ['Employee ID', 'Employee Name', 'Role / Department', 'Type', 'Gross Pay ($)', 'Tax ($)', 'Deductions ($)', 'Net Payout ($)', 'Status'],
      ...employees.map(emp => {
        const gross = emp.type === 'W-2 Salary' ? (emp.payRate + emp.bonus) : ((emp.hoursWorked * emp.payRate) + (emp.overtimeHours * emp.payRate * 1.5) + emp.bonus);
        const tax = (options.applyTaxWithholdings ?? true) ? (gross * emp.taxWithholdingPct) / 100 : 0;
        const net = Math.max(0, gross - tax - emp.deductions);

        return [
          emp.id,
          `"${emp.name}"`,
          `"${emp.role}"`,
          emp.type,
          gross.toFixed(2),
          tax.toFixed(2),
          emp.deductions.toFixed(2),
          net.toFixed(2),
          isCashOnlyMode && net >= 10000 ? 'IRS Form 8300 Flag' : 'Cleared'
        ];
      })
    ];

    return summaryRows.map(row => row.join(',')).join('\n');
  }

  /**
   * Formats current payroll entries and summary data into a JSON structure compliant with QuickBooks Online API / import requirements.
   */
  static formatPayrollToJSON(employees: Employee[], options: QuickBooksExportOptions) {
    const entries = generateQuickBooksJournalEntries(employees, options);
    const { payDate, payPeriod, companyName, isCashOnlyMode } = options;

    const totalGross = entries.reduce((sum, e) => sum + e.debit, 0);

    return {
      BatchHeader: {
        CompanyName: companyName,
        PayPeriod: payPeriod,
        PostingDate: payDate,
        Mode: isCashOnlyMode ? 'CASH_VAULT_DISPENSARY' : 'STANDARD_ACH',
        TotalAmount: totalGross.toFixed(2),
        Currency: 'USD'
      },
      JournalEntries: entries.map((entry, idx) => ({
        LineId: idx + 1,
        JournalNo: entry.refNumber,
        PostingDate: entry.date,
        Account: {
          Name: entry.account,
          Type: entry.accountType
        },
        DebitAmount: entry.debit > 0 ? entry.debit : 0,
        CreditAmount: entry.credit > 0 ? entry.credit : 0,
        Description: entry.memo,
        Class: entry.classOrLocation || 'General'
      })),
      EmployeeSummaries: employees.map(emp => {
        const gross = emp.type === 'W-2 Salary' ? (emp.payRate + emp.bonus) : ((emp.hoursWorked * emp.payRate) + (emp.overtimeHours * emp.payRate * 1.5) + emp.bonus);
        const tax = (options.applyTaxWithholdings ?? true) ? (gross * emp.taxWithholdingPct) / 100 : 0;
        const net = Math.max(0, gross - tax - emp.deductions);

        return {
          EmployeeId: emp.id,
          Name: emp.name,
          Role: emp.role,
          Type: emp.type,
          GrossPay: gross,
          EstimatedTax: tax,
          Deductions: emp.deductions,
          NetPay: net,
          PaymentMethod: isCashOnlyMode ? 'Vault Cash Envelope' : 'Direct Deposit ACH'
        };
      })
    };
  }

  /**
   * Helper method to generate standard journal entries object array.
   */
  static generateJournalEntries(employees: Employee[], options: QuickBooksExportOptions) {
    return generateQuickBooksJournalEntries(employees, options);
  }

  /**
   * Initiates the QuickBooks Online OAuth 2.0 Handshake flow.
   * Fetches authorization URL from backend server and launches authorization popup directly.
   */
  static async initiateOAuthHandshake(): Promise<Window | null> {
    try {
      const res = await fetch('/api/quickbooks/auth-url');
      if (!res.ok) {
        throw new Error('Failed to retrieve QuickBooks OAuth authorization URL.');
      }
      const data = await res.json();
      if (data.url) {
        const authWindow = window.open(
          data.url,
          'quickbooks_oauth_popup',
          'width=600,height=720,scrollbars=yes,resizable=yes'
        );
        if (!authWindow) {
          alert('Popup blocked! Please allow popups for this site to connect your QuickBooks Online account.');
        }
        return authWindow;
      }
      return null;
    } catch (err) {
      console.error("QuickBooks OAuth Handshake Error:", err);
      throw err;
    }
  }

  /**
   * Checks current connection status with QuickBooks Online.
   */
  static async checkConnectionStatus() {
    try {
      const res = await fetch('/api/quickbooks/status');
      if (!res.ok) return { connected: false };
      const data = await res.json();
      return data.status || { connected: false };
    } catch {
      return { connected: false };
    }
  }

  /**
   * Disconnects active QuickBooks Online session.
   */
  static async disconnectQuickBooks() {
    try {
      const res = await fetch('/api/quickbooks/disconnect', { method: 'POST' });
      return await res.json();
    } catch (err) {
      console.error("Disconnect QuickBooks Error:", err);
      return { success: false };
    }
  }

  /**
   * Uploads formatted payroll CSV directly to the connected QuickBooks Online account.
   */
  static async uploadCSVDirectToQuickBooks(csvContent: string, options: QuickBooksExportOptions) {
    try {
      const res = await fetch('/api/quickbooks/upload-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          csvContent,
          companyName: options.companyName,
          payPeriod: options.payPeriod,
          payDate: options.payDate
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Direct QuickBooks upload failed.');
      }

      return await res.json();
    } catch (err: any) {
      console.error("QuickBooks Direct CSV Upload Error:", err);
      throw err;
    }
  }
}



/**
 * Calculates Physical Cash Bill Denominations ($100, $50, $20, $10, $5, $1) required to pay off cash payroll envelopes accurately.
 * Essential for dispensaries and cash-only business vault withdrawals.
 */
export function calculateCashDenominations(employees: Employee[], applyTaxWithholdings: boolean = true) {
  let totalNetCash = 0;

  employees.forEach(emp => {
    let gross = emp.type === 'W-2 Salary' ? (emp.payRate + emp.bonus) : ((emp.hoursWorked * emp.payRate) + (emp.overtimeHours * emp.payRate * 1.5) + emp.bonus);
    let tax = applyTaxWithholdings ? (gross * emp.taxWithholdingPct) / 100 : 0;
    let net = Math.max(0, gross - tax - emp.deductions);
    totalNetCash += net;
  });

  let remaining = Math.round(totalNetCash);

  const hundreds = Math.floor(remaining / 100);
  remaining %= 100;

  const fifties = Math.floor(remaining / 50);
  remaining %= 50;

  const twenties = Math.floor(remaining / 20);
  remaining %= 20;

  const tens = Math.floor(remaining / 10);
  remaining %= 10;

  const fives = Math.floor(remaining / 5);
  remaining %= 5;

  const ones = remaining;

  return {
    totalNetCash,
    hundreds,
    fifties,
    twenties,
    tens,
    fives,
    ones
  };
}
