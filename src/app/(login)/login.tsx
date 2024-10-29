"use client";
import * as React from "react";
import { CircleIcon, Loader2Icon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";

import Link from "next/link";
import { signIn, signUp } from "./_actions";
import { toUpperCase } from "@/lib/utils";

interface LoginProps {
  mode?: "signin" | "signup";
}

const Login: React.FC<LoginProps> = ({ mode = "signin" }: LoginProps) => {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [error, setError] = React.useState<string | undefined>(undefined);
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  // 1. Define your form.
  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof authSchema>) {
    startTransition(async () => {
      if (mode === "signin") {
        // Sign in.
        const signInAction = await signIn(values);
        if ("error" in signInAction) {
          setError(signInAction.error);
        }

        form.reset();
      } else {
        // Sign up.
        const signUpAction = await signUp(values);
        if ("error" in signUpAction) {
          setError(signUpAction.error);
        }

        form.reset();
      }
    });
  }
  return (
    <div className="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          {/* <CircleIcon className="h-12 w-12 text-primary" /> */}
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-primary">
          {mode === "signin"
            ? toUpperCase("ავტორიზაცია")
            : toUpperCase("რეგისტრაცია")}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    {toUpperCase("ელ. ფოსტა")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={toUpperCase("შეიყვანეთ ელ. ფოსტა")}
                      {...field}
                      type="email"
                      autoComplete="email"
                      className="text-white focus:outline-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    {toUpperCase("პაროლი")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={
                        mode === "signin"
                          ? toUpperCase("შეიყვანეთ პაროლი")
                          : toUpperCase("შეიყვანეთ ახალი პაროლი")
                      }
                      autoComplete={
                        mode === "signin" ? "current-password" : "new-password"
                      }
                      className="text-white focus:outline-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-primary md:hover:bg-primary-foreground focus:outline-none focus:ring-2 focus:ring-offset-2  active:bg-primary-foreground"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
                    {toUpperCase("იტვირთება")}
                  </>
                ) : mode === "signin" ? (
                  toUpperCase("შესვლა")
                ) : (
                  toUpperCase("რეგისტრაცია")
                )}
              </Button>
            </div>
          </form>
        </Form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                {mode === "signin"
                  ? toUpperCase("არ გაქვთ ანგარიში?")
                  : toUpperCase("გაქვთ ანგარიში?")}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href={`${mode === "signin" ? "/sign-up" : "/sign-in"}${
                redirect ? `?redirect=${redirect}` : ""
              }`}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {/* {mode === "signin"
                ? "Create an account"
                : "Sign in to existing account"} */}

              {mode === "signin"
                ? toUpperCase("შექმენი ანგარიში")
                : toUpperCase("შესვლა  ანგარიშზე")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
