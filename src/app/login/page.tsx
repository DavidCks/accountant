"use client";
import { SB } from "../_accountant-supabase_/client";
import LoginPage from "@/lib/__pages__/login";

export default function Page() {
  return <LoginPage SB={SB} redirectTo="/dashboard" />;
}
