"use client";
import { SB } from "../_accountant-supabase_/client";
import { ConfirmMessage } from "../../components/confirm-message";
import ConfirmPage from "@/lib/__pages__/confirm";

export default function Page() {
  return <ConfirmPage SB={SB} redirectTo={"/dashboard"} />;
}
