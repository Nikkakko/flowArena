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
import { Textarea } from "@/components/ui/textarea";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { MultiSelect } from "@/components/ui/multi-select";
import { toUpperCase } from "@/lib/utils";
import { BattleFormValues, battleSchema } from "../../lib/battles-validation";
import { Artist, BattleStatus, BattleType, Season } from "@prisma/client";
import { selectBattleStatusList, selectTypeList } from "../../lib/constants";
import { useToast } from "@/hooks/use-toast";
import { addBattleAction, updateBattle } from "../../_actions/action-battle";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";

type BattlesFormProps = {
  initialData?: BattleFormValues & { id: string };
  artists?: Artist[] | undefined;
  seasons?: Season[] | undefined;
};

const BattlesForm: React.FC<BattlesFormProps> = ({
  initialData,
  artists,
  seasons,
}) => {
  const [isPending, startTransition] = React.useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<BattleFormValues>({
    resolver: zodResolver(battleSchema),
    defaultValues: {
      link: initialData?.link || "",
      coverImage: initialData?.coverImage || "",
      title: initialData?.title || "",
      description: initialData?.description || "",
      type: initialData?.type || undefined,
      status: initialData?.status || undefined,
      artistIds: initialData?.artistIds || [],
      seasonId: initialData?.seasonId || "",
      winnerId: initialData?.winnerId || undefined,
      battleDate: initialData?.battleDate
        ? new Date(initialData.battleDate)
        : new Date(),
      isFeatured: false,
    },
  });

  const [coverImage, setCoverImage] = React.useState<string | undefined>(
    form.watch("coverImage")
  );

  function onSubmit(values: BattleFormValues) {
    console.log(values);
    // Handle form submission
    startTransition(async () => {
      try {
        if (initialData) {
          await updateBattle(initialData.id, values);
          toast({
            title: "Battle updated successfully",
            variant: "default",
            duration: 5000,
          });
          router.push("/admin");
        } else {
          await addBattleAction(values);
          toast({
            title: "Battle added successfully",
            variant: "default",
            duration: 5000,
          });
          form.reset();
          router.push("/admin");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again later.",
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-10">
        {/* add date*/}
        <FormField
          control={form.control}
          name="battleDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">
                {toUpperCase("ბეთლის ჩატარების თარიღი")}
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  placeholder={toUpperCase("ბეთლის ჩატარების თარიღი")}
                  {...field}
                  value={
                    field.value instanceof Date
                      ? field.value.toISOString().split("T")[0]
                      : field.value
                  }
                  onChange={e => {
                    field.onChange(
                      e.target.value ? new Date(e.target.value) : null
                    );
                  }}
                  className="text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">
                {toUpperCase("სათაური")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={toUpperCase("სათაური")}
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
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">
                {toUpperCase("ლინკი")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={toUpperCase("ლინკი")}
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">
                {toUpperCase("აღწერა")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={toUpperCase("აღწერა")}
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">
                {toUpperCase("ტიპი")}
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value ?? undefined}
              >
                <FormControl>
                  <SelectTrigger className="text-white">
                    <SelectValue placeholder={toUpperCase("აირჩიეთ ტიპი")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {selectTypeList.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {toUpperCase(type.label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">
                {toUpperCase("სტატუსი")}
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value ?? undefined}
              >
                <FormControl>
                  <SelectTrigger className="text-white">
                    <SelectValue placeholder={toUpperCase("აირჩიეთ სტატუსი")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {selectBattleStatusList.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {toUpperCase(status.label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">
                {toUpperCase("ყდის სურათი")}
              </FormLabel>
              <FormControl>
                {coverImage ? (
                  <div className="relative w-full max-w-40">
                    <Image
                      src={coverImage}
                      alt="cover"
                      className="w-40 h-40 object-cover rounded"
                      width={160}
                      height={160}
                    />
                    <Button
                      onClick={() => {
                        setCoverImage(undefined);
                        field.onChange("");
                      }}
                      className="text-white absolute top-0 right-0 w-6 h-6 rounded-full"
                      type="button"
                    >
                      {toUpperCase("X")}
                    </Button>
                  </div>
                ) : (
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={res => {
                      console.log("Files: ", res);
                      setCoverImage(res[0].url);
                      field.onChange(res[0].url);
                    }}
                    onUploadError={(error: Error) => {
                      alert(`ERROR! ${error.message}`);
                    }}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="artistIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">
                {toUpperCase("არტისტები")}
              </FormLabel>
              <FormControl>
                <MultiSelect
                  options={
                    artists?.map(artist => ({
                      label: artist.nickName,
                      value: artist.id,
                    })) || []
                  }
                  onValueChange={(value: string[]) => field.onChange(value)}
                  defaultValue={field.value as string[] | undefined}
                  placeholder={toUpperCase("აირჩიეთ არტისტები")}
                  variant="inverted"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="seasonId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">
                {toUpperCase("სეზონი")}
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="text-white">
                    <SelectValue placeholder={toUpperCase("აირჩიეთ სეზონი")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {seasons?.map(season => (
                    <SelectItem key={season.id} value={season.id}>
                      {toUpperCase(season.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="winnerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">
                {toUpperCase("გამარჯვებული")}
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="text-white">
                    <SelectValue
                      placeholder={toUpperCase("აირჩიეთ გამარჯვებული")}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {artists?.map(artist => (
                    <SelectItem key={artist.id} value={artist.id}>
                      {toUpperCase(`${artist.nickName}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isFeatured"
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
                  {toUpperCase("რჩეული")}
                </FormLabel>
                <FormDescription className="text-white">
                  {toUpperCase("მონიშნეთ თუ გსურთ ��ომ ბრძოლა იყოს რჩეული")}
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="text-white" disabled={isPending}>
          {toUpperCase("შენახვა")}
        </Button>
      </form>
    </Form>
  );
};

export default BattlesForm;
