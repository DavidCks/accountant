import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async () => {
  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const EXCHANGE_API_KEY = Deno.env.get("EXCHANGE_API_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !EXCHANGE_API_KEY) {
      throw new Error("Missing required environment variables.");
    }

    // Step 1: Get all fiat currencies from Supabase
    const fiatRes = await fetch(
      `${SUPABASE_URL}/rest/v1/currencies?type=eq.fiat`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
        },
      }
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
        }
      );
    }

    // Step 3: Fetch exchange rates from API
    const exchangeRes = await fetch(
      `https://api.exchangeratesapi.io/v1/latest?access_key=${EXCHANGE_API_KEY}`
    );
    const exchangeData = await exchangeRes.json();

    if (!exchangeData.success) {
      throw new Error(
        `Exchange rate API error: ${JSON.stringify(exchangeData.error)}`
      );
    }

    const rates = exchangeData.rates;

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
            body: JSON.stringify({ exchange_rate: newRate }),
          }
        );

        if (!patchRes.ok) {
          console.error(
            `Failed to update ${currency.code}: ${await patchRes.text()}`
          );
          return null;
        }

        return await patchRes.json();
      })
    );

    const eurToUsd = rates["USD"];
    if (!eurToUsd || typeof eurToUsd !== "number") {
      throw new Error("Missing EUR to USD exchange rate in fiat data");
    }
    const usdToEur = 1 / eurToUsd;

    // Step 4: Fetch crypto currencies
    const cryptoRes = await fetch(
      `${SUPABASE_URL}/rest/v1/currencies?type=eq.crypto`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!cryptoRes.ok) {
      throw new Error(
        `Failed to query crypto currencies: ${await cryptoRes.text()}`
      );
    }

    const cryptoCurrencies = await cryptoRes.json();

    // Step 5: Fetch crypto market data
    const cryptoMarketRes = await fetch("https://cryptorates.ai/v1/coins/500");
    const cryptoMarketData = await cryptoMarketRes.json();

    const cryptoRatesMapUSD = Object.fromEntries(
      cryptoMarketData.map((c: any) => [c.symbol.toUpperCase(), c.price])
    );

    // Step 6: Update crypto exchange rates (convert USD → EUR)
    const cryptoUpdates = await Promise.all(
      cryptoCurrencies.map(async (currency: any) => {
        const priceUSD = cryptoRatesMapUSD[currency.code];
        if (!priceUSD) return null;

        const priceEUR = priceUSD / usdToEur;

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
            body: JSON.stringify({ exchange_rate: priceEUR }),
          }
        );

        if (!patchRes.ok) {
          console.error(
            `Failed to update ${currency.code}: ${await patchRes.text()}`
          );
          return null;
        }

        return await patchRes.json();
      })
    );

    return new Response(
      JSON.stringify({
        message: "Exchange rates updated",
        updated: [...updates, ...cryptoUpdates].filter(Boolean),
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
