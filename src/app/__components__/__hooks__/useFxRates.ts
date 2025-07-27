"use client";

import { useEffect, useState, useCallback } from "react";
import { CurrencyCode } from "@/app/__types__/generated/Currencies";
import { SB } from "@/app/_accountant-supabase_/client";

export type FxRate = {
  code: CurrencyCode;
  rateUSD: number;
};

export type FxRates = Record<CurrencyCode, FxRate>;

const CACHE_KEY = "fxRatesCache";
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

export function useFxRates() {
  const [rates, setRates] = useState<FxRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  const fetchRates = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as {
          timestamp: number;
          data: FxRates;
        };

        if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
          setRates(parsed.data);
          setLoading(false);
          return;
        }
      }

      const result = await SB.getExchangeRates();

      if (result.error) {
        throw new Error(
          result.error.message || "Unknown error fetching FX rates.",
        );
      }

      const fxRates = result.value as FxRates;
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          data: fxRates,
        }),
      );
      setRates(fxRates);
    } catch (err) {
      setError((err as Error).message);
      setRates(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  return {
    rates,
    loading,
    error,
    refetch: fetchRates,
  };
}
