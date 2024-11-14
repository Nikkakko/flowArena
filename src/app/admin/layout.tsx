import SearchField from "@/components/shared/SearchField";
import { AdminNavigation } from "./_components/AdminNavigation";
import { Shell } from "@/components/shell";
import { toUpperCase } from "@/lib/utils";
import UserMenu from "@/components/UserMenu";

export default function AdminDashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <Shell as="main" className="mx-auto">
      <div className="flex justify-between items-center bg-secondary p-4">
        <h1 className="text-4xl font-bold text-white text-center">
          {toUpperCase("ადმინ პანელი")}
        </h1>
        <UserMenu />
      </div>
      <AdminNavigation />
      {children}
    </Shell>
  );
}
