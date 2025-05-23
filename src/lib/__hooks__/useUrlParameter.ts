"use client";
import { useSearchParams } from "next/navigation";

function useUrlParameter(name: string): string | undefined {
  const params = useSearchParams();
  return params.get(name) ?? undefined;
}

export default useUrlParameter;
