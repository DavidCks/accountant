import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async () => {
  const shouldProceedWithExchangeUpdate = async (
    SUPABASE_URL: string,
    SUPABASE_SERVICE_ROLE_KEY: string,
  ) => {
    const now = new Date();
    const usaNow = new Date(
      now.toLocaleString("en-US", { timeZone: "America/New_York" }),
    );

    // Fetch the latest recorded timestamp from history
    const historyRes = await fetch(
      `${SUPABASE_URL}/rest/v1/currency_exchange_history?select=recorded_at&order=recorded_at.desc&limit=1`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!historyRes.ok) {
      const errText = await historyRes.text();
      console.error("Failed to query currency_exchange_history:", errText);
      return {
        value: false,
        response: new Response(
          JSON.stringify({
            error: "Failed to query exchange history.",
            details: errText,
          }),
          { status: 500, headers: { "Content-Type": "application/json" } },
        ),
      };
    }

    const history = await historyRes.json();

    if (history.length === 0) {
      return { value: true, response: null }; // No prior updates → proceed
    }

    const lastRecorded = new Date(history[0].recorded_at);
    const elapsedMs = usaNow.getTime() - lastRecorded.getTime();
    const minIntervalMs = 23.83 * 60 * 60 * 1000; // ≈ 23h50m

    if (elapsedMs < minIntervalMs) {
      const waitMinutes = Math.ceil((minIntervalMs - elapsedMs) / 60000);
      return {
        value: false,
        response: new Response(
          JSON.stringify({
            error: "Exchange rates can only be updated once per 24 hours.",
            lastRecorded: lastRecorded.toISOString(),
            now: usaNow.toISOString(),
            waitMinutes,
          }),
          {
            status: 429,
            headers: { "Content-Type": "application/json" },
          },
        ),
      };
    }

    return { value: true, response: null };
  };

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const EXCHANGE_API_KEY = Deno.env.get("EXCHANGE_API_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !EXCHANGE_API_KEY) {
      throw new Error("Missing required environment variables.");
    }

    const check = await shouldProceedWithExchangeUpdate(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
    );
    if (check.response) return check.response;

    // Step 1: Get all fiat currencies from Supabase
    const fiatRes = await fetch(
      `${SUPABASE_URL}/rest/v1/currencies?type=eq.fiat`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!fiatRes.ok) {
      throw new Error(`Failed to query currencies: ${await fiatRes.text()}`);
    }

    const fiatCurrencies = await fiatRes.json();

    // Step 2: Collect codes
    const symbols = fiatCurrencies.map((c: any) => c.code).join(",");

    if (!symbols) {
      return new Response(
        JSON.stringify({ message: "No fiat currencies found." }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Step 3: Fetch exchange rates from API
    const exchangeRes = await fetch(
      `https://api.exchangeratesapi.io/v1/latest?access_key=${EXCHANGE_API_KEY}`,
    );
    const exchangeData = await exchangeRes.json();

    if (!exchangeData.success) {
      throw new Error(
        `Exchange rate API error: ${JSON.stringify(exchangeData.error)}`,
      );
    }

    const rates = exchangeData.rates;

    const eurToUsd = 1 / rates["USD"];

    // Step 4: For each currency, update the exchange_rate
    const updates = await Promise.all(
      fiatCurrencies.map(async (currency: any) => {
        const newRate = rates[currency.code];
        if (!newRate) return null;

        const patchRes = await fetch(
          `${SUPABASE_URL}/rest/v1/currencies?code=eq.${currency.code}`,
          {
            method: "PATCH",
            headers: {
              apikey: SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              "Content-Type": "application/json",
              Prefer: "return=representation",
            },
            body: JSON.stringify({ exchange_rate: newRate * eurToUsd }),
          },
        );

        if (!patchRes.ok) {
          console.error(
            `Failed to update ${currency.code}: ${await patchRes.text()}`,
          );
          return null;
        }

        const [updatedCurrency] = await patchRes.json();

        // Insert into history table
        const postRes = await fetch(
          `${SUPABASE_URL}/rest/v1/currency_exchange_history`,
          {
            method: "POST",
            headers: {
              apikey: SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              code: updatedCurrency.code,
              name: updatedCurrency.name,
              type: updatedCurrency.type,
              symbol: updatedCurrency.symbol,
              region: updatedCurrency.region,
              exchange_rate: updatedCurrency.exchange_rate,
              recorded_at: new Date().toISOString(),
            }),
          },
        );

        if (!postRes.ok) {
          console.error(
            `Failed to update historical ${currency.code}: ${await postRes.text()}`,
          );
          return null;
        }

        return updatedCurrency;
      }),
    );

    // Step 4: Fetch crypto currencies
    const cryptoRes = await fetch(
      `${SUPABASE_URL}/rest/v1/currencies?type=eq.crypto`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!cryptoRes.ok) {
      throw new Error(
        `Failed to query crypto currencies: ${await cryptoRes.text()}`,
      );
    }

    const cryptoCurrencies = await cryptoRes.json();

    // Step 5: Fetch crypto market data
    const cryptoMarketRes = await fetch("https://cryptorates.ai/v1/coins/500");
    const cryptoMarketData = await cryptoMarketRes.json();

    const cryptoRatesMapUSD = Object.fromEntries(
      cryptoMarketData.map((c: any) => [c.symbol.toUpperCase(), c.price]),
    );

    // Step 6: Update crypto exchange rates
    const cryptoUpdates = await Promise.all(
      cryptoCurrencies.map(async (currency: any) => {
        const priceUSD = cryptoRatesMapUSD[currency.code];
        if (!priceUSD) return null;

        const patchRes = await fetch(
          `${SUPABASE_URL}/rest/v1/currencies?code=eq.${currency.code}`,
          {
            method: "PATCH",
            headers: {
              apikey: SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              "Content-Type": "application/json",
              Prefer: "return=representation",
            },
            body: JSON.stringify({ exchange_rate: 1 / priceUSD }),
          },
        );

        if (!patchRes.ok) {
          console.error(
            `Failed to update ${currency.code}: ${await patchRes.text()}`,
          );
          return null;
        }

        const [updatedCurrency] = await patchRes.json();

        // Insert into history table
        const postRes = await fetch(
          `${SUPABASE_URL}/rest/v1/currency_exchange_history`,
          {
            method: "POST",
            headers: {
              apikey: SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              code: updatedCurrency.code,
              name: updatedCurrency.name,
              type: updatedCurrency.type,
              symbol: updatedCurrency.symbol,
              region: updatedCurrency.region,
              exchange_rate: 1 / updatedCurrency.exchange_rate,
              recorded_at: new Date().toISOString(),
            }),
          },
        );

        if (!postRes.ok) {
          console.error(
            `Failed to update ${currency.code}: ${await postRes.text()}`,
          );
          return null;
        }

        return await updatedCurrency;
      }),
    );

    return new Response(
      JSON.stringify({
        message: "Exchange rates updated",
        updated: [...updates, ...cryptoUpdates].filter(Boolean),
      }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
