"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { TransactionCards } from "@/app/__components__/transaction-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  useMutation,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { SB } from "../_accountant-supabase_/client";
import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import AddTransactionForm from "../__components__/add-transaction-form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ConfirmMessage } from "@/components/confirm-message";
import { OnLoadReturnType } from "@/components/confirm-message-controller";
import { IconListDetails, IconReceiptBitcoin } from "@tabler/icons-react";
import { DialogTitle } from "@radix-ui/react-dialog";
import TransactionsSum from "../__components__/transactions-sum";
import { useAuthEffect } from "@/lib/__supabase__/__hooks__/useAuthEffect";
import { Transaction } from "../__types__/Transaction";
import TransactionsFilter from "../__components__/transactions-filter";
import TransactionsDiff from "../__components__/transactions-diff";
import { cn } from "@/lib/utils";
import { useHashRoute } from "@/hooks/use-hash-route";

const queryClient = new QueryClient();

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <PageImpl />
    </QueryClientProvider>
  );
}

const navItems = {
  navMain: [
    {
      title: "Transactions",
      url: ["%F0%9F%A4%9D", "transactions"] as [string, string, ...string[]],
      icon: IconListDetails,
    },
    {
      title: "Taxes",
      url: ["%F0%9F%92%B8", "taxes"] as [string, string, ...string[]],
      icon: IconReceiptBitcoin,
    },
  ],
};

const PageImpl = () => {
  const transactionsMutation = useMutation({
    mutationFn: SB.getTransactions,
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hashRoute, _setHashRoute] = useHashRoute([
    "%F0%9F%A4%9D",
    "transactions",
  ]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedTxs, setSelectedTxs] = useState<Transaction[]>([]);
  const [filterFn, setFilterFn] = useState<
    (txs: Transaction[]) => Transaction[]
  >(() => (txs: Transaction[]) => txs);
  const filteredTransactions = useMemo(() => {
    if (!transactionsMutation?.data?.value?.txs) {
      return [];
    }
    return filterFn(transactionsMutation.data.value.txs).sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [filterFn, transactionsMutation?.data?.value?.txs]);

  useAuthEffect((event, session) => {
    if (
      event === "SIGNED_IN" &&
      transactionsMutation.data?.value?.user.id !== session?.user.id
    ) {
      transactionsMutation.mutate();
    }
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  if (!transactionsMutation.isSuccess && initialLoad) {
    return (
      <div className="flex flex-1 items-center justify-center h-screen">
        <ConfirmMessage
          title="Loading transactions"
          onLoad={async () => {
            const timeoutPromise = new Promise<OnLoadReturnType>((resolve) => {
              timeoutRef.current = setTimeout(() => {
                resolve({
                  value: null,
                  error: {
                    message:
                      "Loading transactions took too long. Please try again later.",
                    code: "transaction_load_timeout",
                  },
                });
              }, 10000);
            });

            const mutationPromise = transactionsMutation
              .mutateAsync()
              .then((res) => {
                if (res.error) {
                  return {
                    value: null,
                    error: {
                      message: res.error.message,
                      code: res.error.code,
                    },
                  };
                }

                return {
                  value: {
                    message: "Loaded transactions",
                  },
                  error: null,
                };
              });

            const result = await Promise.race([
              timeoutPromise,
              mutationPromise,
            ]);

            clearTimeout(timeoutRef.current!); // cancel the other one
            setInitialLoad(false);
            return result;
          }}
        />
      </div>
    );
  } else if (!transactionsMutation.data && initialLoad) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    return (
      <div className="flex flex-1 items-center justify-center h-screen">
        <ConfirmMessage
          title="Loading transactions failed"
          onLoad={async () => {
            return {
              value: null,
              error: {
                code: "transaction_load_error",
                message: "Failed to load transactions.",
              },
            };
          }}
        />
      </div>
    );
  } else if (transactionsMutation.data?.error && initialLoad) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    return (
      <div className="flex flex-1 items-center justify-center h-screen">
        <ConfirmMessage
          title="Loading transactions failed"
          onLoad={async () => {
            return {
              value: null,
              error: transactionsMutation.data!.error!,
            };
          }}
        />
      </div>
    );
  }
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        navMain={navItems.navMain}
        SB={SB}
        title="accountant"
        variant="inset"
        loginUrl="/login"
      />
      <SidebarInset>
        <SiteHeader
          heading={
            <>
              <div className="flex justify-between w-full relative">
                <span>
                  {
                    navItems.navMain.find((item) =>
                      item.url.every((seg, i) => seg === hashRoute[i]),
                    )?.title
                  }
                </span>
              </div>
              <span className="absolute sm:right-1/2 sm:translate-x-1/2 top-1.5 right-2">
                {!initialLoad &&
                transactionsMutation.isSuccess &&
                !transactionsMutation.data.error ? (
                  <TransactionsSum
                    transactions={transactionsMutation.data!.value!.txs!}
                  />
                ) : (
                  <span className="animate-pulse">
                    <div className="rounded-full h-2 w-2 dark:bg-white/50"></div>
                  </span>
                )}
              </span>
            </>
          }
        />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-4 md:py-6">
              {/* Add Transaction Card */}
              {!initialLoad &&
              transactionsMutation.isSuccess &&
              !transactionsMutation.data.error ? (
                <>
                  <div className="px-6 flex flex-col">
                    <TransactionsFilter
                      onChange={(newFilterFn) => {
                        setFilterFn(() => newFilterFn);
                        // Use this filtered list however you'd like
                      }}
                    />
                  </div>
                  <Dialog>
                    <DialogTrigger className="mx-6" asChild>
                      <Button variant="outline">Add Transaction</Button>
                    </DialogTrigger>
                    <DialogTitle className="sr-only">
                      Add Transaction
                    </DialogTitle>
                    <DialogContent className="sm:max-w-[425px]">
                      <AddTransactionForm
                        onSubmit={async () => {
                          setLoading(true);
                        }}
                        onSubmitted={() => {
                          transactionsMutation.mutate();
                          setLoading(false);
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className={cn(
                          "mx-6",
                          selectedTxs.length === 0
                            ? "!opacity-0 mb-0 h-0 p-0"
                            : "!opacity-100 mb-6 h-8 p-4",
                        )}
                        variant="outline"
                        disabled={selectedTxs.length === 0}
                      >
                        Calculate Difference
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[400px]">
                      <DialogTitle>Transaction Difference</DialogTitle>
                      <TransactionsDiff transactions={selectedTxs} />
                    </DialogContent>
                  </Dialog>
                  <TransactionCards
                    onSelectionChange={setSelectedTxs}
                    onChange={() => transactionsMutation.mutate()}
                    transactions={filteredTransactions}
                  />
                </>
              ) : (!initialLoad && transactionsMutation.isPending) ||
                loading ? (
                <div className="flex flex-1 items-center justify-center h-screen">
                  <ConfirmMessage
                    title="Updating transactions"
                    onLoad={async () => {
                      return {
                        value: {
                          message: "Updating transactions...",
                        },
                        error: null,
                      };
                    }}
                  />
                </div>
              ) : transactionsMutation.data?.error ? (
                <div className="flex flex-1 items-center justify-center h-screen">
                  <ConfirmMessage
                    title="Not logged in"
                    type="warning"
                    onLoad={async () => {
                      if (transactionsMutation.data?.error?.code === 400) {
                        return {
                          value: {
                            message: "Redirecting to the Login page...",
                            redirectTo: "/login",
                          },
                          error: null,
                        };
                      }
                      return {
                        value: null,
                        error: {
                          message:
                            transactionsMutation.data?.error?.message ??
                            "Loading transactions failed.",
                          code:
                            transactionsMutation.data?.error?.code ??
                            "transaction_update_failed",
                        },
                      };
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-1 items-center justify-center h-screen">
                  <ConfirmMessage
                    title="Loading transactions failed"
                    onLoad={async () => {
                      return {
                        value: null,
                        error: {
                          message: "Loading transactions failed.",
                          code: "transaction_update_failed",
                        },
                      };
                    }}
                  />
                </div>
              )}
              {/* <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div> */}
              {/* <DataTable data={data} /> */}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
