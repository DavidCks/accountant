// components/AIClassifyOverlay.tsx
import { FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

type Props = {
  open: boolean;
  title?: string;
  subtitle?: string;
  onCancel?: () => void;
};

export const AIClassifyOverlay: FC<Props> = ({
  open,
  title = "Classifying transactions",
  subtitle = "Your transactions are being auto-categorized with AI.",
  onCancel,
}) => {
  return (
    <div className="w-full h-full">
      <AnimatePresence>
        {open && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center overflow-hidden
                     bg-white/60 dark:bg-black/60 backdrop-blur-sm"
          >
            {/* gradient blobs */}
            <motion.div
              className="pointer-events-none absolute h-[48rem] w-[48rem] rounded-full
                       bg-gradient-to-tr from-violet-500 via-fuchsia-500 to-amber-400
                       opacity-30 blur-3xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="pointer-events-none absolute h-[36rem] w-[36rem] rounded-full
                       bg-gradient-to-tr from-sky-400 via-emerald-400 to-lime-300
                       opacity-20 blur-3xl"
              initial={{ x: -120, y: -80 }}
              animate={{ x: [-120, 120, -120], y: [-80, 80, -80] }}
              transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* card */}
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 12, opacity: 0 }}
            >
              <Card
                className="w-[min(92vw,520px)] border-white/40 bg-white/70
                             shadow-2xl backdrop-blur-md
                             dark:border-white/10 dark:bg-zinc-900/70"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <span className="relative inline-flex h-9 w-9 items-center justify-center">
                      <span
                        className="absolute inset-0 rounded-full bg-gradient-to-tr
                                      from-fuchsia-500 via-violet-500 to-sky-400
                                      animate-pulse blur-sm opacity-70"
                      />
                      <Sparkles
                        className="relative h-5 w-5 text-fuchsia-500 dark:text-fuchsia-400
                                         animate-[spin_3s_linear_infinite]"
                      />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold leading-tight">
                        {title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {subtitle}
                      </p>
                    </div>
                  </div>

                  {/* shimmer bar */}
                  <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-muted/60">
                    <div
                      className="h-full w-1/3 animate-shimmer rounded-full
                                  bg-gradient-to-r from-transparent via-white/70 to-transparent
                                  dark:via-white/20"
                    />
                  </div>

                  {onCancel && (
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={onCancel}
                        className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* local keyframes for shimmer; reduced-motion friendly */}
            <style>{`
            @keyframes shimmer { 0% { transform: translateX(-100%);} 100% { transform: translateX(300%);} }
            .animate-shimmer { animation: shimmer 1.8s ease-in-out infinite; }
            @media (prefers-reduced-motion: reduce) {
              .animate-[spin_3s_linear_infinite], .animate-pulse, .animate-shimmer { animation: none !important; }
            }
          `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
