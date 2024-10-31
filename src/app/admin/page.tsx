import * as React from "react";
import { Shell } from "@/components/shell";
import { getArtists, getUser } from "@/lib/db/queries";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArtistsHandle from "./_components/ArtistsHandle";
import BattlesHandle from "./_components/BattlesHandle";
import SeasonsHandle from "./_components/SeasonsHandle";

interface AdminPageProps {}

const AdminPage: React.FC<AdminPageProps> = async ({}) => {
  const user = await getUser();
  const artists = await getArtists();

  if (!user || user.role !== "ADMIN") {
    redirect("/sign-in");
  }

  return (
    <Shell className="mx-auto" variant="default">
      <h1 className="text-4xl font-bold text-white text-center">Admin Panel</h1>
      <Tabs defaultValue="artists" className="w-full">
        <TabsList>
          <TabsTrigger value="artists">Artists</TabsTrigger>
          <TabsTrigger value="battles">Battles</TabsTrigger>
          <TabsTrigger value="seasons">Seasons</TabsTrigger>
        </TabsList>
        <TabsContent value="artists">
          <ArtistsHandle artists={artists} />
        </TabsContent>
        <TabsContent value="battles">
          <BattlesHandle />
        </TabsContent>
        <TabsContent value="seasons">
          <SeasonsHandle />
        </TabsContent>
      </Tabs>
    </Shell>
  );
};

export default AdminPage;
