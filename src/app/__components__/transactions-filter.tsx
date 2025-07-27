"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Transaction } from "../__types__/Transaction";
import { FilterIcon, Trash2Icon } from "lucide-react";

type FilterField = keyof Pick<
  Transaction,
  | "participant"
  | "message"
  | "currency_code"
  | "status"
  | "payment_type"
  | "flow"
>;

type FilterCondition = {
  field: FilterField;
  values: string[];
};

export default function TransactionsFilter({
  onChange,
}: {
  onChange: (filterFn: (transactions: Transaction[]) => Transaction[]) => void;
}) {
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);
  const [selectedField, setSelectedField] = useState<FilterField | "">("");

  const handleFieldSelect = (field: FilterField) => {
    setActiveFilters((prev) => [...prev, { field, values: [""] }]);
    setSelectedField("");
  };

  const updateFilterValue = (
    filterIndex: number,
    valueIndex: number,
    newVal: string,
  ) => {
    const updated = [...activeFilters];
    updated[filterIndex].values[valueIndex] = newVal;
    setActiveFilters(updated);
    emitFilter(updated);
  };

  const addOrCondition = (filterIndex: number) => {
    const updated = [...activeFilters];
    updated[filterIndex].values.push("");
    setActiveFilters(updated);
    emitFilter(updated);
  };

  const removeFilter = (index: number) => {
    const updated = [...activeFilters];
    updated.splice(index, 1);
    setActiveFilters(updated);
    emitFilter(updated);
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    emitFilter([]);
  };

  const emitFilter = (conditions: FilterCondition[]) => {
    const filterFn = (transactions: Transaction[]) => {
      return transactions.filter((tx) => {
        return conditions.every(({ field, values }) => {
          const validValues = values
            .map((v) => v.trim())
            .filter((v) => v !== "");
          if (validValues.length === 0) return true;
          const fieldValue = tx[field]?.toString().toLowerCase();
          return validValues.some((val) =>
            fieldValue?.includes(val.toLowerCase()),
          );
        });
      });
    };
    onChange(filterFn);
  };
  const allFilterFields: FilterField[] = [
    "participant",
    "message",
    "currency_code",
    "status",
    "payment_type",
    "flow",
  ];

  const usedFields = activeFilters.map((f) => f.field);
  const availableFields = allFilterFields.filter(
    (f) => !usedFields.includes(f),
  );

  return (
    <div className="flex flex-col gap-4 rounded-md bg-muted/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select
            value={selectedField}
            onValueChange={(val) => handleFieldSelect(val as FilterField)}
          >
            <SelectTrigger className="w-[44px] pr-0">
              <FilterIcon className="w-4 h-4 text-muted-foreground" />
            </SelectTrigger>
            <SelectContent>
              {availableFields.map((field) => (
                <SelectItem key={field} value={field}>
                  {field
                    .replaceAll("_", " ")
                    .replace(/^\w/, (c) => c.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {activeFilters.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Clear all
            </Button>
          )}
        </div>
      </div>
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {activeFilters.map((filter, idx) => (
            <div
              key={`${filter.field}-${idx}`}
              className="flex flex-col w-full lg:w-auto space-y-2 border p-3 rounded-md relative bg-background"
            >
              <label className="text-sm pb-2 font-medium capitalize">
                {filter.field.replaceAll("_", " ")}
              </label>

              {filter.values.map((value, vIdx) => (
                <div key={vIdx} className="flex gap-2 items-center">
                  <Input
                    value={value}
                    placeholder={`Enter ${filter.field}`}
                    onChange={(e) =>
                      updateFilterValue(idx, vIdx, e.target.value)
                    }
                  />
                  {vIdx === filter.values.length - 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addOrCondition(idx)}
                    >
                      + or
                    </Button>
                  )}
                </div>
              ))}

              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-muted-foreground"
                onClick={() => removeFilter(idx)}
              >
                <Trash2Icon className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
