import Image from "next/image";
import Link from "next/link";
import { User2 } from "lucide-react";
import type { MiniFigures } from "@/features/shared/types";

const FigureCard = ({ figure }: { figure: MiniFigures }) => {
  return (
    <Link
      href={`/dashboard/figures/${figure.id}`}
      className="flex items-start cursor-pointer gap-2 hover:border bg-secondary-foreground/5 rounded-2xl border-primary/20 transition-all duration-300 ease-in-out text-base"
    >
      <div className="md:w-28 w-20 h-full bg-secondary-foreground/20 relative rounded-l-2xl shrink-0">
        {figure.profilePhoto ? (
          <Image
            src={figure.profilePhoto}
            alt="figure"
            fill
            unoptimized
            className="rounded-l-2xl"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full text-base-dark">
            <User2 size={52} strokeWidth={1.2} />
          </div>
        )}
      </div>

      <div className="flex flex-col md:py-5 py-3 px-3">
        <p className="font-semibold text-primary capitalize line-clamp-1">
          {figure.fullName}
        </p>

        <div className="flex flex-col gap-1 items-start text-sm mt-1.5">
          <p className="line-clamp-2 text-gray-900">{figure.introBio}</p>
        </div>

        <div className="flex items-center gap-4 mt-2">
          <p className="text-[13px] px-3 py-1 rounded-xl border border-dashed border-slate-400 bg-secondary-foreground/10 font-medium capitalize">
            {figure.occupation}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default FigureCard;
