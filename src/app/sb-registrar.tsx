"use client";
import { useEffectOnce } from "@legendapp/state/react";
import { FC } from "react";
import { Supabase } from "@/lib/__supabase__/supabase";

const SBRegistrar: FC = () => {
  useEffectOnce(() => {
    Supabase.configure(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    Supabase.ensureInitialized();
  }, []);
  return <div></div>;
};

export default SBRegistrar;
