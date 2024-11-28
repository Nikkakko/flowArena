"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UploadButton } from "@/lib/uploadthing";
import { toUpperCase } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as React from "react";
import { updateUserAction } from "@/lib/actions/update-user";
import ProfileImage from "../ProfileImage";

const formSchema = z.object({
  name: z.string().min(2),
  imageUrl: z.string().url().optional(),
});

type UpdateProfileFormProps = {
  initialData: {
    name: string;
    imageUrl?: string | null;
  };
};

export function UpdateProfileForm({ initialData }: UpdateProfileFormProps) {
  const [isPending, startTransition] = React.useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name,
      imageUrl: initialData.imageUrl || "",
    },
  });

  // Get current image URL from form
  const currentImageUrl =
    form.watch("imageUrl") && form.watch("imageUrl") !== initialData.imageUrl;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        await updateUserAction({
          name: values.name,
          imageUrl: values.imageUrl,
        });

        form.reset();
      } catch (error) {
        console.error("[USER_UPDATE]", error);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">
                {toUpperCase("სახელი")}
              </FormLabel>
              <FormControl>
                <Input {...field} className="text-gray-500" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel className="text-white">
            {toUpperCase("პროფილის სურათი")}
          </FormLabel>

          {/* Image Preview */}
          {currentImageUrl && (
            <ProfileImage
              src={form.watch("imageUrl") || "/assets/artist-placeholder.webp"}
            />
          )}

          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={res => {
              if (res?.[0]?.url) {
                form.setValue("imageUrl", res[0].url);
              }
            }}
            onUploadError={(error: Error) => {
              console.error(error);
            }}
          />
        </div>

        <Button type="submit" className="text-white" disabled={isPending}>
          {toUpperCase("განახლება")}
        </Button>
      </form>
    </Form>
  );
}
