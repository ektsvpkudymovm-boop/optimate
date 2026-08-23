type BoundedJsonOptions = {
  maxBytes: number;
  requireObject?: boolean;
};

type BoundedJsonSuccess = {
  ok: true;
  data: unknown;
};

type BoundedJsonFailure = {
  ok: false;
  status: 400 | 413;
  body: { error: string };
};

export type BoundedJsonResult = BoundedJsonSuccess | BoundedJsonFailure;

export async function readBoundedJson(
  request: Request,
  options: BoundedJsonOptions
): Promise<BoundedJsonResult> {
  const contentLength = request.headers.get("content-length");
  if (contentLength) {
    const declaredSize = Number(contentLength);
    if (Number.isFinite(declaredSize) && declaredSize > options.maxBytes) {
      return {
        ok: false,
        status: 413,
        body: { error: "Request body too large" },
      };
    }
  }

  const bodyText = await readBoundedText(request, options.maxBytes);
  if (bodyText === null) {
    return {
      ok: false,
      status: 413,
      body: { error: "Request body too large" },
    };
  }

  let data: unknown;
  try {
    data = JSON.parse(bodyText);
  } catch {
    return {
      ok: false,
      status: 400,
      body: { error: "Invalid JSON body" },
    };
  }

  if (
    options.requireObject &&
    (!data || typeof data !== "object" || Array.isArray(data))
  ) {
    return {
      ok: false,
      status: 400,
      body: { error: "Invalid JSON body" },
    };
  }

  return { ok: true, data };
}

async function readBoundedText(
  request: Request,
  maxBytes: number
): Promise<string | null> {
  if (!request.body) return "";

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bytesRead = 0;
  let text = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      bytesRead += value.byteLength;
      if (bytesRead > maxBytes) return null;

      text += decoder.decode(value, { stream: true });
    }

    text += decoder.decode();
    return text;
  } finally {
    reader.releaseLock();
  }
}
