import { Supabase } from "../../lib/__supabase__/supabase";
import { Transaction } from "../__types__/Transaction";
import { FReturn } from "../../lib/__types__/FReturn";

export class SB extends Supabase {
  constructor() {
    super(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpndnZ5d2JxcHFncHJteXN4ZGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNjcwMzgsImV4cCI6MjA2Mjc0MzAzOH0.EuS870MQOQVQXBOBOAFSHiL4zS7mefkEi1kVW3aInTo",
      "https://jgvvywbqpqgprmysxdcp.supabase.co"
    );
  }

  static async getTransactions(): Promise<FReturn<Transaction[]>> {
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
      value: transactions.data,
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
}

export const SBInstance = new SB();
