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
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import AddTransactionForm from "../__components__/add-transaction-form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ConfirmMessage } from "@/components/confirm-message";
import { OnLoadReturnType } from "@/components/confirm-message-controller";
import { IconListDetails } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { DialogTitle } from "@radix-ui/react-dialog";

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
      url: "/dashboard",
      icon: IconListDetails,
    },
  ],
};

const PageImpl = () => {
  const transactionsMutation = useMutation({
    mutationFn: SB.getTransactions,
  });
  const pathname = usePathname();
  const [initialLoad, setInitialLoad] = useState(true);
  const [loading, setLoading] = useState(false);

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
      />
      <SidebarInset>
        <SiteHeader
          title={navItems.navMain.find((item) => item.url === pathname)?.title}
        />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Add Transaction Card */}
              {!initialLoad &&
              transactionsMutation.isSuccess &&
              !transactionsMutation.data.error ? (
                <>
                  <div className="flex justify-between">
                    <div></div>
                    <div></div>
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
                  <TransactionCards
                    onChange={() => transactionsMutation.mutate()}
                    transactions={transactionsMutation.data.value.sort(
                      (a, b) => {
                        return (
                          new Date(b.created_at).getTime() -
                          new Date(a.created_at).getTime()
                        );
                      }
                    )}
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
