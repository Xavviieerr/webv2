import Image from "next/image";
import { EMPTY_STATE_MESSAGE } from "../constants";

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = EMPTY_STATE_MESSAGE }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-gray-500 text-center text-sm">
      <Image src={"/images/sad.svg"} alt="sad image" width={80} height={70} />
      <p>{message}</p>
    </div>
  );
}
