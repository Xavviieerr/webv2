import { formatNameType, getGenderColor } from "../utils";

interface NameCardProps {
  id: string;
  name: string;
  translations: { translatedMeaning: string }[];
  gender: string;
  nameType: string;
  onSelect: () => void;
}

export function NameCard({
  name,
  translations,
  gender,
  nameType,
  onSelect,
}: NameCardProps) {
  return (
    <button
      onClick={onSelect}
      className="flex flex-col items-start cursor-pointer gap-2 p-5 hover:border bg-secondary-foreground/5 rounded-2xl border-primary/20 transition-all duration-300 ease-in-out text-base text-left w-full"
    >
      <p className="font-semibold text-primary capitalize">{name}</p>

      {(translations?.length ?? 0) > 0 && (
        <div className="flex flex-col items-start">
          <p className="font-medium text-xs">Meaning:</p>
          <p className="line-clamp-1 text-gray-800 text-[15px]">
            {translations[0].translatedMeaning}
          </p>
        </div>
      )}

      <div className="flex items-center gap-4 my-1">
        <div className="flex items-center gap-4">
          <p
            className={`text-xs px-3 py-1 rounded-xl border border-dashed capitalize ${getGenderColor(gender)} font-medium`}
          >
            {gender}
          </p>
          <p className="text-xs px-3 py-1 rounded-xl font-medium border border-dashed border-primary bg-primary/10 capitalize">
            {formatNameType(nameType)}
          </p>
        </div>
      </div>
    </button>
  );
}
