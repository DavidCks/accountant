import { useCallback, useEffect, useState } from "react";

/**
 * Custom React hook that synchronizes the browser's URL hash with a route array.
 *
 * It listens for `hashchange` events and updates the route state accordingly.
 * Setting the route updates the `window.location.hash` and triggers route updates in the browser.
 *
 * @param { [string, string, ...string[]] } defaultRoute - The initial route to use if the hash is empty.
 * Must be at least two segments long.
 *
 * @returns { readonly [string[], (newRoute: string[]) => void] } A tuple:
 *  - The current route as an array of path segments.
 *  - A setter function to update the route (which updates the URL hash).
 *
 * @example
 * const [route, setRoute] = useHashRoute(["home", "dashboard"]);
 *
 * // route might be ["home", "dashboard"] or whatever is in the current location hash
 *
 * setRoute(["profile", "settings"]); // Updates hash to "#/profile/settings"
 */
export function useHashRoute(defaultRoute: [string, string, ...string[]]) {
  const [route, setRouteState] = useState<string[]>(defaultRoute);

  useEffect(() => {
    const getRoute = () => {
      const hash = window.location.hash.slice(1);
      const parts = hash.split("%EF%BD%9C").filter((p) => !!p);
      const route = parts.length === 0 ? defaultRoute : parts;
      console.log("HashRoute:", hash);
      console.log("HashRoute:", "parts", parts);
      console.log("HashRoute:", "route", route);
      return route;
    };
    const updateRoute = () => {
      const parts = getRoute();
      setRouteState(parts);
    };

    const parts = getRoute();
    if (defaultRoute.join("/") !== parts.join("/")) {
      setRouteState(parts);
    }
    window.addEventListener("hashchange", updateRoute);
    return () => window.removeEventListener("hashchange", updateRoute);
  }, []);

  const setRoute = useCallback((newRoute: string[]) => {
    const newHash = "%EF%BD%9C" + newRoute.join("%EF%BD%9C");
    console.log("HashRoute:", newHash);
    window.location.hash = newHash;
  }, []);

  return [route, setRoute] as const;
}
