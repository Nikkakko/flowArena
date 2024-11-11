import { toUpperCase } from "@/lib/utils";
import * as React from "react";

interface ArtistStatsCardProps {
  stat: {
    label: string;
    value: string | number;
    valueClass: string;
  };
}

const ArtistStatsCard: React.FC<ArtistStatsCardProps> = ({ stat }) => {
  return (
    <div className="bg-secondary/50 p-4 rounded-lg border border-secondary">
      <p className="text-sm text-gray-400">{toUpperCase(stat.label)}</p>
      <p className={`text-2xl font-bold ${stat.valueClass}`}>{stat.value}</p>
    </div>
  );
};

export default ArtistStatsCard;
