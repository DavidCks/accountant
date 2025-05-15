"use client";
import { SB } from "../_accountant-supabase_/client";

import SignupPage from "@/lib/__pages__/signup";

export default function Page() {
  return <SignupPage SB={SB} redirectTo="/confirm" />;
}
