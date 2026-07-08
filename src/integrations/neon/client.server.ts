import { neon, neonConfig } from "@neondatabase/serverless";

import { getServerFetch, shouldSkipTlsVerify } from "@/lib/server-fetch.server";

let _sql: ReturnType<typeof neon> | undefined;

function isNodeRuntime() {
  return typeof process !== "undefined" && typeof process.versions?.node === "string";
}

function configureNeonTls() {
  if (!isNodeRuntime() || !shouldSkipTlsVerify()) return;
  neonConfig.fetchFunction = getServerFetch();
}

configureNeonTls();

function getSqlClient() {
  if (_sql) return _sql;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "Missing DATABASE_URL. Add your Neon connection string to .env (from https://console.neon.tech).",
    );
  }

  _sql = neon(databaseUrl);
  return _sql;
}

export const sql = ((strings: TemplateStringsArray, ...values: unknown[]) =>
  getSqlClient()(strings, ...values)) as ReturnType<typeof neon>;
