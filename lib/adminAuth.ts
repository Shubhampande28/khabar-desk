// Single shared password, no accounts/session store. Deliberately uses the
// Web Crypto API (not Node's `crypto` module) so this works unmodified in
// both Next.js middleware (edge runtime) and ordinary route handlers.
export const ADMIN_SESSION_COOKIE = "khabaradda_admin";

async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function adminPassword(): string | null {
  return process.env.ADMIN_PASSWORD || null;
}

export function isAdminConfigured(): boolean {
  return adminPassword() !== null;
}

export async function checkAdminPassword(candidate: string): Promise<boolean> {
  const real = adminPassword();
  if (!real) return false;
  return candidate === real;
}

// The cookie's value is the password's own hash — anyone holding a valid
// cookie has, by construction, supplied the correct password at some
// point. Verifying only needs recomputing this hash, no server-side
// session table.
export async function sessionCookieValue(): Promise<string | null> {
  const real = adminPassword();
  if (!real) return null;
  return sha256Hex(real);
}

export async function isValidSessionCookie(value: string | undefined | null): Promise<boolean> {
  if (!value) return false;
  const expected = await sessionCookieValue();
  if (!expected) return false;
  return value === expected;
}
