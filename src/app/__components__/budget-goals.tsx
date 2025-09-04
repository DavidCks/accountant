"use client";

import { FC, useEffect, useState } from "react";
import { Transaction } from "@/app/__types__/Transaction";
import { Progress } from "@/components/ui/progress"; // shadcn/ui Progress
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BWATable } from "./utils/bwa/bwa-table";
import { SB } from "../_accountant-supabase_/client";
import { useBaseCurrencyConvertedTxs } from "./__hooks__/useBaseCurrencyConvertedTxs";
import { CurrencyCode } from "../__types__/generated/Currencies";
import { Loader2 } from "lucide-react";

const BudgetGoals: FC<{ txs: Transaction[] }> = ({ txs }) => {
  const { converted: convertedTxs, loading } = useBaseCurrencyConvertedTxs(txs);
  const [budgetGoal, setBudgetGoal] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [baseCurrency, setBaseCurrency] = useState<CurrencyCode | null>(null);
  const [monthlyData, setMonthlyData] = useState<
    { month: string; profit: number }[]
  >([]);

  // Load saved budget
  useEffect(() => {
    SB.getBaseCurrency().then((bc) => setBaseCurrency(bc));
    const raw = localStorage.getItem("monthly_budget_goal");
    if (raw) {
      setBudgetGoal(Number(raw));
      setInputValue(raw);
    }
  }, []);

  // Build monthly data
  useEffect(() => {
    (async () => {
      if (!convertedTxs || !convertedTxs.length) return;
      const bwa = new BWATable(convertedTxs);
      const table = await bwa.build();

      const results: { month: string; profit: number }[] = [];
      for (const year of Object.keys(table)) {
        for (const month of Object.keys(table[year])) {
          const mData = table[year][month];
          let expenses = 0;
          let income = 0;
          for (const t of mData.txs) {
            if (t.tx.flow === "expense") {
              expenses += parseFloat(t.tx.amount);
            } else if (t.tx.flow === "income") {
              income += parseFloat(t.tx.amount);
            }
          }
          results.push({
            month: `${year}-${month}`,
            profit: income - expenses,
          });
        }
      }

      setMonthlyData(results.sort((a, b) => a.month.localeCompare(b.month)));
    })();
  }, [loading, convertedTxs]);

  const saveBudget = async () => {
    const val = Number(inputValue);
    if (isNaN(val) || val <= 0) return;
    setBudgetGoal(val);
    localStorage.setItem("monthly_budget_goal", String(val));
    await SB.updateUserMetadata("monthly_budget_goal", String(val));
  };

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Set monthly budget goal"
        />
        <span>
          {baseCurrency ? baseCurrency : <Loader2 className="animate-spin" />}
        </span>
        <Button onClick={saveBudget}>Save</Button>
      </div>

      {budgetGoal &&
        monthlyData.map(({ month, profit }) => {
          const pct = Math.min((profit / budgetGoal) * 100, 100);
          const overBudget = profit > budgetGoal;
          return (
            <div key={month} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{month}</span>
                <span>
                  {profit.toFixed(2)} / {budgetGoal.toFixed(2)}
                </span>
              </div>
              <Progress
                value={pct}
                className="h-3 [&>div]:transition-all [&>div]:rounded-full
                           [&>div]:bg-emerald-500 dark:[&>div]:bg-emerald-400"
                {...(overBudget && {
                  className:
                    "h-3 [&>div]:transition-all [&>div]:rounded-full " +
                    "[&>div]:bg-red-500 dark:[&>div]:bg-red-400",
                })}
              />
            </div>
          );
        })}
    </div>
  );
};

export default BudgetGoals;
