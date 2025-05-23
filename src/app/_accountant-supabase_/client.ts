import { Supabase } from "../../lib/__supabase__/supabase";
import { Transaction } from "../__types__/Transaction";
import { FReturn } from "../../lib/__types__/FReturn";
import { CurrencyCode } from "../__types__/generated/Currencies";
import { User } from "@supabase/supabase-js";

export class SB extends Supabase {
  constructor() {
    super(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpndnZ5d2JxcHFncHJteXN4ZGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNjcwMzgsImV4cCI6MjA2Mjc0MzAzOH0.EuS870MQOQVQXBOBOAFSHiL4zS7mefkEi1kVW3aInTo",
      "https://jgvvywbqpqgprmysxdcp.supabase.co"
    );
  }

  static async getTransactions(): Promise<
    FReturn<{ txs: Transaction[]; user: User }>
  > {
    await Supabase.ensureInitialized();
    const user = await Supabase.getCurrentUser();
    if (user.error) {
      return {
        value: null,
        error: user.error,
      };
    }
    const transactions = await Supabase.client
      .from("transactions")
      .select("*")
      .eq("user_id", user.value.id);
    if (transactions.error) {
      return {
        value: null,
        error: {
          message: transactions.error.message,
          code: transactions.error.code,
        },
      };
    }
    return {
      value: { txs: transactions.data, user: user.value },
      error: null,
    };
  }

  static async addTransaction(transaction: {
    amount: Transaction["amount"];
    currency_code: Transaction["currency_code"];
    payment_type: Transaction["payment_type"];
    flow: Transaction["flow"];
    participant: Transaction["participant"];
    status: Transaction["status"];
    message: Transaction["message"];
  }): Promise<FReturn<true>> {
    await Supabase.ensureInitialized();
    const user = await Supabase.getCurrentUser();
    if (user.error) {
      return {
        value: null,
        error: user.error,
      };
    }
    const result = await Supabase.client
      .from("transactions")
      .insert({ ...transaction, user_id: user.value.id });
    if (result.error) {
      return {
        value: null,
        error: {
          message: result.error.message,
          code: result.error.code,
        },
      };
    }
    return {
      value: true,
      error: null,
    };
  }

  static async updateTransaction(
    transaction: Transaction
  ): Promise<FReturn<true>> {
    await Supabase.ensureInitialized();
    const user = await Supabase.getCurrentUser();
    if (user.error) {
      return {
        value: null,
        error: user.error,
      };
    }
    const result = await Supabase.client
      .from("transactions")
      .update(transaction)
      .eq("user_id", user.value.id)
      .eq("id", transaction.id);
    if (result.error) {
      return {
        value: null,
        error: {
          message: result.error.message,
          code: result.error.code,
        },
      };
    }
    return {
      value: true,
      error: null,
    };
  }

  static async deleteTransaction(
    transaction: Transaction
  ): Promise<FReturn<true>> {
    await Supabase.ensureInitialized();
    const user = await Supabase.getCurrentUser();
    if (user.error) {
      return {
        value: null,
        error: user.error,
      };
    }
    const result = await Supabase.client
      .from("transactions")
      .delete()
      .eq("user_id", user.value.id)
      .eq("id", transaction.id);
    if (result.error) {
      return {
        value: null,
        error: {
          message: result.error.message,
          code: result.error.code,
        },
      };
    }
    return {
      value: true,
      error: null,
    };
  }

  static async getExchangeRates(): Promise<
    FReturn<{
      [code: string]: {
        code: CurrencyCode;
        rateUSD: number;
      };
    }>
  > {
    await Supabase.ensureInitialized();
    const user = await Supabase.getCurrentUser();
    if (user.error) {
      return {
        value: null,
        error: user.error,
      };
    }
    const result = await Supabase.client.from("currencies").select("*");
    if (result.error) {
      return {
        value: null,
        error: {
          message: result.error.message,
          code: result.error.code,
        },
      };
    }
    const data = result.data.map((item) => ({
      [item.code as string]: {
        code: item.code as CurrencyCode,
        rateUSD: item.exchange_rate as number,
      },
    }));
    const rates = data.reduce((acc, item) => {
      const key = Object.keys(item)[0];
      acc[key] = item[key];
      return acc;
    }, {} as { [code: string]: { code: CurrencyCode; rateUSD: number } });
    return {
      value: rates,
      error: null,
    };
  }
}

export const SBInstance = new SB();
