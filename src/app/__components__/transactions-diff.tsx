"use client";

import { useReactToPrint } from "react-to-print";
import { useRef, useState } from "react";
import { Transaction } from "../__types__/Transaction";
import { SelectSearch } from "@/components/select-search";
import { currencies } from "@/app/__types__/generated/Currencies";
import { Label } from "@/components/ui/label";
import { useFxRates } from "./__hooks__/useFxRates";
import { Button } from "@/components/ui/button";

export default function TransactionsDiff({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const { rates, loading, error } = useFxRates();
  const [displayCurrency, setDisplayCurrency] = useState<string>("USD");
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "My Receipt",
  });

  if (transactions.length === 0)
    return (
      <p className="text-sm text-muted-foreground">No transactions selected.</p>
    );

  if (loading || !rates)
    return (
      <p className="text-sm text-muted-foreground">Loading exchange rates...</p>
    );

  if (error) return <p className="text-sm text-destructive">Error: {error}</p>;

  const convert = (amount: number, fromCode: string): number => {
    if (fromCode === displayCurrency) return amount;

    const fromRate = rates[fromCode as keyof typeof rates]?.rateUSD;
    const toRate = rates[displayCurrency as keyof typeof rates]?.rateUSD;

    if (!fromRate || !toRate) return 0;

    return (amount / fromRate) * toRate;
  };

  let incomeTotal = 0;
  let expenseTotal = 0;

  const rows = transactions.map((tx) => {
    const amount = parseFloat(tx.amount || "0");
    const description = tx.participant || tx.message || "(no description)";
    const convertedAmount = convert(amount, tx.currency_code);

    if (tx.flow === "income") incomeTotal += convertedAmount;
    else expenseTotal += convertedAmount;

    return (
      <div
        key={tx.id}
        className="flex justify-between items-center border-b py-2 text-sm"
      >
        <div className="flex-1">
          <div className="font-medium">{description}</div>

          {/* Optional conversion info */}
          {tx.currency_code !== displayCurrency && (
            <div className="text-xs text-muted-foreground">
              {amount} {tx.currency_code} → {convertedAmount.toFixed(6)}{" "}
              {displayCurrency}
            </div>
          )}

          {/* Message below description */}
          {tx.message && (
            <div className="text-xs text-muted-foreground italic mt-1">
              {tx.message}
            </div>
          )}
        </div>
        <div
          className={
            "text-sm font-semibold " +
            (tx.flow === "income" ? "text-green-600" : "text-red-600")
          }
        >
          {tx.flow === "income" ? "+" : "-"}
          {convertedAmount.toFixed(6)} {displayCurrency}
        </div>
      </div>
    );
  });

  const net = incomeTotal - expenseTotal;

  return (
    <>
      <div className="space-y-4 max-h-[50svh] my-4 overflow-auto">
        {/* Currency Selector */}
        <div className="grid gap-1">
          <Label className="pb-1" htmlFor="currency_code">
            Currency
          </Label>
          <SelectSearch<string>
            useRecents={true}
            name="currency_code"
            options={Object.keys(currencies)}
            value={displayCurrency}
            onChange={(val) => setDisplayCurrency(val)}
            getLabel={(v) => v}
            placeholder="Select currency"
            recentsStorageKey={"RecentCurrencyCodes"}
          />
        </div>

        <div id="printable-diff" className="print:p-16" ref={componentRef}>
          {/* Totals */}
          <div className="space-y-2 text-sm border-b pb-2">
            <div>Total Transactions: {transactions.length}</div>
            <div>
              Incoming:{" "}
              <span className="text-green-600 font-medium">
                {incomeTotal.toLocaleString("en-US", {
                  style: "currency",
                  currency: displayCurrency,
                  minimumFractionDigits: 6,
                  maximumFractionDigits: 6,
                })}
              </span>
            </div>
            <div>
              Outgoing:{" "}
              <span className="text-red-600 font-medium">
                {expenseTotal.toLocaleString("en-US", {
                  style: "currency",
                  currency: displayCurrency,
                  minimumFractionDigits: 6,
                  maximumFractionDigits: 6,
                })}
              </span>
            </div>
            <div className="font-semibold text-base">
              Net Difference:{" "}
              <span className={net >= 0 ? "text-green-600" : "text-red-600"}>
                {net.toLocaleString("en-US", {
                  style: "currency",
                  currency: displayCurrency,
                  minimumFractionDigits: 6,
                  maximumFractionDigits: 6,
                })}
              </span>
            </div>
          </div>

          {/* Line Items */}
          <div className="divide-y">{rows}</div>
        </div>
      </div>
      <Button variant="outline" onClick={handlePrint}>
        Print
      </Button>
    </>
  );
}
