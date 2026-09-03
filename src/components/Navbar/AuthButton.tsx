// import Image from "next/image";
// import Link from "next/link";
// import DesktopProfileMenu from "./DesktopProfileMenu";
// import { useAppSelector } from "@/types/hooks";

// export default function AuthButton({
//   onOpenModal,
//   onToggleMobile,
// }: {
//   onOpenModal: (modal: string) => void;
//   onToggleMobile: () => void;
// }) {
//   const { user } = useAppSelector((s) => s.user);

//   if (!user) {
//     return (
//       <Link
//         href="/signin"
//         className="bg-[#05353A] text-white px-4 py-2 rounded-xl text-sm"
//       >
//         Login
//       </Link>
//     );
//   }

//   return (
//     <>
//       <div className="hidden md:block">
//         <DesktopProfileMenu onOpenModal={onOpenModal} />
//       </div>

//       <button className="md:hidden" onClick={onToggleMobile}>
//         <Image src="/man.png" alt="Profile" width={40} height={40} />
//       </button>
//     </>
//   );
// }
