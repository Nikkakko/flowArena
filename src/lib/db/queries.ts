import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/session";
import db from "@/lib/db/db";

export async function getUser() {
  const sessionCookie = cookies().get("session");
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (
    !sessionData ||
    !sessionData.user ||
    typeof sessionData.user.id !== "string"
  ) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const user = await db.user.findMany({
    where: {
      id: sessionData.user.id,
    },
    take: 1,
  });

  if (user.length === 0) {
    return null;
  }

  return user[0];
}

export async function getArtists() {
  try {
    return db.artist.findMany();
  } catch (error) {
    console.error(error);
  }
}
