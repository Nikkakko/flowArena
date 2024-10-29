import { Shell } from "@/components/shell";
import { getUser } from "@/lib/db/queries";
import { redirect } from "next/navigation";
import * as React from "react";

interface AdminPageProps {}

const AdminPage: React.FC<AdminPageProps> = async ({}) => {
  const user = await getUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/sign-in");
  }
  return (
    <Shell className="" variant="default">
      <h1 className="text-2xl font-bold text-white">Admin</h1>
    </Shell>
  );
};

export default AdminPage;
