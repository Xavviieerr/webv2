import Link from "next/link";
import { formatNameType } from "../utils";

interface NameDetailCardProps {
  nameType: string;
  gender: string;
  regionOfUse?: string;
  culturalSignificance: string;
  nameComposition: string[];
}

export function NameDetailCard({
  nameType,
  gender,
  regionOfUse,
  culturalSignificance,
  nameComposition,
}: NameDetailCardProps) {
  return (
    <div className="flex flex-col w-full bg-secondary-foreground/10 rounded-2xl p-5 gap-8">
      <p className="text-primary text-lg font-medium">Name Details</p>

      {/* Source, Type & Gender */}
      <div className="w-full grid grid-cols-3 gap-5 max-md:text-sm">
        <div className="flex flex-col gap-2">
          <p className="font-medium">Type</p>
          <p className="text-gray-800 capitalize">{formatNameType(nameType)}</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-medium">Gender</p>
          <p className="text-gray-800 capitalize">{gender}</p>
        </div>

        {regionOfUse && (
          <div className="flex flex-col gap-2">
            <p className="font-medium">Dialect</p>
            <p className="text-gray-800 capitalize">{regionOfUse}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-medium">Summary</p>
        <p className="text-gray-800">{culturalSignificance}</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-medium">Name Composition</p>
        {nameComposition && nameComposition.length > 0 ? (
          <div className="flex flex-wrap items-center gap-3 w-full">
            {nameComposition.map((item: string) => (
              <Link
                href={""}
                key={item}
                className="text-sm px-5 py-2 rounded-2xl border border-dashed border-slate-400 bg-secondary-foreground/10 font-medium capitalize hover:border-primary "
              >
                {item}
              </Link>
            ))}
          </div>
        ) : (
          <p>N/A</p>
        )}
      </div>
    </div>
  );
}
