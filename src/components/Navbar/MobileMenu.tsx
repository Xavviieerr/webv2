// import Image from "next/image";
// import Link from "next/link";
// import LanguageDropdown from "./LanguageDropdown";
// import { profileLinks } from "@/types";

// export default function MobileMenu({ onClose, onOpenModal }: any) {
//   return (
//     <div className="fixed inset-0 bg-[#f2feff] z-50 p-4">
//       <div className="flex justify-between">
//         <Image src="/guono-logo.svg" alt="logo" width={100} height={30} />
//         <button onClick={onClose}>✕</button>
//       </div>

//       {profileLinks.map((l) => (
//         <button
//           key={l.modal}
//           onClick={() => {
//             onOpenModal(l.modal);
//             onClose();
//           }}
//         >
//           {l.t}
//         </button>
//       ))}

//       <LanguageDropdown mobile />
//     </div>
//   );
// }
