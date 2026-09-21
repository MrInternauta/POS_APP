export interface JwtPayload {
  exp?: number;
  iat?: number;
  sub?: number;
  role?: string;
}

/** Seconds before the real expiration at which a token is already considered dead */
const EXPIRATION_SKEW_SECONDS = 30;

function decodeBase64Url(value: string): string {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  const binary = atob(padded);
  //atob gives one byte per character, the escape sequence brings back the utf-8 characters
  return decodeURIComponent(
    binary
      .split('')
      .map(character => '%' + ('00' + character.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

export function decodeToken(token?: string | null): JwtPayload | null {
  const payload = token?.split('.')[1];
  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(payload));
  } catch (error) {
    return null;
  }
}

/** A token without an exp claim never expires on its own, only the API can reject it */
export function isTokenExpired(token?: string | null): boolean {
  const exp = decodeToken(token)?.exp;
  if (!exp) {
    return false;
  }

  return exp * 1000 <= Date.now() + EXPIRATION_SKEW_SECONDS * 1000;
}
