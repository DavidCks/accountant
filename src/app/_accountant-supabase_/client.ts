import { Supabase } from "../../lib/__supabase__/supabase";
import { Transaction } from "../__types__/Transaction";
import { FReturn } from "../../lib/__types__/FReturn";
import { CurrencyCode } from "../__types__/generated/Currencies";
import { User } from "@supabase/supabase-js";
import { jsPDF } from "jspdf";
import { IDB } from "@/lib/__storage__/idb";
export class SB extends Supabase {
  constructor() {
    super(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpndnZ5d2JxcHFncHJteXN4ZGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNjcwMzgsImV4cCI6MjA2Mjc0MzAzOH0.EuS870MQOQVQXBOBOAFSHiL4zS7mefkEi1kVW3aInTo",
      "https://jgvvywbqpqgprmysxdcp.supabase.co",
    );
  }

  static async getTransactions(): Promise<
    FReturn<{ txs: Transaction[]; user: User }>
  > {
    Supabase.ensureInitialized();
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
    Supabase.ensureInitialized();
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
    transaction: Transaction,
  ): Promise<FReturn<true>> {
    Supabase.ensureInitialized();
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
    transaction: Transaction,
  ): Promise<FReturn<true>> {
    Supabase.ensureInitialized();
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

  static async uploadTransactionAttachment(
    file: File,
    transactionId: string,
  ): Promise<FReturn<{ path: string }>> {
    Supabase.ensureInitialized();

    const user = await Supabase.getCurrentUser();
    if (user.error) {
      return {
        value: null,
        error: user.error,
      };
    }

    if (file.size > 10 * 1024 * 1024) {
      return {
        value: null,
        error: {
          message: "File size exceeds 10MB limit.",
          code: "file_too_large",
        },
      };
    }

    // Convert to PDF if needed
    let pdfBlob: Blob;
    if (file.type === "application/pdf") {
      pdfBlob = file;
    } else {
      const imageBitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(imageBitmap, 0, 0);

      const imgDataUrl = canvas.toDataURL("image/jpeg");

      const pdf = new jsPDF({
        orientation:
          imageBitmap.width > imageBitmap.height ? "landscape" : "portrait",
        unit: "px",
        format: [imageBitmap.width, imageBitmap.height],
      });
      pdf.addImage(
        imgDataUrl,
        "JPEG",
        0,
        0,
        imageBitmap.width,
        imageBitmap.height,
      );
      const pdfArrayBuffer = pdf.output("arraybuffer");
      pdfBlob = new Blob([pdfArrayBuffer], { type: "application/pdf" });
    }

    const filePath = `${user.value.id}/${transactionId}/${transactionId}.pdf`;

    const { error } = await Supabase.client.storage
      .from("attachments")
      .upload(filePath, pdfBlob, {
        upsert: true,
        contentType: "application/pdf",
      });

    if (error) {
      return {
        value: null,
        error: {
          message: `${error.message}`,
          code: `${error.cause || "upload_failed"}`,
        },
      };
    }

    await IDB.deleteBlob(transactionId);
    await IDB.unmarkNoAttachment(transactionId);
    await IDB.storeBlob(transactionId, pdfBlob);

    return {
      value: { path: filePath },
      error: null,
    };
  }

  static async getTransactionAttachmentUrl(
    tx: Transaction,
  ): Promise<string | null> {
    Supabase.ensureInitialized();

    if (await IDB.hasNoAttachment(tx.id)) {
      return null;
    }

    const cachedBlob = await IDB.getBlob(tx.id);
    if (cachedBlob) {
      return URL.createObjectURL(cachedBlob);
    }

    const user = await Supabase.getCurrentUser();
    if (user.error) return null;

    const filePath = `${user.value.id}/${tx.id}/${tx.id}.pdf`;

    const { data, error } = await Supabase.client.storage
      .from("attachments")
      .download(filePath);

    if (error || !data) {
      await IDB.markNoAttachment(tx.id);
      return null;
    }

    const blob = data;
    await IDB.storeBlob(tx.id, blob);

    return URL.createObjectURL(blob);
  }

  static async getExchangeRates(): Promise<
    FReturn<{
      [code: string]: {
        code: CurrencyCode;
        rateUSD: number;
      };
    }>
  > {
    Supabase.ensureInitialized();
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
    const rates = data.reduce(
      (acc, item) => {
        const key = Object.keys(item)[0];
        acc[key] = item[key];
        return acc;
      },
      {} as { [code: string]: { code: CurrencyCode; rateUSD: number } },
    );
    return {
      value: rates,
      error: null,
    };
  }
  static async fetchHistoricalExchangeRate(
    code: string,
    date: string, // Format: 'YYYY-MM-DD'
  ): Promise<
    FReturn<{ code: CurrencyCode; rateUSD: number; recorded_at: string }>
  > {
    Supabase.ensureInitialized();

    const targetDate = new Date(date);
    const startDate = new Date(targetDate);
    startDate.setDate(startDate.getDate() - 10);

    const endDate = new Date(targetDate);
    endDate.setDate(endDate.getDate() + 10);

    const result = await Supabase.client
      .from("currency_exchange_history")
      .select("code, exchange_rate, recorded_at")
      .eq("code", code)
      .gte("recorded_at", startDate.toISOString())
      .lte("recorded_at", endDate.toISOString());

    if (result.error || !result.data || result.data.length === 0) {
      return {
        value: null,
        error: {
          message: `No exchange rate found for ${code} near ${date}`,
          code: "not_found",
        },
      };
    }

    const closest = result.data.reduce((prev, curr) => {
      const prevDiff = Math.abs(
        new Date(prev.recorded_at).getTime() - targetDate.getTime(),
      );
      const currDiff = Math.abs(
        new Date(curr.recorded_at).getTime() - targetDate.getTime(),
      );
      return currDiff < prevDiff ? curr : prev;
    });

    return {
      value: {
        code: closest.code as CurrencyCode,
        rateUSD: closest.exchange_rate as number,
        recorded_at: closest.recorded_at,
      },
      error: null,
    };
  }

  private static conversionQueue: Promise<void> = Promise.resolve();
  private static readonly cachePrefix = "conversionCache:";

  private static getCacheKey(tx: Transaction, to: CurrencyCode) {
    return `${this.cachePrefix}${tx.id}${tx.updated_at}|${tx.currency_code}->${to}`;
  }

  static async convertTx(
    tx: Transaction,
    targetCode: CurrencyCode,
  ): Promise<FReturn<Transaction>> {
    Supabase.ensureInitialized();

    if (tx.currency_code === targetCode) {
      return { value: tx, error: null };
    }

    const cacheKey = this.getCacheKey(tx, targetCode);
    const cachedRaw = localStorage.getItem(cacheKey);

    if (cachedRaw) {
      try {
        const parsed = JSON.parse(cachedRaw);
        if (parsed?.value) {
          // Restore metadata if present
          if (parsed.meta?.rateOffsetDays !== undefined) {
            Object.defineProperty(parsed.value, "__rateOffsetDays", {
              value: parsed.meta.rateOffsetDays,
              enumerable: false,
            });
          }
          return parsed;
        }
      } catch (e) {
        console.warn("❌ Failed to parse cached conversion:", e);
        localStorage.removeItem(cacheKey);
      }
    }

    const resultPromise = new Promise<FReturn<Transaction>>((resolve) => {
      this.conversionQueue = this.conversionQueue.then(async () => {
        const date = tx.updated_at.split("T")[0];

        try {
          const sourceRateRes =
            tx.currency_code === "USD"
              ? {
                  value: { rateUSD: 1, code: "USD", recorded_at: date },
                  error: null,
                }
              : await SB.fetchHistoricalExchangeRate(tx.currency_code, date);

          if (sourceRateRes.error) {
            resolve({ value: null, error: sourceRateRes.error });
            return;
          }

          const targetRateRes =
            targetCode === "USD"
              ? {
                  value: { rateUSD: 1, code: "USD", recorded_at: date },
                  error: null,
                }
              : await SB.fetchHistoricalExchangeRate(targetCode, date);

          if (targetRateRes.error) {
            resolve({ value: null, error: targetRateRes.error });
            return;
          }

          const sourceRate = sourceRateRes.value.rateUSD;
          const targetRate = targetRateRes.value.rateUSD;

          const originalAmount = parseFloat(tx.amount);
          if (isNaN(originalAmount)) {
            resolve({
              value: null,
              error: {
                message: "Invalid amount format",
                code: "amount_invalid",
              },
            });
            return;
          }

          const amountInUSD = originalAmount * sourceRate;
          const newAmount = amountInUSD / targetRate;

          const convertedTx: Transaction = {
            ...tx,
            amount: newAmount.toFixed(8),
            currency_code: targetCode,
          };

          const recordedDates = [
            sourceRateRes.value.recorded_at,
            targetRateRes.value.recorded_at,
          ];

          const maxOffsetDays = Math.max(
            ...recordedDates.map(
              (d) =>
                Math.abs(new Date(d).getTime() - new Date(date).getTime()) /
                (1000 * 60 * 60 * 24),
            ),
          );

          const rateOffsetDays = Math.round(maxOffsetDays);

          Object.defineProperty(convertedTx, "__rateOffsetDays", {
            value: rateOffsetDays,
            enumerable: false,
          });

          const result: FReturn<Transaction> = {
            value: convertedTx,
            error: null,
          };

          // ✅ Store in localStorage
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              value: convertedTx,
              meta: { rateOffsetDays },
            }),
          );

          resolve(result);
        } catch (err: unknown) {
          resolve({
            value: null,
            error: {
              message: `Unexpected conversion error: ${
                err instanceof Error ? err.message : String(err)
              }`,
              code: "conversion_failed",
            },
          });
        }
      });
    });

    return resultPromise;
  }
  static async getBaseCurrency(): Promise<CurrencyCode> {
    Supabase.ensureInitialized();

    const raw = localStorage.getItem("baseCurrency");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const age = Date.now() - parsed.savedAt;
        if (age < 60 * 60 * 1000) {
          return parsed.code as CurrencyCode;
        } else {
          localStorage.removeItem("baseCurrency"); // expired
        }
      } catch {
        localStorage.removeItem("baseCurrency"); // corrupted
      }
    }

    const user = await Supabase.getCurrentUser();
    if (!user.error) {
      const code = user.value.user_metadata?.base_currency;
      if (code) {
        localStorage.setItem(
          "baseCurrency",
          JSON.stringify({ code, savedAt: Date.now() }),
        );
        return code as CurrencyCode;
      }
    }

    return "USD";
  }

  private static clearConversionCache() {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.cachePrefix)) {
        keysToRemove.push(key);
      }
    }
    for (const key of keysToRemove) {
      localStorage.removeItem(key);
    }
  }

  static async setBaseCurrency(code: CurrencyCode): Promise<FReturn<true>> {
    Supabase.ensureInitialized();
    SB.clearConversionCache();
    localStorage.setItem(
      "baseCurrency",
      JSON.stringify({ code, savedAt: Date.now() }),
    );

    const user = await Supabase.getCurrentUser();
    if (user.error) {
      return { value: null, error: user.error };
    }

    const { error } = await Supabase.client.auth.updateUser({
      data: { base_currency: code },
    });

    if (error) {
      return {
        value: null,
        error: {
          message: error.message,
          code: error.name ?? "update_failed",
        },
      };
    }

    return { value: true, error: null };
  }
}

export const SBInstance = new SB();
