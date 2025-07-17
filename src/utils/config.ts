export let FRED_API_KEY = process.env.NEXT_PUBLIC_FRED_API_KEY || "";

/**
 * Load the FRED API key from `config.yaml` if it is not already
 * provided via the `NEXT_PUBLIC_FRED_API_KEY` environment variable.
 */
export async function loadFredApiKey(): Promise<string> {
  if (FRED_API_KEY) return FRED_API_KEY;
  try {
    const res = await fetch("/config.yaml");
    const text = await res.text();
    const match = text.match(/FRED_API_KEY:\s*["']?(.*?)["']?\s*$/m);
    if (match) {
      FRED_API_KEY = match[1].trim();
    }
  } catch (err) {
    console.error("Failed to load FRED API key", err);
  }
  return FRED_API_KEY;
}
