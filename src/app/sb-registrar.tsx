"use client";
import { useEffectOnce } from "@legendapp/state/react";
import { FC } from "react";
import { Supabase } from "@/lib/__supabase__/supabase";
import { SB } from "./_accountant-supabase_/client";

const SBRegistrar: FC = () => {
  useEffectOnce(() => {
    Supabase.configure(SB.anonUrl, SB.anonKey);
    Supabase.ensureInitialized();
  }, []);
  return <div></div>;
};

export default SBRegistrar;
