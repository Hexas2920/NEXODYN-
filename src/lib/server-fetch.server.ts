import http from "node:http";
import https from "node:https";

function isNodeRuntime() {
  return typeof process !== "undefined" && typeof process.versions?.node === "string";
}

export function shouldSkipTlsVerify() {
  if (process.env.NEON_TLS_SKIP_VERIFY === "true") return true;
  if (process.env.NEON_TLS_SKIP_VERIFY === "false") return false;
  return process.env.NODE_ENV === "development";
}

function normalizeHeaders(headers?: HeadersInit): Record<string, string> {
  if (!headers) return {};
  if (headers instanceof Headers) {
    return Object.fromEntries(headers.entries());
  }
  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }
  return headers as Record<string, string>;
}

async function readRequestBody(body: BodyInit | null | undefined) {
  if (!body) return undefined;
  if (typeof body === "string") return Buffer.from(body);
  if (body instanceof ArrayBuffer) return Buffer.from(body);
  if (ArrayBuffer.isView(body)) {
    return Buffer.from(body.buffer, body.byteOffset, body.byteLength);
  }
  if (body instanceof Blob) return Buffer.from(await body.arrayBuffer());
  return undefined;
}

function createNodeFetch(agent?: https.Agent): typeof fetch {
  return (input, init) => {
    const url =
      typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    const parsed = new URL(url);
    const isHttps = parsed.protocol === "https:";
    const lib = isHttps ? https : http;

    return readRequestBody(init?.body).then(
      (bodyBuffer) =>
        new Promise<Response>((resolve, reject) => {
          const req = lib.request(
            url,
            {
              method: init?.method ?? "GET",
              headers: normalizeHeaders(init?.headers),
              agent: isHttps ? agent : undefined,
            },
            (res) => {
              const chunks: Buffer[] = [];
              res.on("data", (chunk) => chunks.push(chunk));
              res.on("end", () => {
                resolve(
                  new Response(Buffer.concat(chunks), {
                    status: res.statusCode ?? 500,
                    statusText: res.statusMessage,
                    headers: new Headers(res.headers as Record<string, string>),
                  }),
                );
              });
            },
          );

          req.on("error", reject);
          if (bodyBuffer?.length) req.write(bodyBuffer);
          req.end();
        }),
    );
  };
}

let _serverFetch: typeof fetch | undefined;

/** Node dev fetch that tolerates corporate TLS interception; uses native fetch elsewhere. */
export function getServerFetch() {
  if (_serverFetch) return _serverFetch;

  if (isNodeRuntime() && shouldSkipTlsVerify()) {
    _serverFetch = createNodeFetch(new https.Agent({ rejectUnauthorized: false }));
    return _serverFetch;
  }

  _serverFetch = fetch;
  return _serverFetch;
}
