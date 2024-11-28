import { UpdateProfileForm } from "@/components/forms/UpdateProfileForm";
import { getCachedUser, getUser } from "@/lib/db/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as React from "react";
import { Shell } from "@/components/shell";
import { updateUserAction } from "@/lib/actions/update-user";
import { toUpperCase, toUpperGeorgian } from "@/lib/utils";
import Link from "next/link";
import ProfileImage from "@/components/ProfileImage";

interface UserProfilePageProps {}

const UserProfilePage: React.FC<UserProfilePageProps> = async ({}) => {
  const currentUser = await getUser();

  if (!currentUser) {
    return (
      <Shell className="mx-auto py-6 flex-1">
        <Link href="/sign-in">{toUpperCase("შესვლა")}</Link>
      </Shell>
    );
  }

  return (
    <Shell className="mx-auto py-6 px-4 lg:px-0">
      <Card className="bg-secondary">
        <CardHeader>
          <CardTitle className="text-white">
            {toUpperCase("შენი პროფილი")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <ProfileImage
              src={currentUser.imageUrl || "/assets/artist-placeholder.webp"}
            />
            <div>
              <h2 className="text-2xl font-bold text-white">
                {currentUser.name}
              </h2>
              <p className="text-gray-500">{currentUser.email}</p>
              <p className="text-sm text-gray-500">
                {toUpperGeorgian("FlowArena-ას წევრი")}:{" "}
                {currentUser.createdAt.toLocaleDateString()} -{" "}
                {toUpperCase("დან")}
              </p>
            </div>
          </div>

          <div className="mt-6 ">
            <h3 className="text-lg font-semibold mb-4 text-white">
              {toUpperCase("პროფილის რედაქტირება")}
            </h3>
            <UpdateProfileForm
              initialData={{
                name: currentUser.name,
                imageUrl: currentUser.imageUrl,
              }}
            />
          </div>
        </CardContent>
      </Card>
    </Shell>
  );
};

export default UserProfilePage;
