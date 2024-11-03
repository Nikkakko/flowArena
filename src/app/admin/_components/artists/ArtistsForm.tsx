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
import { artistSchema, ArtistFormValues } from "../../lib/artists-validation";
import { toUpperCase } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { MultiSelect } from "@/components/ui/multi-select";
import { Artist, Battle, Season, SocialMediaPlatforms } from "@prisma/client";
import addArtist, { updateArtist } from "../../_actions/action-artists";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

interface ArtistsFormProps {
  initialData?: ArtistFormValues & { id: string };
  artists?: Artist[] | undefined;
  battles?: Battle[] | undefined;
  seasons?: Season[] | undefined;
}

const ArtistsForm: React.FC<ArtistsFormProps> = ({
  initialData,
  artists,
  battles,
  seasons,
}) => {
  const [isPending, startTransition] = React.useTransition();
  const { toast } = useToast();
  // 1. Define your form.
  const form = useForm<ArtistFormValues>({
    resolver: zodResolver(artistSchema),
    defaultValues: {
      nickName: initialData?.nickName || "",
      image: initialData?.image || "",
      wins: initialData?.wins || "0",
      loses: initialData?.loses || "0",
      isPopular: initialData?.isPopular || false,
      bio: initialData?.bio || "",
      quotes: initialData?.quotes || [],
      socialMedia: initialData?.socialMedia || [],
      battlesParticipated: initialData?.battlesParticipated || [],
      seasonsWon: initialData?.seasonsWon || [],
      battlesWon: initialData?.battlesWon || [],
    },
  });
  const [image, setImage] = React.useState<string | null>(
    form.watch("image") || null
  );

  // 2. Define a submit handler.
  function onSubmit(values: ArtistFormValues) {
    startTransition(async () => {
      try {
        if (initialData) {
          await updateArtist(initialData.id, values);
          toast({
            title: "Artist updated successfully",
            variant: "default",
            duration: 5000,
          });
        } else {
          await addArtist(values);
          form.reset();
          setImage(null);
          toast({
            title: "Artist added successfully",
            variant: "default",
            duration: 5000,
          });
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Something went wrong",
          variant: "destructive",
          duration: 5000,
        });
      }
    });
  }

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
                onClick={() => setImage(null)}
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

        {/* multi quote */}
        <FormField
          control={form.control}
          name="quotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">
                {toUpperCase("ციტატები")}
              </FormLabel>
              <FormControl>
                <>
                  {field.value.map((quote, index: number) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <Input
                        value={quote}
                        onChange={e => {
                          const newQuotes = field.value.map((q, i) =>
                            i === index ? e.target.value : q
                          );
                          field.onChange(newQuotes);
                        }}
                        placeholder="ციტატა"
                        className="text-white"
                      />
                      <Button
                        onClick={() => {
                          const newQuotes = field.value.filter(
                            (_, i) => i !== index
                          );
                          field.onChange(newQuotes);
                        }}
                        type="button"
                        variant="destructive"
                        className="text-white"
                      >
                        {toUpperCase("X")}
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={() => field.onChange([...field.value, ""])}
                    type="button"
                    className="text-white"
                  >
                    {toUpperCase("დამატება")}
                  </Button>
                </>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* multi select battlesParticipated */}

        <div>
          <FormDescription className="text-white">
            {toUpperCase("ბეთლებში მონაწილ��ობა")}
          </FormDescription>
          <MultiSelect
            options={
              battles?.map(battle => ({
                label: battle.title,
                value: battle.id,
              })) || []
            }
            onValueChange={(value: string[]) => {
              form.setValue(
                "battlesParticipated",
                value.map(v => ({
                  value: v,
                  label: battles?.find(b => b.id === v)?.title || v,
                }))
              );
            }}
            defaultValue={form
              .watch("battlesParticipated")
              .map(battle => battle.value)}
            placeholder={toUpperCase(
              "მონიშნეთ ბეთლები რომელშიც მონაწილეობა მიიღო არტისტმა"
            )}
            variant="inverted"
            maxCount={3}
          />
        </div>

        {/* multi select seasonsWon */}
        <div>
          <FormDescription className="text-white">
            {toUpperCase("მოგებული სეზონები")}
          </FormDescription>
          <MultiSelect
            options={
              seasons?.map(season => ({
                label: season.name,
                value: season.id,
              })) || []
            }
            onValueChange={(value: string[]) => {
              form.setValue(
                "seasonsWon",
                value.map(v => ({
                  value: v,
                  label: seasons?.find(s => s.id === v)?.name || v,
                }))
              );
            }}
            placeholder={toUpperCase("მონიშნეთ მოგებული სეზონი")}
            defaultValue={form.watch("seasonsWon").map(season => season.value)}
            variant="inverted"
            maxCount={3}
          />
        </div>

        {/* multi select battlesWon */}

        <div>
          <FormDescription className="text-white">
            {toUpperCase("მოგებული ბეთლები")}
          </FormDescription>

          <MultiSelect
            options={
              battles?.map(battle => ({
                label: battle.title,
                value: battle.id,
              })) || []
            }
            onValueChange={(value: string[]) => {
              form.setValue(
                "battlesWon",
                value.map(v => ({
                  value: v,
                  label: battles?.find(b => b.id === v)?.title || v,
                }))
              );
            }}
            defaultValue={form.watch("battlesWon").map(battle => battle.value)}
            placeholder={toUpperCase("მონიშნეთ მოგებული ბეთლები")}
            variant="inverted"
            maxCount={3}
          />
        </div>

        {/* social media */}
        <FormField
          control={form.control}
          name="socialMedia"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">
                {toUpperCase("სოციალური ქსელები")}
              </FormLabel>
              <FormControl>
                <>
                  {field.value.map((social, index: number) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <Select
                        value={social.name}
                        onValueChange={value => {
                          const newSocialMedia = field.value.map((s, i) =>
                            i === index
                              ? {
                                  ...s,
                                  name: value as SocialMediaPlatforms,
                                }
                              : s
                          );
                          field.onChange(newSocialMedia);
                        }}
                      >
                        <SelectTrigger className="text-white">
                          <SelectValue>
                            {social.name}
                            {/* <social.icon className="w-4 h-4" /> */}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(SocialMediaPlatforms).map(platform => (
                            <SelectItem key={platform} value={platform}>
                              {platform}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        value={social.url}
                        onChange={e => {
                          const newSocialMedia = field.value.map((s, i) =>
                            i === index ? { ...s, url: e.target.value } : s
                          );
                          field.onChange(newSocialMedia);
                        }}
                        placeholder="URL"
                        className="text-white"
                      />
                      <Button
                        onClick={() => {
                          const newSocialMedia = field.value.filter(
                            (_, i) => i !== index
                          );
                          field.onChange(newSocialMedia);
                        }}
                        type="button"
                        variant="destructive"
                        className="text-white"
                      >
                        {toUpperCase("X")}
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={() =>
                      field.onChange([
                        ...field.value,
                        {
                          name: "FACEBOOK",
                          url: "",
                        },
                      ])
                    }
                    type="button"
                    className="text-white"
                  >
                    {toUpperCase("დამატება")}
                  </Button>
                </>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPopular"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-white">
                  {toUpperCase("პოპულარული")}
                </FormLabel>
                <FormDescription className="text-white">
                  {toUpperCase("მონიშნეთ თუ არტისტი პოპულარულია")}
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="text-white"
          disabled={isPending || !form.formState.isDirty}
        >
          {initialData === undefined
            ? toUpperCase("არტისტის დამატება")
            : toUpperCase("არტისტის რედაქტირება")}
        </Button>
      </form>
    </Form>
  );
};

export default ArtistsForm;
