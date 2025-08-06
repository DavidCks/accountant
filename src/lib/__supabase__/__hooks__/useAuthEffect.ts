// useAuthEffect.ts
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { DependencyList, useEffect, useRef } from "react";
import { authEvents } from "../authEvents";

export function useAuthEffect(
  callback: (event: AuthChangeEvent, session: Session | null) => void,
  deps?: DependencyList,
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useEffect(() => {
    console.log("[useAuthEffect] executing auth update");
    callbackRef.current("INITIAL_SESSION", null);
    const unsubscribe = authEvents.on(callback);
    return () => {
      unsubscribe();
    };
  }, deps);
}
