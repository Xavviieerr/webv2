// import { useRef, useState, useEffect } from "react";
// import Image from "next/image";
// import { MdOutlineArrowForwardIos } from "react-icons/md";
// import { profileLinks } from "@/types";
// import LanguageDropdown from "./LanguageDropdown";
// import { useAppSelector } from "@/types/hooks";

// export default function DesktopProfileMenu({ onOpenModal }: any) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef<HTMLDivElement>(null);
//   const { user } = useAppSelector((s) => s.user);

//   useEffect(() => {
//     const close = (e: MouseEvent) =>
//       ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
//     document.addEventListener("mousedown", close);
//     return () => document.removeEventListener("mousedown", close);
//   }, []);

//   return (
//     <div ref={ref} className="relative">
//       <button onClick={() => setOpen(!open)}>
//         <Image src="/man.png" alt="Profile" width={40} height={40} />
//       </button>

//       {open && (
//         <div className="absolute right-0 mt-3 bg-white w-64 rounded-xl shadow-xl">
//           <div className="p-4 border-b">
//             <p className="font-semibold">{user?.username}</p>
//             <p className="text-xs">{user?.email}</p>
//           </div>

//           {profileLinks.map((l) => (
//             <button
//               key={l.modal}
//               onClick={() => onOpenModal(l.modal)}
//               className="w-full px-4 py-2 flex justify-between hover:bg-[#05353A]"
//             >
//               {l.t}
//               <MdOutlineArrowForwardIos />
//             </button>
//           ))}

//           <LanguageDropdown />
//         </div>
//       )}
//     </div>
//   );
// }
