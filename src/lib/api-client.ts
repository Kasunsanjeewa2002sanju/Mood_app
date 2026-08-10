const PIN_STORAGE_KEY = "mood_bridge_pin";

export function getStoredPin(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(PIN_STORAGE_KEY);
}

export function setStoredPin(pin: string): void {
  sessionStorage.setItem(PIN_STORAGE_KEY, pin);
}

export function clearStoredPin(): void {
  sessionStorage.removeItem(PIN_STORAGE_KEY);
}

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const pin = getStoredPin();
  const headers = new Headers(options.headers);
  if (pin) headers.set("x-app-pin", pin);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, { ...options, headers, credentials: "include" });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Request failed");
  }

  return data as T;
}
