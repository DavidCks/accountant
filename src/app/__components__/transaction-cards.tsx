"use client";

import React, { useState } from "react";

import { IoAddOutline } from "react-icons/io5";
import { RxUpdate } from "react-icons/rx";

import { Badge } from "@/components/ui/badge";
import { Transaction } from "../__types__/Transaction";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { currencies } from "@/app/__types__/Currencies";
import { SelectSearch } from "@/components/select-search";
import { SB } from "../_accountant-supabase_/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function TransactionCards({
  transactions,
  onChange,
}: {
  transactions: Transaction[];
  onChange: (transaction: Transaction) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [edited, setEdited] = useState<Partial<Transaction>>({});

  // @typescript-eslint/no-explicit-any
  const handleChange = (field: keyof Transaction, value: any) => {
    setEdited((prev) => ({ ...prev, [field]: value }));
  };

  const startEditing = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEdited(transaction);
  };

  const stopEditing = () => {
    setEditingId(null);
    setEdited({});
  };

  const saveChanges = async (oldTransaction: Transaction) => {
    console.log("Save this transaction:", edited);
    const updatedTransaction = {
      ...oldTransaction,
      ...edited,
      updated_at: new Date().toISOString(),
    };
    await SB.updateTransaction(updatedTransaction);
    onChange(updatedTransaction);
    stopEditing();
  };

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {transactions.map((transaction) => {
        const isEditing = editingId === transaction.id;
        const data = isEditing ? (edited as Transaction) : transaction;

        return (
          <Card
            key={transaction.id}
            className="@container/card data-[slot=card]:from-primary/5 data-[slot=card]:to-card dark:data-[slot=card]:bg-card"
          >
            <CardHeader className="relative">
              <div
                className={`absolute left-2 -top-4 h-2 w-2 rounded-full ${
                  data.status === "pending"
                    ? "bg-yellow-500"
                    : data.flow === "income"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              />
              <CardDescription>
                {data.flow === "income" ? "From " : "To "}
                {isEditing ? (
                  <Input
                    value={data.participant ?? "secret"}
                    onChange={(e) =>
                      handleChange("participant", e.target.value)
                    }
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
                    {data.amount}{" "}
                    {
                      Object.entries(currencies).find(
                        (c) => c[1].code === data.currency_code
                      )![1].symbol
                    }
                  </>
                )}
              </CardTitle>

              {isEditing ? (
                <SelectSearch<string>
                  useRecents={true}
                  name="currency_code"
                  options={Object.keys(currencies)}
                  value={data.currency_code}
                  onChange={(val: string) => handleChange("currency_code", val)}
                  // value={selected}
                  // onChange={setSelected}
                  getLabel={(v) => v}
                  placeholder="Select currency"
                  recentsStorageKey={"RecentCurrencyCodes"}
                />
              ) : null}

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

              <div className="flex flex-wrap flex-row gap-2 pt-4">
                {isEditing ? (
                  <Select
                    value={data.payment_type}
                    onValueChange={(val) => handleChange("payment_type", val)}
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
                    {data.payment_type === "one_time"
                      ? "One time"
                      : "Subscription"}
                  </Badge>
                )}

                {isEditing ? (
                  <Select
                    value={data.status}
                    onValueChange={(val) => handleChange("status", val)}
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
              </div>

              <div className="pt-4 flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => saveChanges(transaction)}
                    >
                      Save
                    </Button>
                    <Button variant="ghost" onClick={stopEditing}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    {" "}
                    <Button
                      variant="outline"
                      onClick={() => startEditing(transaction)}
                    >
                      Edit
                    </Button>
                    {/* Delete Dialog */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost">Delete</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Are you sure?</DialogTitle>
                          <DialogDescription>
                            Deleting this transaction will permanently remove
                            it.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            onClick={async () => {
                              await SB.deleteTransaction(transaction);
                              onChange(transaction);
                            }}
                            variant="destructive"
                            type="submit"
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
      })}
    </div>
  );
}
