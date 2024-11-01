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

// Define the schema based on the Prisma model
const seasonSchema = z.object({
  name: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  type: z.enum(["ACAPELLA", "FLOW"]),
  winnerId: z.string(),
  battleIds: z.array(z.string()),
});

type SeasonFormValues = z.infer<typeof seasonSchema>;

// Mock data for artists and battles (replace with actual data fetching)
const artistsList = [
  { value: "artist1", label: "Artist 1" },
  { value: "artist2", label: "Artist 2" },
  // Add more artists...
];

const battlesList = [
  { value: "battle1", label: "Battle 1" },
  { value: "battle2", label: "Battle 2" },
  // Add more battles...
];

const SeasonsForm: React.FC = () => {
  const form = useForm<SeasonFormValues>({
    resolver: zodResolver(seasonSchema),
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
      type: "ACAPELLA",
      winnerId: "",
      battleIds: [],
    },
  });

  function onSubmit(values: SeasonFormValues) {
    console.log(values);
    // Handle form submission
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
                <Input type="date" {...field} className="text-white" />
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
                <Input type="date" {...field} className="text-white" />
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
                  <SelectTrigger>
                    <SelectValue placeholder={toUpperCase("აირჩიეთ ტიპი")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ACAPELLA">
                    {toUpperCase("აკაპელა")}
                  </SelectItem>
                  <SelectItem value="FLOW">{toUpperCase("ფლოუ")}</SelectItem>
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
                  <SelectTrigger>
                    <SelectValue
                      placeholder={toUpperCase("აირჩიეთ გამარჯვებული")}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {artistsList.map(artist => (
                    <SelectItem key={artist.value} value={artist.value}>
                      {artist.label}
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
          name="battleIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">
                {toUpperCase("ბეთლები")}
              </FormLabel>
              <FormControl>
                <MultiSelect
                  options={battlesList}
                  onValueChange={(value: string[]) => field.onChange(value)}
                  defaultValue={field.value}
                  placeholder={toUpperCase("აირჩიეთ ბეთლები")}
                  variant="inverted"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="text-white">
          {toUpperCase("შენახვა")}
        </Button>
      </form>
    </Form>
  );
};

export default SeasonsForm;
