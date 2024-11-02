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
import { MultiSelect } from "@/components/ui/multi-select";
import { toUpperCase } from "@/lib/utils";
import { SeasonFormValues, seasonSchema } from "../../lib/seasons-validation";
import { Artist, Battle } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import addSeasonAction, { editSeason } from "../../_actions/action-season";
import { selectTypeList } from "../../lib/constants";
import { useRouter } from "next/navigation";

type SeasonsFormProps = {
  // Add props here
  artists?: Artist[] | undefined;

  initialData?: SeasonFormValues & { id: string };
};

const SeasonsForm: React.FC<SeasonsFormProps> = ({ artists, initialData }) => {
  const [isPending, startTransition] = React.useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<SeasonFormValues>({
    resolver: zodResolver(seasonSchema),
    defaultValues: {
      name: initialData?.name || "",
      startDate: initialData?.startDate || undefined,
      endDate: initialData?.endDate || undefined,
      type: initialData?.type || undefined,
      winnerId: initialData?.winnerId || undefined,
    },
  });

  function onSubmit(values: SeasonFormValues) {
    console.log(values);

    startTransition(async () => {
      try {
        switch (initialData) {
          case undefined:
            await addSeasonAction(values);
            form.reset();
            toast({
              title: "Season added",
              description: "Season has been added successfully",
            });

            break;
          default:
            await editSeason(initialData.id, values);
            toast({
              title: "Season updated",
              description: "Season has been updated successfully",
            });
            router.push("/admin");
            break;
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Something went wrong",
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-10">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">
                {toUpperCase("სახელი")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={toUpperCase("სეზონის სახელი")}
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
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">
                {toUpperCase("დაწყების თარიღი")}
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={
                    field.value ? field.value.toISOString().split("T")[0] : ""
                  }
                  className="text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">
                {toUpperCase("დასრულების თარიღი")}
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={
                    field.value ? field.value.toISOString().split("T")[0] : ""
                  }
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="text-white/50">
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
          name="winnerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">
                {toUpperCase("გამარჯვებული")}
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value ? field.value : undefined}
              >
                <FormControl>
                  <SelectTrigger className="text-white/50">
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

        <Button
          type="submit"
          className="text-white"
          disabled={isPending || !form.formState.isDirty}
        >
          {initialData ? toUpperCase("რედაქტირება") : toUpperCase("დამატება")}
        </Button>
      </form>
    </Form>
  );
};

export default SeasonsForm;
