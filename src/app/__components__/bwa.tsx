import { FC, useEffect, useState } from "react";
import { Transaction } from "../__types__/Transaction";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBaseCurrencyConvertedTxs } from "./__hooks__/useBaseCurrencyConvertedTxs";
import { bwaLabels, BWATable, BWATableType } from "./utils/bwa/bwa-table";
import { Card, CardContent } from "@/components/ui/card";
import { AIClassifyOverlay } from "./ai-loadig-overlay";

const BWA: FC<{ txs: Transaction[] }> = ({ txs }) => {
  const { converted: convertedTxs, loading } = useBaseCurrencyConvertedTxs(txs);

  const [tableData, setTableData] = useState<BWATableType | null>(null);
  const [isClassifying, setIsClassifying] = useState<boolean>(false);

  useEffect(() => {
    if (!loading && convertedTxs) {
      setIsClassifying(true);
      new BWATable(convertedTxs).build().then((td) => {
        console.log(td);
        setTableData(td);
        setIsClassifying(false);
      });
    }
  }, [convertedTxs, loading]);

  if (loading || !convertedTxs) {
    return <p>Loading converted transactions... (this may take a while)</p>;
  }

  if (isClassifying) {
    return (
      <AIClassifyOverlay
        title={"Classifying transactions"}
        subtitle={"Your transactions are being auto-categorized with AI."}
        open={isClassifying}
      />
    );
  }

  return (
    <div className="flex flex-col w-full p-4">
      {/* put the scroll on the element that directly wraps the wide row */}
      <div className="w-full max-w-full relative overflow-x-auto flex-col flex gap-4">
        {tableData &&
          Object.entries(tableData).map(([year, ytd]) => {
            return (
              <Card key={`bwa-${year}`}>
                <CardContent>
                  <Table>
                    <TableCaption>BWA {year}</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead
                          key={`head-bwa-${year}`}
                          className="font-medium"
                        >
                          Descriptions
                        </TableHead>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month]) => (
                            <TableHead
                              key={`head-bwa-${month}`}
                              className="font-medium"
                            >
                              {month}/{year}
                            </TableHead>
                          ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">
                          <span className="ps-4"></span>
                          {bwaLabels.revenueSales}
                        </TableCell>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month, mtd]) => (
                            <TableCell
                              key={`body-bwa-${month}-${bwaLabels.revenueSales}`}
                              className="font-medium"
                            >
                              {parseInt(
                                `${mtd.income[bwaLabels.revenueSales] * 100}`,
                              ) / 100}
                            </TableCell>
                          ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <span className="ps-4"></span>
                          {bwaLabels.changeInInventories}
                        </TableCell>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month, mtd]) => (
                            <TableCell
                              key={`body-bwa-${month}-${bwaLabels.changeInInventories}`}
                              className="font-medium"
                            >
                              {parseInt(
                                `${mtd.derivedIncome[bwaLabels.changeInInventories] * 100}`,
                              ) / 100}
                            </TableCell>
                          ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <span className="ps-4"></span>
                          {bwaLabels.capitalizedOwnWork}
                        </TableCell>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month, mtd]) => (
                            <TableCell
                              key={`body-bwa-${month}-${bwaLabels.capitalizedOwnWork}`}
                              className="font-medium"
                            >
                              {parseInt(
                                `${mtd.derivedIncome[bwaLabels.capitalizedOwnWork] * 100}`,
                              ) / 100}
                            </TableCell>
                          ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-black">
                          {bwaLabels.totalOutput}
                        </TableCell>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month, mtd]) => (
                            <TableCell
                              key={`body-bwa-${month}-${bwaLabels.totalOutput}`}
                              className="font-black"
                            >
                              {parseInt(
                                `${
                                  (mtd.derivedIncome[
                                    bwaLabels.capitalizedOwnWork
                                  ] +
                                    mtd.derivedIncome[
                                      bwaLabels.changeInInventories
                                    ] +
                                    mtd.income[bwaLabels.revenueSales]) *
                                  100
                                }`,
                              ) / 100}
                            </TableCell>
                          ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <span className="ps-4"></span>
                          {bwaLabels.materialsGoodsPurchased}
                        </TableCell>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month, mtd]) => (
                            <TableCell
                              key={`body-bwa-${month}-${bwaLabels.materialsGoodsPurchased}`}
                              className="font-medium"
                            >
                              {parseInt(
                                `${
                                  mtd.expense[
                                    bwaLabels.materialsGoodsPurchased
                                  ] * 100
                                }`,
                              ) / 100}
                            </TableCell>
                          ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-black">
                          {bwaLabels.grossProfit}
                        </TableCell>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month, mtd]) => (
                            <TableCell
                              key={`body-bwa-${month}-${bwaLabels.grossProfit}`}
                              className="font-black"
                            >
                              {parseInt(
                                `${
                                  (mtd.derivedIncome[
                                    bwaLabels.capitalizedOwnWork
                                  ] +
                                    mtd.derivedIncome[
                                      bwaLabels.changeInInventories
                                    ] +
                                    mtd.income[bwaLabels.revenueSales] -
                                    mtd.expense[
                                      bwaLabels.materialsGoodsPurchased
                                    ]) *
                                  100
                                }`,
                              ) / 100}
                            </TableCell>
                          ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <span className="ps-4"></span>
                          {bwaLabels.otherOperatingIncome}
                        </TableCell>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month, mtd]) => (
                            <TableCell
                              key={`body-bwa-${month}-${bwaLabels.otherOperatingIncome}`}
                              className="font-medium"
                            >
                              {parseInt(
                                `${
                                  mtd.income[bwaLabels.otherOperatingIncome] *
                                  100
                                }`,
                              ) / 100}
                            </TableCell>
                          ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-black">
                          {bwaLabels.operatingGrossProfit}
                        </TableCell>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month, mtd]) => (
                            <TableCell
                              key={`body-bwa-${month}-${bwaLabels.operatingGrossProfit}`}
                              className="font-black"
                            >
                              {parseInt(
                                `${
                                  (mtd.derivedIncome[
                                    bwaLabels.capitalizedOwnWork
                                  ] +
                                    mtd.derivedIncome[
                                      bwaLabels.changeInInventories
                                    ] +
                                    mtd.income[bwaLabels.revenueSales] -
                                    mtd.expense[
                                      bwaLabels.materialsGoodsPurchased
                                    ] +
                                    mtd.income[
                                      bwaLabels.otherOperatingIncome
                                    ]) *
                                  100
                                }`,
                              ) / 100}
                            </TableCell>
                          ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          {bwaLabels.typesOfCosts}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <span className="ps-4"></span>
                          {bwaLabels.personnelCosts}
                        </TableCell>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month, mtd]) => (
                            <TableCell
                              key={`body-bwa-${month}-${bwaLabels.personnelCosts}`}
                              className="font-medium"
                            >
                              {parseInt(
                                `${
                                  mtd.expense[bwaLabels.personnelCosts] * 100
                                }`,
                              ) / 100}
                            </TableCell>
                          ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <span className="ps-4"></span>
                          {bwaLabels.premisesCosts}
                        </TableCell>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month, mtd]) => (
                            <TableCell
                              key={`body-bwa-${month}-${bwaLabels.premisesCosts}`}
                              className="font-medium"
                            >
                              {parseInt(
                                `${mtd.expense[bwaLabels.premisesCosts] * 100}`,
                              ) / 100}
                            </TableCell>
                          ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <span className="ps-4"></span>
                          {bwaLabels.businessNonIncomeTaxes}
                        </TableCell>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month, mtd]) => (
                            <TableCell
                              key={`body-bwa-${month}-${bwaLabels.businessNonIncomeTaxes}`}
                              className="font-medium"
                            >
                              {parseInt(
                                `${
                                  mtd.expense[
                                    bwaLabels.businessNonIncomeTaxes
                                  ] * 100
                                }`,
                              ) / 100}
                            </TableCell>
                          ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <span className="ps-4"></span>
                          {bwaLabels.insuranceContributions}
                        </TableCell>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month, mtd]) => (
                            <TableCell
                              key={`body-bwa-${month}-${bwaLabels.insuranceContributions}`}
                              className="font-medium"
                            >
                              {parseInt(
                                `${
                                  mtd.expense[
                                    bwaLabels.insuranceContributions
                                  ] * 100
                                }`,
                              ) / 100}
                            </TableCell>
                          ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <span className="ps-4"></span>
                          {bwaLabels.specialCosts}
                        </TableCell>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month, mtd]) => (
                            <TableCell
                              key={`body-bwa-${month}-${bwaLabels.specialCosts}`}
                              className="font-medium"
                            >
                              {parseInt(
                                `${mtd.expense[bwaLabels.specialCosts] * 100}`,
                              ) / 100}
                            </TableCell>
                          ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <span className="ps-4"></span>
                          {bwaLabels.vehicleCostsExclVAT}
                        </TableCell>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month, mtd]) => (
                            <TableCell
                              key={`body-bwa-${month}-${bwaLabels.vehicleCostsExclVAT}`}
                              className="font-medium"
                            >
                              {parseInt(
                                `${
                                  mtd.expense[bwaLabels.vehicleCostsExclVAT] *
                                  100
                                }`,
                              ) / 100}
                            </TableCell>
                          ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <span className="ps-4"></span>
                          {bwaLabels.advertisingTravelExpenses}
                        </TableCell>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month, mtd]) => (
                            <TableCell
                              key={`body-bwa-${month}-${bwaLabels.advertisingTravelExpenses}`}
                              className="font-medium"
                            >
                              {parseInt(
                                `${
                                  mtd.expense[
                                    bwaLabels.advertisingTravelExpenses
                                  ] * 100
                                }`,
                              ) / 100}
                            </TableCell>
                          ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <span className="ps-4"></span>
                          {bwaLabels.outboundShippingPackagingCosts}
                        </TableCell>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month, mtd]) => (
                            <TableCell
                              key={`body-bwa-${month}-${bwaLabels.outboundShippingPackagingCosts}`}
                              className="font-medium"
                            >
                              {parseInt(
                                `${
                                  mtd.expense[
                                    bwaLabels.outboundShippingPackagingCosts
                                  ] * 100
                                }`,
                              ) / 100}
                            </TableCell>
                          ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <span className="ps-4"></span>
                          {bwaLabels.depreciation}
                        </TableCell>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month, mtd]) => (
                            <TableCell
                              key={`body-bwa-${month}-${bwaLabels.depreciation}`}
                              className="font-medium"
                            >
                              {parseInt(
                                `${
                                  mtd.derivedExpense[bwaLabels.depreciation] *
                                  100
                                }`,
                              ) / 100}
                            </TableCell>
                          ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <span className="ps-4"></span>
                          {bwaLabels.repairsMaintenance}
                        </TableCell>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month, mtd]) => (
                            <TableCell
                              key={`body-bwa-${month}-${bwaLabels.repairsMaintenance}`}
                              className="font-medium"
                            >
                              {parseInt(
                                `${
                                  mtd.expense[bwaLabels.repairsMaintenance] *
                                  100
                                }`,
                              ) / 100}
                            </TableCell>
                          ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <span className="ps-4"></span>
                          {bwaLabels.otherOperatingCosts}
                        </TableCell>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month, mtd]) => (
                            <TableCell
                              key={`body-bwa-${month}-${bwaLabels.otherOperatingCosts}`}
                              className="font-medium"
                            >
                              {parseInt(
                                `${
                                  mtd.expense[bwaLabels.otherOperatingCosts] *
                                  100
                                }`,
                              ) / 100}
                            </TableCell>
                          ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-black">
                          {bwaLabels.totalOperatingCosts}
                        </TableCell>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month, mtd]) => (
                            <TableCell
                              key={`body-bwa-${month}-${bwaLabels.totalOperatingCosts}`}
                              className="font-black"
                            >
                              {parseInt(
                                `${
                                  (mtd.expense[bwaLabels.personnelCosts] +
                                    mtd.expense[bwaLabels.premisesCosts] +
                                    mtd.expense[
                                      bwaLabels.businessNonIncomeTaxes
                                    ] +
                                    mtd.expense[
                                      bwaLabels.insuranceContributions
                                    ] +
                                    mtd.expense[bwaLabels.specialCosts] +
                                    mtd.expense[bwaLabels.vehicleCostsExclVAT] +
                                    mtd.expense[
                                      bwaLabels.advertisingTravelExpenses
                                    ] +
                                    mtd.expense[
                                      bwaLabels.outboundShippingPackagingCosts
                                    ] +
                                    mtd.derivedExpense[bwaLabels.depreciation] +
                                    mtd.expense[bwaLabels.repairsMaintenance] +
                                    mtd.expense[
                                      bwaLabels.otherOperatingCosts
                                    ]) *
                                  100
                                }`,
                              ) / 100}
                            </TableCell>
                          ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-black">
                          {bwaLabels.operatingResult}
                        </TableCell>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month, mtd]) => (
                            <TableCell
                              key={`body-bwa-${month}-${bwaLabels.operatingResult}`}
                              className="font-black"
                            >
                              {parseInt(
                                `${
                                  (mtd.derivedIncome[
                                    bwaLabels.capitalizedOwnWork
                                  ] +
                                    mtd.derivedIncome[
                                      bwaLabels.changeInInventories
                                    ] +
                                    mtd.income[bwaLabels.revenueSales] -
                                    mtd.expense[
                                      bwaLabels.materialsGoodsPurchased
                                    ] +
                                    mtd.income[bwaLabels.otherOperatingIncome] -
                                    (mtd.expense[bwaLabels.personnelCosts] +
                                      mtd.expense[bwaLabels.premisesCosts] +
                                      mtd.expense[
                                        bwaLabels.businessNonIncomeTaxes
                                      ] +
                                      mtd.expense[
                                        bwaLabels.insuranceContributions
                                      ] +
                                      mtd.expense[bwaLabels.specialCosts] +
                                      mtd.expense[
                                        bwaLabels.vehicleCostsExclVAT
                                      ] +
                                      mtd.expense[
                                        bwaLabels.advertisingTravelExpenses
                                      ] +
                                      mtd.expense[
                                        bwaLabels.outboundShippingPackagingCosts
                                      ] +
                                      mtd.derivedExpense[
                                        bwaLabels.depreciation
                                      ] +
                                      mtd.expense[
                                        bwaLabels.repairsMaintenance
                                      ] +
                                      mtd.expense[
                                        bwaLabels.otherOperatingCosts
                                      ])) *
                                  100
                                }`,
                              ) / 100}
                            </TableCell>
                          ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <span className="ps-4"></span>
                          {bwaLabels.interestExpense}
                        </TableCell>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month, mtd]) => (
                            <TableCell
                              key={`body-bwa-${month}-${bwaLabels.interestExpense}`}
                              className="font-medium"
                            >
                              {parseInt(
                                `${
                                  mtd.expense[bwaLabels.interestExpense] * 100
                                }`,
                              ) / 100}
                            </TableCell>
                          ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <span className="ps-4"></span>
                          {bwaLabels.otherNonOperatingExpense}
                        </TableCell>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month, mtd]) => (
                            <TableCell
                              key={`body-bwa-${month}-${bwaLabels.otherNonOperatingExpense}`}
                              className="font-medium"
                            >
                              {parseInt(
                                `${
                                  mtd.expense[
                                    bwaLabels.otherNonOperatingExpense
                                  ] * 100
                                }`,
                              ) / 100}
                            </TableCell>
                          ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-black">
                          {bwaLabels.totalNonOperatingCosts}
                        </TableCell>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month, mtd]) => (
                            <TableCell
                              key={`body-bwa-${month}-${bwaLabels.totalNonOperatingCosts}`}
                              className="font-black"
                            >
                              {parseInt(
                                `${
                                  (mtd.expense[bwaLabels.interestExpense] +
                                    mtd.expense[
                                      bwaLabels.otherNonOperatingExpense
                                    ]) *
                                  100
                                }`,
                              ) / 100}
                            </TableCell>
                          ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <span className="ps-4"></span>
                          {bwaLabels.interestIncome}
                        </TableCell>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month, mtd]) => (
                            <TableCell
                              key={`body-bwa-${month}-${bwaLabels.interestIncome}`}
                              className="font-medium"
                            >
                              {parseInt(
                                `${mtd.income[bwaLabels.interestIncome] * 100}`,
                              ) / 100}
                            </TableCell>
                          ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <span className="ps-4"></span>
                          {bwaLabels.otherNonOperatingIncome}
                        </TableCell>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month, mtd]) => (
                            <TableCell
                              key={`body-bwa-${month}-${bwaLabels.otherNonOperatingIncome}`}
                              className="font-medium"
                            >
                              {parseInt(
                                `${
                                  mtd.income[
                                    bwaLabels.otherNonOperatingIncome
                                  ] * 100
                                }`,
                              ) / 100}
                            </TableCell>
                          ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <span className="ps-4"></span>
                          {bwaLabels.creditedImputedCosts}
                        </TableCell>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month, mtd]) => (
                            <TableCell
                              key={`body-bwa-${month}-${bwaLabels.creditedImputedCosts}`}
                              className="font-medium"
                            >
                              {parseInt(
                                `${
                                  mtd.derivedIncome[
                                    bwaLabels.creditedImputedCosts
                                  ] * 100
                                }`,
                              ) / 100}
                            </TableCell>
                          ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-black">
                          {bwaLabels.neutralIncome}
                        </TableCell>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month, mtd]) => (
                            <TableCell
                              key={`body-bwa-${month}-${bwaLabels.neutralIncome}`}
                              className="font-black"
                            >
                              {parseInt(
                                `${
                                  (mtd.income[bwaLabels.interestIncome] +
                                    mtd.income[
                                      bwaLabels.otherNonOperatingIncome
                                    ] +
                                    mtd.derivedIncome[
                                      bwaLabels.creditedImputedCosts
                                    ]) *
                                  100
                                }`,
                              ) / 100}
                            </TableCell>
                          ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <span className="ps-4"></span>
                          {bwaLabels.accountClass56}
                        </TableCell>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month, mtd]) => (
                            <TableCell
                              key={`body-bwa-${month}-${bwaLabels.accountClass56}`}
                              className="font-medium"
                            >
                              {parseInt(
                                `${
                                  mtd.expense[bwaLabels.accountClass56] * 100
                                }`,
                              ) / 100}
                            </TableCell>
                          ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-black">
                          {bwaLabels.profitBeforeTax}
                        </TableCell>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month, mtd]) => (
                            <TableCell
                              key={`body-bwa-${month}-${bwaLabels.profitBeforeTax}`}
                              className="font-black"
                            >
                              {parseInt(
                                `${
                                  /* Operating Result */ (mtd.derivedIncome[
                                    bwaLabels.capitalizedOwnWork
                                  ] +
                                    mtd.derivedIncome[
                                      bwaLabels.changeInInventories
                                    ] +
                                    mtd.income[bwaLabels.revenueSales] -
                                    mtd.expense[
                                      bwaLabels.materialsGoodsPurchased
                                    ] +
                                    mtd.income[bwaLabels.otherOperatingIncome] -
                                    (mtd.expense[bwaLabels.personnelCosts] +
                                      mtd.expense[bwaLabels.premisesCosts] +
                                      mtd.expense[
                                        bwaLabels.businessNonIncomeTaxes
                                      ] +
                                      mtd.expense[
                                        bwaLabels.insuranceContributions
                                      ] +
                                      mtd.expense[bwaLabels.specialCosts] +
                                      mtd.expense[
                                        bwaLabels.vehicleCostsExclVAT
                                      ] +
                                      mtd.expense[
                                        bwaLabels.advertisingTravelExpenses
                                      ] +
                                      mtd.expense[
                                        bwaLabels.outboundShippingPackagingCosts
                                      ] +
                                      mtd.derivedExpense[
                                        bwaLabels.depreciation
                                      ] +
                                      mtd.expense[
                                        bwaLabels.repairsMaintenance
                                      ] +
                                      mtd.expense[
                                        bwaLabels.otherOperatingCosts
                                      ]) +
                                    /* Neutral Income */ (mtd.income[
                                      bwaLabels.interestIncome
                                    ] +
                                      mtd.income[
                                        bwaLabels.otherNonOperatingIncome
                                      ] +
                                      mtd.derivedIncome[
                                        bwaLabels.creditedImputedCosts
                                      ]) /* Non-operational expenses */ -
                                    (mtd.expense[bwaLabels.interestExpense] +
                                      mtd.expense[
                                        bwaLabels.otherNonOperatingExpense
                                      ])) *
                                  100
                                }`,
                              ) / 100}
                            </TableCell>
                          ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <span className="ps-4"></span>
                          {bwaLabels.incomeEarningsTaxes}
                        </TableCell>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month, mtd]) => (
                            <TableCell
                              key={`body-bwa-${month}-${bwaLabels.incomeEarningsTaxes}`}
                              className="font-medium"
                            >
                              {parseInt(
                                `${
                                  mtd.derivedExpense[
                                    bwaLabels.incomeEarningsTaxes
                                  ] * 100
                                }`,
                              ) / 100}
                            </TableCell>
                          ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-black">
                          {bwaLabels.preliminaryResult}
                        </TableCell>
                        {Object.entries(ytd)
                          .reverse()
                          .map(([month, mtd]) => (
                            <TableCell
                              key={`body-bwa-${month}-${bwaLabels.preliminaryResult}`}
                              className="font-black"
                            >
                              {parseInt(
                                `${
                                  /* Operating Result */ (mtd.derivedIncome[
                                    bwaLabels.capitalizedOwnWork
                                  ] +
                                    mtd.derivedIncome[
                                      bwaLabels.changeInInventories
                                    ] +
                                    mtd.income[bwaLabels.revenueSales] -
                                    mtd.expense[
                                      bwaLabels.materialsGoodsPurchased
                                    ] +
                                    mtd.income[bwaLabels.otherOperatingIncome] -
                                    (mtd.expense[bwaLabels.personnelCosts] +
                                      mtd.expense[bwaLabels.premisesCosts] +
                                      mtd.expense[
                                        bwaLabels.businessNonIncomeTaxes
                                      ] +
                                      mtd.expense[
                                        bwaLabels.insuranceContributions
                                      ] +
                                      mtd.expense[bwaLabels.specialCosts] +
                                      mtd.expense[
                                        bwaLabels.vehicleCostsExclVAT
                                      ] +
                                      mtd.expense[
                                        bwaLabels.advertisingTravelExpenses
                                      ] +
                                      mtd.expense[
                                        bwaLabels.outboundShippingPackagingCosts
                                      ] +
                                      mtd.derivedExpense[
                                        bwaLabels.depreciation
                                      ] +
                                      mtd.expense[
                                        bwaLabels.repairsMaintenance
                                      ] +
                                      mtd.expense[
                                        bwaLabels.otherOperatingCosts
                                      ]) +
                                    /* Neutral Income */ (mtd.income[
                                      bwaLabels.interestIncome
                                    ] +
                                      mtd.income[
                                        bwaLabels.otherNonOperatingIncome
                                      ] +
                                      mtd.derivedIncome[
                                        bwaLabels.creditedImputedCosts
                                      ]) /* Non-operational expenses */ -
                                    (mtd.expense[bwaLabels.interestExpense] +
                                      mtd.expense[
                                        bwaLabels.otherNonOperatingExpense
                                      ]) -
                                    /* Tax estimate */ mtd.derivedExpense[
                                      bwaLabels.incomeEarningsTaxes
                                    ]) *
                                  100
                                }`,
                              ) / 100}
                            </TableCell>
                          ))}
                      </TableRow>
                    </TableBody>
                    <TableFooter></TableFooter>
                  </Table>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
};

export default BWA;
