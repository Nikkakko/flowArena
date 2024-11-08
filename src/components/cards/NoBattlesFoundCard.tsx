import { toUpperCase } from "@/lib/utils";
import * as React from "react";
import { Badge } from "@/components/ui/badge";

const NoBattlesFoundCard: React.FC = () => {
  return (
    <div className="bg-secondary/50 p-4 rounded-lg border border-secondary flex justify-between items-center">
      <div className="flex gap-4 items-center">
        <div>
          <p className="text-white font-medium mb-1">
            {toUpperCase("მოგებული ბეთლი ვერ მოიძებნა")}
          </p>
          <p className="text-xs text-gray-500">
            {toUpperCase("ოპონენტი არ გამოცხადდა")}
          </p>
        </div>
      </div>

      <div className="text-sm">
        <Badge variant="success">{toUpperCase("ავტომატური მოგება")}</Badge>
      </div>
    </div>
  );
};

export default NoBattlesFoundCard;
