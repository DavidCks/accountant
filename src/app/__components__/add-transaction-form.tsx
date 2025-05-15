import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { TransactionCards } from "@/app/__components__/transaction-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { SB } from "../_accountant-supabase_/client";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { currencies, CurrencyCode } from "../__types__/Currencies";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { SelectSearch } from "@/components/select-search";
import { toast } from "@/components/toast";
import { on } from "events";

const AddTransactionForm = ({
  onSubmitted,
  onSubmit,
}: {
  onSubmit?: (transaction: {
    amount: string;
    currency_code: CurrencyCode;
    payment_type: "one_time" | "subscription";
    flow: "income" | "expense";
    participant: string;
    status: "done" | "pending";
    message: string;
  }) => void;
  onSubmitted: () => void;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground">
        Add a new transaction to your account.
      </p>
      {/* Add Transaction Form */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const amount = formData.get("amount")!;
          const currency_code = formData.get("currency_code")!;
          const payment_type = formData.get("payment_type")!;
          const flow = formData.get("flow")!;
          const participant = formData.get("participant")!;
          const status = formData.get("status")!;
          const message = formData.get("message")!;

          const transaction = {
            amount: String(amount),
            currency_code: String(currency_code) as CurrencyCode,
            payment_type: String(payment_type) as "one_time" | "subscription",
            flow: String(flow) as "income" | "expense",
            participant: String(participant),
            status: String(status) as "done" | "pending",
            message: String(message),
          };
          onSubmit?.(transaction);
          const result = await SB.addTransaction(transaction);
          if (result.error) {
            console.error(result.error.message);
            toast.error(`Error adding transaction: ${result.error.message}`);
          } else {
            onSubmitted();
          }
        }}
        className="grid gap-4"
      >
        {/* Amount */}
        <div className="grid gap-1">
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" name="amount" type="number" step="0.01" required />
        </div>

        {/* Currency */}
        <div className="grid gap-1">
          <Label className="pb-1" htmlFor="currency_code">
            Currency
          </Label>
          <SelectSearch<string>
            useRecents={true}
            name="currency_code"
            options={Object.keys(currencies)}
            // value={selected}
            // onChange={setSelected}
            getLabel={(v) => v}
            placeholder="Select currency"
            recentsStorageKey={"RecentCurrencyCodes"}
          />
        </div>

        {/* Payment Type */}
        <div className="grid gap-1">
          <Label className="pb-1">Payment Type</Label>
          <RadioGroup
            name="payment_type"
            defaultValue="one_time"
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="one_time" id="one_time" />
              <Label htmlFor="one_time">One-time</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="subscription" id="subscription" />
              <Label htmlFor="subscription">Subscription</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Flow */}
        <div className="grid gap-1">
          <Label className="pb-1">Flow</Label>
          <RadioGroup name="flow" defaultValue="income" className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="income" id="income" />
              <Label htmlFor="income">Income</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="expense" id="expense" />
              <Label htmlFor="expense">Expense</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Participant */}
        <div className="grid gap-1">
          <Label className="pb-1" htmlFor="participant">
            Participant
          </Label>
          <Input id="participant" name="participant" type="text" />
        </div>

        {/* Status */}
        <div className="grid gap-1">
          <Label className="pb-1" htmlFor="status">
            Status
          </Label>
          <Select name="status" required>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="done">Done</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Message */}
        <div className="grid gap-1">
          <Label className="pb-1" htmlFor="message">
            Message
          </Label>
          <Textarea className="" id="message" name="message" />
        </div>

        <Button type="submit" className="mt-2">
          Add Transaction
        </Button>
      </form>
    </div>
  );
};

export default AddTransactionForm;
