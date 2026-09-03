import React from "react";
import { DialectCard } from "./dialect-card";

const TopWordSection = ({ word }: { word: SensePacket }) => {
  return (
    <div className="flex items-center gap-4 group">
      <p className="text-3xl font-medium">{word.otaWord ?? word.ota}</p>

      <DialectCard dialect={word.dialect} />
    </div>
  );
};

export default TopWordSection;
