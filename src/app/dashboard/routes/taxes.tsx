import BWA from "@/app/__components__/bwa";
import { Transaction } from "@/app/__types__/Transaction";
import { FC } from "react";

const Taxes: FC<{ txs: Transaction[] }> = ({ txs }) => {
  return (
    <div className="flex flex-1 justify-center items-center h-full w-full">
      <BWA txs={txs} />
    </div>
  );
};

export default Taxes;
