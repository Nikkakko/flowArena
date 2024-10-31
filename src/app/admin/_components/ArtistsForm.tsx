"use client";
import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { artistSchema, ArtistZodType } from "../validation/artists-validation";
import { toUpperCase } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";

interface ArtistsFormProps {}

const ArtistsForm: React.FC<ArtistsFormProps> = ({}) => {
  // 1. Define your form.
  const form = useForm<ArtistZodType>({
    resolver: zodResolver(artistSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      nickName: "",
      image: "",
      wins: undefined,
      loses: undefined,
      bio: "",
      quotes: [],
      socialMedia: [],
      battlesParticipated: [],
      seasonsWon: [],
      battlesWon: [],
    },
  });
  const [image, setImage] = React.useState<string | undefined>(
    form.watch("image")
  );

  // 2. Define a submit handler.
  function onSubmit(values: ArtistZodType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  console.log(form.watch());
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-10">
        <div className="max-w-sm">
          {image ? (
            <div className="relative w-full max-w-20">
              <Image
                src={image}
                alt="artist"
                className="w-20 h-20 rounded-full object-cover "
                width={80}
                height={80}
              />
              <Button
                onClick={() => setImage(undefined)}
                className=" text-white absolute top-0 right-0 w-4 h-4 rounded-full"
                type="button"
              >
                {toUpperCase("X")}
              </Button>
            </div>
          ) : (
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    {toUpperCase("სურათი")}
                  </FormLabel>
                  <FormControl>
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={res => {
                        // Do something with the response
                        console.log("Files: ", res);
                        setImage(res[0].url);
                        field.onChange(res[0].url);
                      }}
                      onUploadError={(error: Error) => {
                        // Do something with the error.
                        alert(`ERROR! ${error.message}`);
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">
                  {toUpperCase("სახელი")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={toUpperCase("სახელი")}
                    {...field}
                    className="text-white"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">
                  {toUpperCase("გვარი")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={toUpperCase("გვარი")}
                    {...field}
                    className="text-white"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nickName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">
                  {toUpperCase("მეტსახელი")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={toUpperCase("მეტსახელი")}
                    {...field}
                    className="text-white"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="wins"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">
                  {toUpperCase("გამარჯვება")}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={toUpperCase("გამარჯვება")}
                    {...field}
                    className="text-white"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="loses"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">
                  {toUpperCase("წაგება")}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={toUpperCase("წაგება")}
                    {...field}
                    className="text-white"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">
                {toUpperCase("ბიოგრაფია")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={toUpperCase("ბიოგრაფია")}
                  {...field}
                  className="text-white"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">
                {toUpperCase("ციტატები (გამოიყენეთ მძიმე)")}
              </FormLabel>
              <FormControl>
                <Input
                  id="quotes"
                  name="quotes"
                  value={field.value.join(", ")}
                  placeholder={toUpperCase("ციტატები")}
                  className="text-white"
                  onChange={e =>
                    field.onChange(e.target.value.split(",").map(q => q.trim()))
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="text-white">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default ArtistsForm;
