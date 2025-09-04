import { Transaction } from "@/app/__types__/Transaction";
import { SB } from "@/app/_accountant-supabase_/client";
import { useState, useMemo, useEffect } from "react";

/** Convert all txs to the user's base currency (SB.convertTx decides target) */
export const useBaseCurrencyConvertedTxs = (txs: Transaction[]) => {
  const [converted, setConverted] = useState<Transaction[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Create a stable “signature” so we only reconvert when relevant fields change
  const sig = useMemo(
    () =>
      txs
        .map((t) => `${t.id}:${t.amount}:${t.currency_code}:${t.updated_at}`)
        .join("|"),
    [txs],
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      const errs: Record<string, string> = {};
      try {
        const results = await Promise.allSettled(
          txs.map(async (t) => {
            const res = await SB.convertTx(t);
            if (res.error || !res.value) {
              throw new Error(res.error?.message ?? "Conversion failed");
            }
            return res.value;
          }),
        );

        if (cancelled) return;

        const list: Transaction[] = txs.slice(); // preserve order
        results.forEach((r, i) => {
          if (r.status === "fulfilled") {
            list[i] = r.value;
          } else {
            // fallback to original and record error
            list[i] = txs[i];
            errs[txs[i].id] =
              r.reason instanceof Error ? r.reason.message : String(r.reason);
          }
        });

        setConverted(list);
        setErrors(errs);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sig, txs]);

  return { converted, loading, errors };
};
