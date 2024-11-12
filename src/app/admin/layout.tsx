import SearchField from "@/components/shared/SearchField";
import { AdminNavigation } from "./_components/AdminNavigation";
import { Shell } from "@/components/shell";
import { toUpperCase } from "@/lib/utils";

export default function AdminDashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <Shell as="main" className="mx-auto">
      <h1 className="text-4xl font-bold text-white text-center">
        {toUpperCase("ადმინ პანელი")}
      </h1>
      <AdminNavigation />
      {children}
    </Shell>
  );
}
