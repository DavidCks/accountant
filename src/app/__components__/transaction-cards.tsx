"use client";

import { useEffect, useState } from "react";

import { IoAddOutline } from "react-icons/io5";
import { RxUpdate } from "react-icons/rx";

import { currencies, CurrencyCode } from "@/app/__types__/generated/Currencies";
import { SelectSearch } from "@/components/select-search";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Transaction } from "../__types__/Transaction";
import { SB } from "../_accountant-supabase_/client";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { FaSpinner } from "react-icons/fa";
import { toast } from "@/components/toast";
import { IconCircleDashedPlus, IconPaperclip } from "@tabler/icons-react";

export function TransactionCards({
  transactions,
  onChange,
  onSelectionChange,
}: {
  transactions: Transaction[];
  onChange: (transaction: Transaction) => void;
  onSelectionChange?: (transactions: Transaction[]) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [edited, setEdited] = useState<Partial<Transaction>>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const startEditing = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEdited(transaction);
  };

  const stopEditing = () => {
    setEditingId(null);
    setEdited({});
  };

  const saveChanges = async (transaction: Transaction) => {
    const updatedTransaction = {
      ...transaction,
      updated_at: new Date().toISOString(),
    };
    await SB.updateTransaction(updatedTransaction);
    onChange(updatedTransaction);
    stopEditing();
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  useEffect(() => {
    if (selectedIds.size > 0) {
      setSelectedIds(new Set());
    }
  }, [transactions]);

  useEffect(() => {
    onSelectionChange?.(transactions.filter((t) => selectedIds.has(t.id)));
  }, [selectedIds, onSelectionChange]);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {transactions.map((transaction) => {
        const isEditing = editingId === transaction.id;
        const data = isEditing ? (edited as Transaction) : transaction;
        const isSelected = selectedIds.has(transaction.id);

        return (
          <TransactionCard
            key={transaction.id}
            transaction={data}
            isSelected={isSelected}
            isEditing={isEditing}
            currencies={currencies}
            startEditing={startEditing}
            stopEditing={stopEditing}
            saveChanges={saveChanges}
            toggleSelection={toggleSelection}
            onChange={onChange}
          />
        );
      })}
    </div>
  );
}

type Props = {
  transaction: Transaction;
  isSelected: boolean;
  isEditing: boolean;
  currencies: Record<string, { code: CurrencyCode; symbol: string }>;
  startEditing: (tx: Transaction) => void;
  stopEditing: () => void;
  saveChanges: (tx: Transaction) => Promise<void>;
  toggleSelection: (id: string) => void;
  onChange: (tx: Transaction) => void;
};

export const TransactionCard = ({
  transaction,
  isSelected,
  isEditing,
  currencies,
  startEditing,
  stopEditing,
  saveChanges,
  toggleSelection,
  onChange,
}: Props) => {
  const [data, setData] = useState(transaction);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = <K extends keyof Transaction>(
    key: K,
    value: Transaction[K],
  ) => setData((prev) => ({ ...prev, [key]: value }));

  const [convertedAmount, setConvertedAmount] = useState<string | null>(null);
  const [offsetDays, setOffsetDays] = useState<number | null>(null);

  useEffect(() => {
    if (!isEditing) {
      SB.convertTx(transaction, "USD").then((res) => {
        if (res.value) {
          setConvertedAmount(res.value.amount);
          setOffsetDays((res.value as any).__rateOffsetDays ?? 0);
        } else {
          console.error(res.error);
        }
      });
    }
  }, [transaction, isEditing]);

  return (
    <Card
      key={transaction.id}
      className={cn(
        "@container/card data-[slot=card]:from-primary/5 data-[slot=card]:to-card dark:data-[slot=card]:bg-card",
      )}
    >
      <CardHeader className="relative">
        <Checkbox
          checked={isSelected}
          onClick={() => !isEditing && toggleSelection(transaction.id)}
          className="absolute right-2 -top-4 h-4 w-4 rounded-full"
        />
        <div
          className={cn(
            `absolute left-2 -top-4 h-2 w-2 rounded-full`,
            data.status === "pending"
              ? "bg-yellow-500 transform-3d"
              : data.flow === "income"
                ? "bg-green-500"
                : "bg-red-500",
            data.status === "pending" &&
              "before:absolute before:left-[150%] before:bottom-0 before:w-full before:h-full before:rounded-full before:-translate-z-0.5",
            data.flow === "income"
              ? "before:bg-green-500/70"
              : "before:bg-red-500/70",
          )}
        />

        <CardDescription>
          {data.flow === "income" ? "From " : "To "}
          {isEditing ? (
            <Input
              value={data.participant ?? "secret"}
              onChange={(e) => handleChange("participant", e.target.value)}
            />
          ) : (
            data.participant
          )}
        </CardDescription>

        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {isEditing ? (
            <Input
              type="number"
              value={data.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
            />
          ) : (
            <>
              {data.amount} {currencies[data.currency_code]?.symbol}
              {data.currency_code !== "USD" && (
                <>
                  {convertedAmount ? (
                    <span className="text-sm block text-muted-foreground italic">
                      ≈ {parseFloat(convertedAmount).toFixed(2)} USD{" "}
                      {offsetDays && offsetDays > 0 ? (
                        <span
                          className={cn(
                            offsetDays === 1 &&
                              "dark:bg-yellow-700 bg-yellow-300",
                            offsetDays > 1 && "dark:bg-red-900 bg-red-400",
                            "text-xs rounded-full px-2 py-0.5 mx-2 font-black text-foreground not-italic",
                          )}
                          title={`Exchange rate is from ${offsetDays} day${offsetDays > 1 ? "s" : ""} off`}
                        >
                          {offsetDays}d
                        </span>
                      ) : null}
                    </span>
                  ) : (
                    <span className="w-12 h-4 block animate-pulse rounded-full bg-gray-500"></span>
                  )}
                </>
              )}
            </>
          )}
        </CardTitle>

        {isEditing && (
          <SelectSearch<string>
            useRecents
            name="currency_code"
            options={Object.keys(currencies)}
            value={data.currency_code}
            onChange={(val: string) =>
              handleChange("currency_code", val as CurrencyCode)
            }
            getLabel={(v) => v}
            placeholder="Select currency"
            recentsStorageKey={"RecentCurrencyCodes"}
          />
        )}

        <CardAction className="flex flex-col gap-2">
          <Badge variant="outline">
            <IoAddOutline />{" "}
            {new Date(data.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
            })}
          </Badge>
          <Badge variant="outline">
            <RxUpdate />
            {new Date(data.updated_at).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
            })}
          </Badge>
        </CardAction>
      </CardHeader>

      <CardFooter className="relative flex-col items-start gap-1.5 text-sm">
        <div className="text-muted-foreground">{data.message}</div>
        <div className="flex flex-wrap gap-2 pt-4">
          {isEditing ? (
            <Select
              value={data.payment_type}
              onValueChange={(val) =>
                handleChange("payment_type", val as Transaction["payment_type"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Payment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one_time">One Time</SelectItem>
                <SelectItem value="subscription">Subscription</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Badge variant="outline">
              {data.payment_type === "one_time" ? "One time" : "Subscription"}
            </Badge>
          )}

          {isEditing ? (
            <Select
              value={data.status}
              onValueChange={(val) =>
                handleChange("status", val as Transaction["status"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Badge variant="outline">
              {data.status === "pending" ? "Pending" : "Done"}
            </Badge>
          )}

          <ViewAttachmentLink
            transaction={transaction}
            isEditing={isEditing}
            onChange={onChange}
          />
        </div>

        <div className="pt-4 flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={async () => {
                  setIsSaving(true);
                  await saveChanges(data);
                  setIsSaving(false);
                }}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    {"Save"}{" "}
                    <span className="animate-spin">
                      <FaSpinner></FaSpinner>
                    </span>
                  </>
                ) : (
                  "Save"
                )}
              </Button>
              <Button disabled={isSaving} variant="ghost" onClick={stopEditing}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => startEditing(transaction)}
              >
                Edit
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost">Delete</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                      This will permanently delete the transaction.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        await SB.deleteTransaction(transaction);
                        onChange(transaction);
                      }}
                    >
                      Delete transaction
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export function ViewAttachmentLink({
  isEditing,
  onChange,
  transaction,
}: {
  isEditing: boolean;
  onChange: (tx: Transaction) => void;
  transaction: Transaction;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    SB.getTransactionAttachmentUrl(transaction).then((result) => {
      if (active) {
        setUrl(result);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [transaction.id]);

  const baseStyles =
    "inline-flex items-center justify-center w-7 h-7 rounded-full transition hover:bg-accent hover:text-primary";

  if (loading) {
    return (
      <span
        className={`${baseStyles} text-muted-foreground bg-muted animate-pulse`}
        title="Loading attachment"
      >
        <span className=" block animate-pulse w-4 h-4 bg-gray-500 rounded-full" />
      </span>
    );
  }

  if (!url && !isEditing) {
    return null;
    // <span
    //   className={`${baseStyles} text-muted-foreground bg-muted`}
    //   title="No attachment"
    // >
    //   <IconPaperclip size={16} />
    // </span>
  }

  return isEditing ? (
    <div className="pt-2">
      <label className="flex items-center gap-2 cursor-pointer text-muted-foreground text-sm">
        <IconCircleDashedPlus className="hover:text-primary -translate-y-0.5" />
        <Input
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={async (e) => {
            setLoading(true);
            const file = e.target.files?.[0];
            if (!file) return;

            const result = await SB.uploadTransactionAttachment(
              file,
              transaction.id,
            );
            if (result.error) {
              toast.error(`Upload failed: ${result.error.message}`);
              return;
            }

            const updatedTransaction = {
              ...transaction,
              updated_at: new Date().toISOString(),
            };

            await SB.updateTransaction(updatedTransaction);
            onChange(updatedTransaction);
            setLoading(false);
          }}
        />
      </label>
    </div>
  ) : (
    url && (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseStyles} text-black bg-gray-100 hover:bg-gray-200`}
        title="View attachment"
      >
        <IconPaperclip size={16} />
      </a>
    )
  );
}
