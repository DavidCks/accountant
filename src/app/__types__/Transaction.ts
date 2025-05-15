import { CurrencyCode } from "./generated/Currencies";
export type Transaction = {
  id: string; // UUID
  message: string | null; // Description of the transaction
  user_id: string; // UUID from auth.users
  amount: string; // NUMERIC is returned as string in Supabase JS
  currency_code: CurrencyCode; // 'USD', 'BTC', etc.
  payment_type: "one_time" | "subscription";
  flow: "income" | "expense";
  participant: string | null; // Could be a name, vendor, etc.
  status: "done" | "pending"; // Could be a name, vendor, etc.
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
};
