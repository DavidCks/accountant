// useAuthEffect.ts
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { DependencyList, useEffect, useRef } from "react";
import { authEvents } from "../authEvents";

export function useAuthEffect(
  callback: (
    event: AuthChangeEvent | "INITIAL_SESSION",
    session: Session | null,
  ) => void,
  deps: DependencyList = [], // default to []
) {
  const callbackRef = useRef(callback);
  // keep latest callback without changing the subscription
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    // fire once on mount
    callbackRef.current("INITIAL_SESSION", null);

    // stable handler that always calls the latest callback
    const handler = (event: AuthChangeEvent, session: Session | null) => {
      callbackRef.current(event, session);
    };

    const unsubscribe = authEvents.on(handler);
    return () => {
      unsubscribe();
    };
  }, deps);
}
