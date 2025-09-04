import { Transaction } from "@/app/__types__/Transaction";
import { AIController } from "../../ai-controller";
// ---------- TRANSACTIONAL (from bank/crypto txs with status==="done") ----------
export const TRANSACTION_INCOME_TYPES = [
  "Revenue/Sales",
  "Other operating income",
  "Interest income",
  "Other non-operating income",
] as const;
export type TransactionIncomeType = (typeof TRANSACTION_INCOME_TYPES)[number];

export const TRANSACTION_EXPENSE_TYPES = [
  "Materials/Goods purchased",
  "Personnel costs",
  "Premises costs",
  "Business (non-income) taxes",
  "Insurance/Contributions",
  "Special costs",
  "Vehicle costs (excl. VAT)",
  "Advertising/Travel expenses",
  "Outbound shipping/packaging costs",
  "Repairs/Maintenance",
  "Other operating costs",
  "Interest expense",
  "Other non-operating expense",
  "Account class 5/6",
  // Option A (cash-based): include this line if you treat tax prepayments as the BWA tax number.
  // "Taxes on income and earnings",
] as const;
export type TransactionExpenseType = (typeof TRANSACTION_EXPENSE_TYPES)[number];

export type TransactionType = TransactionIncomeType | TransactionExpenseType;

// ---------- DERIVED (non-transaction monthly inputs) ----------
export const DERIVED_INCOME_TYPES = [
  "Change in inventories",
  "Capitalized own work",
  "Credited imputed costs", // offsets imputed expenses in management view
] as const;
export type DerivedIncomeType = (typeof DERIVED_INCOME_TYPES)[number];

export const DERIVED_EXPENSE_TYPES = [
  "Depreciation",
  "Imputed interest", // optional, management-only
  // Option B (modeled): include here if you model taxes instead of summing prepayments.
  "Taxes on income and earnings",
] as const;
export type DerivedExpenseType = (typeof DERIVED_EXPENSE_TYPES)[number];

export type DerivedType = DerivedIncomeType | DerivedExpenseType;

// ---------- Everything you might display in the BWA ----------
export const ALL_BWA_TYPES = [
  ...TRANSACTION_INCOME_TYPES,
  ...TRANSACTION_EXPENSE_TYPES,
  ...DERIVED_INCOME_TYPES,
  ...DERIVED_EXPENSE_TYPES,
] as const;
export type BwaType = (typeof ALL_BWA_TYPES)[number];

export const bwaLabels = {
  // ------- Pure labels
  totalOutput: "Total output",
  grossProfit: "Gross profit",
  operatingGrossProfit: "Operating gross profit",
  typesOfCosts: "Types of costs:",
  totalOperatingCosts: "Total operating costs",
  totalNonOperatingCosts: "Total non-operating costs",
  operatingResult: "Operating result",
  neutralExpense: "Non-operating expense",
  neutralIncome: "Non-operating income",
  profitBeforeTax: "Profit before tax (PBT)",
  preliminaryResult: "Preliminary (provisional) result",

  /** Revenue from core services/products billed to customers.
   *  Net of VAT; reduce for credit notes/returns. Cash-effective for EÜR. */
  revenueSales: TRANSACTION_INCOME_TYPES[0],

  /** Operating income not from core sales (e.g., refunds, operating grants,
   *  rental/usage fees). Excludes interest. Net of VAT. */
  otherOperatingIncome: TRANSACTION_INCOME_TYPES[1],

  /** Interest earned (bank interest, term deposits; staking if your policy treats it as interest).
   *  Usually shown in the neutral/financial result. */
  interestIncome: TRANSACTION_INCOME_TYPES[2],

  /** Non-operating income (e.g., insurance payouts, one-off gains, truly non-core inflows). */
  otherNonOperatingIncome: TRANSACTION_INCOME_TYPES[3],

  // ------- Expenses (transactional)

  /** Materials/merchandise purchased (net of VAT). For service businesses you may
   *  use this for external services/subcontractors if that’s your policy. */
  materialsGoodsPurchased: TRANSACTION_EXPENSE_TYPES[0],

  /** Personnel costs: wages/salaries and employer social charges.
   *  (Contractors may be here or under external services per your policy.) */
  personnelCosts: TRANSACTION_EXPENSE_TYPES[1],

  /** Premises costs: rent, utilities, cleaning, facility ops.
   *  Exclude capital improvements (CAPEX). */
  premisesCosts: TRANSACTION_EXPENSE_TYPES[2],

  /** Operating taxes and fees (non-income): property tax, vehicle tax, customs, licenses.
   *  Excludes VAT and income/earnings taxes. */
  businessNonIncomeTaxes: TRANSACTION_EXPENSE_TYPES[3],

  /** Insurance premiums and professional/association contributions/memberships. */
  insuranceContributions: TRANSACTION_EXPENSE_TYPES[4],

  /** Special/atypical operating costs that don’t fit other buckets. */
  specialCosts: TRANSACTION_EXPENSE_TYPES[5],

  /** Vehicle costs (excl. VAT): fuel, maintenance, leasing, road charges.
   *  Excludes vehicle purchase price (CAPEX). */
  vehicleCostsExclVAT: TRANSACTION_EXPENSE_TYPES[6],

  /** Advertising/marketing and business travel (flights, hotels, per diem). */
  advertisingTravelExpenses: TRANSACTION_EXPENSE_TYPES[7],

  /** Outbound logistics for sales: shipping, postage, packaging, couriers. */
  outboundShippingPackagingCosts: TRANSACTION_EXPENSE_TYPES[8],

  /** Repairs and maintenance (non-capitalized upkeep). */
  repairsMaintenance: TRANSACTION_EXPENSE_TYPES[9],

  /** Other operating costs (bank fees, office supplies, SaaS/subscriptions, telecom, etc.). */
  otherOperatingCosts: TRANSACTION_EXPENSE_TYPES[10],

  /** Finance cost: loan/overdraft interest and similar charges (excluding principal). */
  interestExpense: TRANSACTION_EXPENSE_TYPES[11],

  /** Non-operating expense (fines/penalties, extraordinary losses, truly non-core). */
  otherNonOperatingExpense: TRANSACTION_EXPENSE_TYPES[12],

  /** Accounts that need assignment (should never be non-0) */
  accountClass56: TRANSACTION_EXPENSE_TYPES[13],

  // ------- Derived income (non-transaction)

  /** Change in inventories of finished goods & work-in-progress (non-cash).
   *  Positive if stock/WIP increased, negative if it decreased.
   *  Typically 0 for EÜR/service businesses. */
  changeInInventories: DERIVED_INCOME_TYPES[0],

  /**
   * Capitalized own work (Aktivierte Eigenleistungen)
   *
   * Work you performed for your own business (not billed to a customer) that
   * meets capitalization criteria and is recognized as an asset. In the BWA it
   * appears on the income side (non-cash) and increases Total output; the cost
   * is then expensed over time via depreciation/amortization.
   *
   * Measure at production cost (e.g., direct labor at cost, directly
   * attributable materials/services, plus allowed overhead). Do NOT include any
   * margin. Typically 0 for cash-basis/EÜR freelancers unless you intentionally
   * capitalize internal development.
   */
  capitalizedOwnWork: DERIVED_INCOME_TYPES[1],

  /** Neutral income used to offset imputed (opportunity) costs you included elsewhere,
   *  so management PBT stays comparable to your statutory view. 0 if you don’t use imputed costs. */
  creditedImputedCosts: DERIVED_INCOME_TYPES[2],

  // ------- Derived expense (non-transaction)

  /** Depreciation/amortization of fixed and intangible assets (non-cash),
   *  typically recognized monthly. */
  depreciation: DERIVED_EXPENSE_TYPES[0],

  /** Imputed (opportunity) interest on own capital or foregone yield (management view only);
   *  if included, offset via creditedImputedCosts. */
  imputedInterest: DERIVED_EXPENSE_TYPES[1],

  incomeEarningsTaxes: DERIVED_EXPENSE_TYPES[2],
};
// Example classification result for real transactions
type ClassifiedTransaction = {
  tx: Transaction;
  txType: TransactionType; // only transactional types here
};

export type BWATableType = {
  [year: string]: {
    [month: string]: {
      income: Record<TransactionIncomeType, number>;
      expense: Record<TransactionExpenseType, number>;
      derivedIncome: Record<DerivedIncomeType, number>;
      derivedExpense: Record<DerivedExpenseType, number>;
      txs: ClassifiedTransaction[];
    };
  };
};

export class BWATable {
  private _txs: Transaction[];

  constructor(txs: Transaction[]) {
    this._txs = txs;
  }

  private async retry<T>(fn: () => T, delay: number) {
    return new Promise<T>((res, rej) => {
      setTimeout(async () => {
        try {
          const fnres = await fn();
          res(fnres);
        } catch (e) {
          rej(e);
        }
      }, delay);
    });
  }

  private async _classifyTxInternal(
    tx: Transaction,
    cache: boolean = true,
  ): Promise<TransactionType> {
    const cacheKey = `classified-${tx.id}-${tx.currency_code}`;
    const cachedClassification = localStorage.getItem(cacheKey);
    if (cachedClassification && cache) {
      return cachedClassification as TransactionType;
    }
    const classificationTypes =
      tx.flow === "income"
        ? TRANSACTION_INCOME_TYPES
        : TRANSACTION_EXPENSE_TYPES;
    const classification = await AIController.chatSend({
      model: "prompt",
      input:
        "These are the possible classifications for this transaction:\n" +
        classificationTypes.join(", ") +
        `;\n\n` +
        `This is the transaction message:\n` +
        `${tx.message};\n\n` +
        `This is the participating party:\n` +
        `${tx.participant};\n` +
        `Based on the transaction message, classify the transaction by choosing one of the transaction types.\n` +
        `Keep in mind that the transaction is part of a freelancers revenue flow. Most transactions relate to the completion of a service for the client, ` +
        `meaning most transactions will be Revenue/Income. Especially transactions mentioning a product name, 'features' or anything else resembling a feature ` +
        `addition or a bug fix are to be classified as Revenue/Sales.\n` +
        `Answer only with the classification!`,
    });
    if (!classification.ok) {
      console.warn("AI classification failed. retrying...");
      return await this.retry(() => this._classifyTxInternal(tx), 1000);
    }
    const cleanClassification = classification.output.trim();
    if (
      !(classificationTypes as any as string[]).includes(cleanClassification)
    ) {
      console.warn(
        "AI classification returned something other than a classification. retrying...",
      );
      return await this.retry(() => this._classifyTxInternal(tx), 1000);
    }
    localStorage.setItem(cacheKey, cleanClassification);
    return cleanClassification as TransactionType;
  }

  private static _classifyInflight = new Map<
    string,
    Promise<TransactionType>
  >();

  private async _classifyTx(
    tx: Transaction,
    cache = true,
  ): Promise<TransactionType> {
    const key = `${tx.id}-${tx.currency_code}`;
    const existing = BWATable._classifyInflight.get(key);
    if (existing) return existing; // reuse in-flight promise

    const p = this._classifyTxInternal(tx, cache).finally(() =>
      BWATable._classifyInflight.delete(key),
    );

    BWATable._classifyInflight.set(key, p);
    return p;
  }

  private async _classifyTxs(
    txs: Transaction[],
    cache: boolean = true,
  ): Promise<ClassifiedTransaction[]> {
    const classifiedTxs = [] as ClassifiedTransaction[];
    for (let i = 0; i < txs.length; i++) {
      const tx = txs[i];
      const classification = await this._classifyTx(tx, cache);
      classifiedTxs.push({ tx: tx, txType: classification });
    }
    return classifiedTxs;
  }

  private _getTxsByYear(txs: ClassifiedTransaction[]) {
    const txsByYear = {} as { [year: string]: ClassifiedTransaction[] };
    for (let i = 0; i < txs.length; i++) {
      const tx = txs[i];
      const txYear = new Date(tx.tx.created_at).getFullYear();
      const currentTxsForYear = txsByYear[String(txYear)];
      if (currentTxsForYear) {
        currentTxsForYear.push(tx);
      } else {
        Object.assign(txsByYear, { [String(txYear)]: [tx] });
      }
    }
    return txsByYear;
  }

  private _getTxsByMonth(txs: ClassifiedTransaction[]) {
    const txsByMonth = {} as { [month: string]: ClassifiedTransaction[] };
    for (let i = 0; i < txs.length; i++) {
      const tx = txs[i];
      const txMonth = new Date(tx.tx.created_at).getMonth() + 1; // <-- add +1
      const txMonthString = String(txMonth).padStart(2, "0"); // 01–12
      const currentTxsForMonth = txsByMonth[txMonthString];
      if (currentTxsForMonth) {
        currentTxsForMonth.push(tx);
      } else {
        Object.assign(txsByMonth, { [txMonthString]: [tx] });
      }
    }
    return txsByMonth;
  }

  private _getBWAData(txs: ClassifiedTransaction[]) {
    const income: Record<TransactionIncomeType, number> = Object.fromEntries(
      TRANSACTION_INCOME_TYPES.map((t) => [t, 0]),
    ) as Record<TransactionIncomeType, number>;

    const expense: Record<TransactionExpenseType, number> = Object.fromEntries(
      TRANSACTION_EXPENSE_TYPES.map((t) => [t, 0]),
    ) as Record<TransactionExpenseType, number>;

    const derivedIncome: Record<DerivedIncomeType, number> = Object.fromEntries(
      DERIVED_INCOME_TYPES.map((t) => [t, 0]),
    ) as Record<DerivedIncomeType, number>;

    const derivedExpense: Record<DerivedExpenseType, number> =
      Object.fromEntries(DERIVED_EXPENSE_TYPES.map((t) => [t, 0])) as Record<
        DerivedExpenseType,
        number
      >;

    // Tally transaction-based amounts
    txs.forEach((tx) => {
      if ((TRANSACTION_INCOME_TYPES as readonly string[]).includes(tx.txType)) {
        income[tx.txType as TransactionIncomeType] += parseFloat(tx.tx.amount);
      } else if (
        (TRANSACTION_EXPENSE_TYPES as readonly string[]).includes(tx.txType)
      ) {
        expense[tx.txType as TransactionExpenseType] += parseFloat(
          tx.tx.amount,
        );
      }
      // No classification for derived types here — those come from external inputs
    });
    return {
      income,
      expense,
      derivedIncome,
      derivedExpense,
    };
  }

  public async build(cache: boolean = true) {
    const table = {} as BWATableType;
    const classifiedTxs = await this._classifyTxs(this._txs, cache);
    const txsByYear = this._getTxsByYear(classifiedTxs);
    Object.entries(txsByYear).forEach(([year, ytxs]) => {
      table[year] = {};
      const txsByMonth = this._getTxsByMonth(ytxs);
      const bwaedMonthData = Object.entries(txsByMonth).map(([month, mtxs]) => {
        const bwaData = this._getBWAData(mtxs);
        return {
          [month]: {
            txs: mtxs,
            ...bwaData,
          },
        };
      });
      bwaedMonthData.forEach((d) => {
        const month = Object.keys(d)[0]!;
        table[year][month] = Object.values(d)[0]!;
      });
    });
    return table;
  }
}
