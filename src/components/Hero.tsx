import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/types/hooks";
import { RootState } from "@/store/store";
import { setLanguage } from "@/slice/changeLangSlice";

const Hero = () => {
  const [platform, setPlatform] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [buttonLabel, setButtonLabel] = useState("");
  const [iconSrc, setIconSrc] = useState("");
  const { t, i18n } = useTranslation("common");
  const dispatch = useAppDispatch();


  const language = useAppSelector((state: RootState) => state.language.language);

  useEffect(() => {
    i18n.changeLanguage(language);
    dispatch(setLanguage(language)); // Ensure Redux state is also updated

    const userAgent = typeof window !== "undefined" ? navigator.userAgent : "";

    if (/android/i.test(userAgent)) {
      // Android devices
      setPlatform("android");
      setDownloadLink("https://play.google.com/store/apps/details?id=com.guono.mobile");
      setButtonLabel(t("storeGoogle"));
      setIconSrc("/icons/android.png");

    } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream) {
      // iOS devices
      setPlatform("ios");
      setDownloadLink("https://apps.apple.com/ng/app/6744582441");
      setButtonLabel(t("storeApple"));
      setIconSrc("/icons/apple-store.png");

    } else if (/Win/i.test(userAgent)) {
      // Windows desktops
      setPlatform("windows");
      setDownloadLink("https://play.google.com/store/apps/details?id=com.guono.mobile");
      setButtonLabel(t("storeGoogle"));
      setIconSrc("/icons/android.png");

    } else if (/Mac/i.test(userAgent)) {
      // Mac desktops
      setPlatform("mac");
      setDownloadLink("https://apps.apple.com/ng/app/6744582441");
      setButtonLabel(t("storeApple"));
      setIconSrc("/icons/apple-store.png");

    } else {
      // Fallback for other OS (Linux, etc.)
      setPlatform("other");
      setDownloadLink("https://play.google.com/store/apps/details?id=com.guono.mobile");
      setButtonLabel(t("storeGoogle"));
      setIconSrc("/icons/android.png");
    }
  }, [i18n, dispatch, language, t]);

  return (
    <section className="flex text-center items-center flex-col mt-10 p-4 gap-2">
      <a
        href={downloadLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5"
      >
        <button className="cursor-pointer flex items-center justify-center gap-2 bg-[#05353A] text-white py-3  rounded-lg px-3 mx-auto hover:opacity-90 transition">
          {iconSrc && (
            <Image
              src={iconSrc}
              alt={`${platform} icon`}
              width={24}
              height={24}
            />
          )}
          <span className="text-lg">
            {t("download")} {buttonLabel}
          </span>
        </button>
      </a>
      <p className="!text-sm">
        {t(
          "guonoIntro",
        )}
      </p>
    </section>
  );
};

export default Hero;

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import { useTranslation } from "react-i18next";
// import { useAppDispatch, useAppSelector } from "@/types/hooks";
// import { RootState } from "@/store/store";
// import { setLanguage } from "@/store/changeLangSlice";

// const Hero = () => {
//   const [platform, setPlatform] = useState("");
//   const [downloadLink, setDownloadLink] = useState("");
//   const [buttonLabel, setButtonLabel] = useState("");
//   const [iconSrc, setIconSrc] = useState("");
//   const { t, i18n } = useTranslation("common");
//   const dispatch = useAppDispatch();


//   const language = useAppSelector((state: RootState) => state.language.language);

//   useEffect(() => {
//     i18n.changeLanguage(language);
//     dispatch(setLanguage(language)); // Ensure Redux state is also updated

//     const userAgent = typeof window !== "undefined" ? navigator.userAgent : "";

//     if (/android/i.test(userAgent)) {
//       // Android devices
//       setPlatform("android");
//       setDownloadLink("https://play.google.com/store/apps/details?id=com.guono.mobile");
//       setButtonLabel(t("storeGoogle"));
//       setIconSrc("/icons/android.png");

//     } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream) {
//       // iOS devices
//       setPlatform("ios");
//       setDownloadLink("https://apps.apple.com/ng/app/6744582441");
//       setButtonLabel(t("storeApple"));
//       setIconSrc("/icons/apple-store.png");

//     } else if (/Win/i.test(userAgent)) {
//       // Windows desktops
//       setPlatform("windows");
//       setDownloadLink("https://play.google.com/store/apps/details?id=com.guono.mobile");
//       setButtonLabel(t("storeGoogle"));
//       setIconSrc("/icons/android.png");

//     } else if (/Mac/i.test(userAgent)) {
//       // Mac desktops
//       setPlatform("mac");
//       setDownloadLink("https://apps.apple.com/ng/app/6744582441");
//       setButtonLabel(t("storeApple"));
//       setIconSrc("/icons/apple-store.png");

//     } else {
//       // Fallback for other OS (Linux, etc.)
//       setPlatform("other");
//       setDownloadLink("https://play.google.com/store/apps/details?id=com.guono.mobile");
//       setButtonLabel(t("storeGoogle"));
//       setIconSrc("/icons/android.png");
//     }
//   }, [i18n, dispatch, language]);

//   return (
//     <section className="flex text-center items-center flex-col mt-10 p-4">
//       <h2 className="font-semibold text-[2.375rem] xl:text-[3.375rem] text-[#05353A]">
//         {t("learnAndSpeakUrhobo")}
//       </h2>
//       <p className="text-xl">
//         {t(
//           "guonoIntro",
//         )}
//       </p>

//       <a
//         href={downloadLink}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="mt-5"
//       >
//         <button className="flex items-center justify-center gap-2 bg-[#05353A] text-white py-3  rounded-lg px-3 mx-auto hover:opacity-90 transition">
//           {iconSrc && (
//             <Image
//               src={iconSrc}
//               alt={`${platform} icon`}
//               width={24}
//               height={24}
//             />
//           )}
//           <span className="text-lg">
//             {t("download")} {buttonLabel}
//           </span>
//         </button>
//       </a>

//       <Image
//         src="/guono-mobile.png"
//         width={500}
//         height={500}
//         alt="guono mobile"
//         className="my-10"
//       />
//     </section>
//   );
// };

// export default Hero;
