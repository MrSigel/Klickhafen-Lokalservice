import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "kh_admin";

export function getAdminToken() {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error("ADMIN_PASSWORD fehlt.");
  }

  return createHash("sha256").update(`klickhafen:${password}`).digest("hex");
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  const cookieToken = store.get(COOKIE_NAME)?.value;

  if (!cookieToken) {
    return false;
  }

  const expected = getAdminToken();
  const left = Buffer.from(cookieToken);
  const right = Buffer.from(expected);

  return left.length === right.length && timingSafeEqual(left, right);
}

export { COOKIE_NAME };
