import { headers } from "next/headers";

const DEFAULT_DEBUGGER_URL =
  process.env.DEBUGGER_URL ?? "http://localhost:3010/";

export const DEFAULT_DEBUGGER_HUB_URL =
  process.env.NODE_ENV === "development"
    ? new URL("/hub", DEFAULT_DEBUGGER_URL).toString()
    : undefined;

export function currentURL(pathname: string): URL {
  const headersList = headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";

  try {
    return new URL(pathname, `${protocol}://${host}`);
  } catch (error) {
    return new URL("http://localhost:3000");
  }
}

export function appURL() {
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  } else {
    const url = process.env.BASE_URL || vercelURL() || "http://localhost:3000";
    console.log(url);
    console.warn(
      `Warning: APP_URL environment variable is not set. Falling back to ${url}.`
    );
    return url;
  }
}

export function vercelURL() {
  return process.env.BASE_URL
    ? `https://${process.env.BASE_URL}`
    : "http://localhost:3000";
}

export const FRAMES_BASE_PATH = "/frames";
