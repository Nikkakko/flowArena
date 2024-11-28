"use server";
import { getUser } from "@/lib/db/queries";
import prisma from "@/lib/db/db";
import * as z from "zod";
import { actionClient } from "../safe-action";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  name: z.string().min(2),
  imageUrl: z.string().url().optional(),
});

export const updateUserAction = actionClient
  .schema(formSchema)
  .action(async ({ parsedInput }) => {
    try {
      const currentUser = await getUser();
      if (!currentUser) {
        return {
          error: "Unauthorized",
          status: 401,
        };
      }

      const { name, imageUrl } = parsedInput;

      const updatedUser = await prisma.user.update({
        where: {
          id: currentUser.id,
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
