// ./src/app/__types__/generate.ts
const run = async () => {
  const SUPABASE_URL = Bun.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = Bun.env.SUPABASE_SERVICE_ROLE_KEY;
  const OUTPUT_FILE = "./src/app/__types__/generated/Currencies.ts";

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env"
    );
  }

  // Fetch all currencies from Supabase
  const res = await fetch(`${SUPABASE_URL}/rest/v1/currencies?select=*`, {
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch currencies: ${await res.text()}`);
  }

  const data = await res.json();

  // Generate CurrencyCode union type
  const codes = Array.from(new Set(data.map((c: any) => `"${c.code}"`))).sort();
  const typeDef = `export type CurrencyCode =\n  ${codes.join(" |\n  ")};\n`;

  // Generate currencies object
  const constEntries = data
    .map(
      (c: any) => `  "${c.code}": {
    code: "${c.code}",
    name: "${c.name.replace(/"/g, '\\"')}",
    type: "${c.type}",
    symbol: "${c.symbol.replace(/"/g, '\\"')}",
    region: "${c.region.replace(/"/g, '\\"')}",
  },`
    )
    .join("\n");

  const constObj = `export const currencies: {
  [currencyCode: string]: {
    code: CurrencyCode;
    name: string;
    type: "crypto" | "fiat";
    symbol: string;
    region: string;
  };
} = {\n${constEntries}\n};\n`;

  // Write to file
  await Bun.write(OUTPUT_FILE, typeDef + "\n\n" + constObj);
  console.log(`✅ Wrote ${OUTPUT_FILE}`);
};
run();
