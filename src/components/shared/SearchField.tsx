"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function SearchField({
  placeholder,
  className,
  query,
  defaultValue,
}: {
  query: string;
  placeholder: string;
  className?: string;
  defaultValue: string | null;
}) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Inside the Search Component...
  const handleSearch = useDebouncedCallback(term => {
    const params = new URLSearchParams(); // Create fresh params instance
    if (term) {
      params.set(query, term);
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <form className={cn("relative flex flex-1 flex-shrink-0", className)}>
      <Input
        className="peer block w-full rounded-md border  py-[9px] pl-10 text-sm outline-2  text-white/90 h-11"
        placeholder={placeholder}
        onChange={e => {
          handleSearch(e.target.value);
        }}
        defaultValue={defaultValue || ""}
      />
      <SearchIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-primary" />
    </form>
  );
}
