import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
interface ProfileImageProps {
  src: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ src }) => {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="w-24 h-24">
        <AvatarImage src={src} />
        <AvatarFallback>IMG</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default ProfileImage;
