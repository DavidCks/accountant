import BudgetGoals from "@/app/__components__/budget-goals";
import { Transaction } from "@/app/__types__/Transaction";
import { FC } from "react";

const Budget: FC<{ txs: Transaction[] }> = ({ txs }) => {
  return (
    <div className="flex flex-1 justify-center items-center h-full w-full">
      <BudgetGoals txs={txs} />
    </div>
  );
};

export default Budget;
