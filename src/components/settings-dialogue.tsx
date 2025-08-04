import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { SelectSearch } from "./select-search";
import { currencies, CurrencyCode } from "@/app/__types__/generated/Currencies";
import { SB } from "@/app/_accountant-supabase_/client";

export function SettingsDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");

  useEffect(() => {
    SB.getBaseCurrency().then((val) => {
      if (val) {
        setCurrency(val);
      }
    });
  }, []);

  const saveCurrency = async (val: CurrencyCode) => {
    setCurrency(val);
    await SB.setBaseCurrency(val);
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <label className="block text-sm font-medium">Base currency</label>
          <SelectSearch<string>
            useRecents
            name="currency_code"
            options={Object.keys(currencies)}
            value={currency}
            onChange={(val: string) => saveCurrency(val as CurrencyCode)}
            getLabel={(v) => v}
            placeholder="Select currency"
            recentsStorageKey={"RecentCurrencyCodes"}
          />
        </div>
        <DialogFooter className="mt-4">
          <Button onClick={() => onClose()}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
