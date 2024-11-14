import { Role, User } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const key = new TextEncoder().encode(process.env.AUTH_SECRET);

const SALT_ROUNDS = 10;

export async function hashPassword(password: string) {
  return hash(password, SALT_ROUNDS);
}

export async function comparePasswords(
  plainTextPassword: string,
  hashedPassword: string
) {
  return compare(plainTextPassword, hashedPassword);
}

type SessionData = {
  user: { id: string; role: Role };
  expires: string;
};

export async function signToken(payload: SessionData) {
  try {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1 day from now")
      .sign(key);
  } catch (error) {
    console.error("Token signing error:", error);
    throw error;
  }
}

export async function verifyToken(input: string) {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload as SessionData;
  } catch (error) {
    console.error("Token verification error:", error);
    throw error;
  }
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await verifyToken(session);
}

export async function setSession(user: User) {
  const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
  const session: SessionData = {
    user: { id: user.id!, role: user.role },
    expires: expiresInOneDay.toISOString(),
  };
  const encryptedSession = await signToken(session);
  cookies().set("session", encryptedSession, {
    expires: expiresInOneDay,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
}

export async function clearSession() {
  cookies().set("session", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
}
