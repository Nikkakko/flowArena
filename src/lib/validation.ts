import * as z from "zod";
import { toUpperCase } from "./utils";

export const authSchema = z.object({
  email: z.string().email({ message: toUpperCase("არასწორი ელ.ფოსტა") }),
  password: z.string().min(8, {
    message: toUpperCase("პაროლი უნდა იყოს მინიმუმ 8 სიმბოლო"),
  }),
});

export const commentSchema = z.object({
  content: z.string().min(1, {
    message: "კომენტარი ცარიელია",
  }),
});