"use client";
import { useCallback, useEffect, useState } from "react";
import { Transaction } from "../__types__/Transaction";
import { TimePoints } from "./utils/time";
import { Button } from "@/components/ui/button";
import { CurrencyCode } from "../__types__/generated/Currencies";
import { SB } from "../_accountant-supabase_/client";

const TransactionsSum = ({ transactions }: { transactions: Transaction[] }) => {
  const [txSumDay, setTxSumDay] = useState<Transaction[] | null>(null);
  const [txSum24h, setTxSum24h] = useState<Transaction[] | null>(null);
  const [txSumWeek, setTxSumWeek] = useState<Transaction[] | null>(null);
  const [txSum7Day, setTxSum7Day] = useState<Transaction[] | null>(null);
  const [txSum14Day, setTxSum14Day] = useState<Transaction[] | null>(null);
  const [txSumMonth, setTxSumMonth] = useState<Transaction[] | null>(null);
  const [exchangeRates, setExchangeRates] = useState<{
    [code: string]: {
      code: CurrencyCode;
      rateEUR: number;
    };
  }>({});

  const [selectedTxSum, setSelectedTxSum] = useState<number | null>(null);
  const [selectedRange, setSelectedRange] = useState<
    "day" | "24h" | "week" | "7d" | "14d" | "month" | "all"
  >("month");

  const handleTxSumClick = useCallback(
    (rates?: {
      [code: string]: {
        code: CurrencyCode;
        rateEUR: number;
      };
    }) => {
      rates = rates ?? exchangeRates;
      const nextRange = (
        {
          day: "24h",
          "24h": "week",
          week: "7d",
          "7d": "14d",
          "14d": "month",
          month: "all",
          all: "day",
        } as const
      )[selectedRange];
      const nextTransactions = (
        {
          day: txSumDay,
          "24h": txSum24h,
          week: txSumWeek,
          "7d": txSum7Day,
          "14d": txSum14Day,
          month: txSumMonth,
          all: transactions,
        } as const
      )[nextRange];
      const nextTransactionSum = nextTransactions!.reduce((sum, tx) => {
        const rateEUR = rates?.[tx.currency_code]?.rateEUR;
        if (!rateEUR) {
          console.error(
            `No exchange rate found for currency code ${tx.currency_code}`
          );
          return sum;
        }
        return sum + parseFloat(tx.amount) / rateEUR;
      }, 0);
      setSelectedTxSum(nextTransactionSum);
      setSelectedRange(nextRange);
    },
    [
      selectedRange,
      txSumDay,
      txSum24h,
      txSumWeek,
      txSum7Day,
      txSum14Day,
      txSumMonth,
      transactions,
      exchangeRates,
    ]
  );

  useEffect(() => {
    const now = new Date().getTime();
    const sumByDateRange = (start: number, end: number) => {
      const txs = transactions.filter((tx) => {
        const txISODate = new Date(tx.created_at);
        const txMs = TimePoints.isoToLocalMs(txISODate.toISOString());
        return txMs >= start && txMs <= end;
      });
      return txs;
    };

    setTxSumDay(sumByDateRange(TimePoints.dayStartMS(), now));
    setTxSum24h(sumByDateRange(TimePoints.h24AgoMS(), now));
    setTxSumWeek(sumByDateRange(TimePoints.weekStartMS(), now));
    setTxSum7Day(sumByDateRange(TimePoints.d7AgoMS(), now));
    setTxSum14Day(sumByDateRange(TimePoints.d14AgoMS(), now));
    setTxSumMonth(sumByDateRange(TimePoints.monthStartMS(), now));
    SB.getExchangeRates().then((result) => {
      if (result.error) {
        console.error("Error fetching exchange rates:", result.error);
        return;
      }
      setExchangeRates(result.value);
      handleTxSumClick(result.value);
    });
  }, [transactions]);

  const loading =
    !exchangeRates ||
    txSumDay === null ||
    txSum24h === null ||
    txSumWeek === null ||
    txSum7Day === null ||
    txSum14Day === null ||
    txSumMonth === null ||
    selectedTxSum === null;

  return (
    <Button
      variant={"outline"}
      onClick={
        !loading
          ? () => {
              handleTxSumClick();
            }
          : undefined
      }
    >
      {loading ? (
        <span className="animate animate-pulse">
          <div className="rounded-full h-2 w-2 dark:bg-white bg-black"></div>
        </span>
      ) : (
        <>
          <span className="text-lg font-bold">
            {selectedTxSum?.toLocaleString("de-DE", {
              style: "currency",
              currency: "EUR",
            })}
          </span>
          <span className="text-sm text-gray-500 pt-1">{selectedRange}</span>
        </>
      )}
    </Button>
  );
};

export default TransactionsSum;
