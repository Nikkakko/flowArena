"use server";
import prisma from "@/lib/db/db";
import * as z from "zod";
import { actionClient } from "../safe-action";
import { revalidatePath } from "next/cache";
import { getSession } from "../auth/session";

const formSchema = z.object({
  name: z.string().min(2),
  imageUrl: z.string().url().optional(),
});

export const updateUserAction = actionClient
  .schema(formSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await getSession();
      if (!session?.user) {
        return {
          error: "Unauthorized",
          status: 401,
        };
      }

      const { name, imageUrl } = parsedInput;

      const updatedUser = await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          name,
          imageUrl,
        },
      });

      //revalidate
      revalidatePath("/profile");
      return updatedUser;
    } catch (error) {
      console.error("[USER_UPDATE]", error);
      return {
        error: "Internal Error",
        status: 500,
      };
    }
  });
