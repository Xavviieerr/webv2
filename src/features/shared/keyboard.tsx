"use client";
import { useIsMobile } from "@/hooks/useIsMobile";
import i18n from "@/lib/i18n";
import { languageStore, setLanguage } from "@/slice/changeLangSlice";
import { useAppDispatch } from "@/types/hooks";
import { motion } from "framer-motion";
import { Info, X } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { RiDraggable } from "react-icons/ri";

const mobileKeys = [..."wertyuiopasdfghjklzcbvọẹnm⌫".split("")];

const ipaVowels = [
  "á",
  "à",
  "ã",
  "é",
  "è",
  "ẽ",
  "ɛ",
  "ɛ́",
  "ɛ̀",
  "ɛ̃",
  "í",
  "ì",
  "ĩ",
  "ó",
  "ò",
  "õ",
  "ɔ",
  "ɔ́",
  "ɔ̀",
  "ɔ̃́",
  "ú",
  "ù",
  "ũ",
  "⌫",
];
const ipaConsonants = [
  "ɣw",
  "ŋm",
  "ŋ͡m",
  "k͡p",
  "ɡ͡b",
  "ɸ",
  "ʃ",
  "ɲ",
  "β",
  "ʄ",
  "ʋ",
  "ɾ",
  "ɾ̣",
  "ɣ",
  "ʒ",
  "⌫",
];

const Keyboard: React.FC<{
  isOpen: boolean;
  value: string;
  handleChange: (query: string) => void;
  handleEnter?: (query: string) => void;
  onClose: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}> = ({ isOpen, value, handleChange, handleEnter, onClose, inputRef }) => {
  const [caps, setCaps] = useState(false);
  const [page, setPage] = useState<"keys" | "ipaV" | "ipaC">("keys");
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const cursorPosRef = useRef<number | null>(null);

  useEffect(() => {
    const lang = languageStore.getLang();
    if (typeof i18n.changeLanguage === "function") {
      i18n.changeLanguage(lang);
    }
    dispatch(setLanguage(lang));
  }, [pathname, dispatch]);

  const { t } = useTranslation("common");

  // Restore cursor position synchronously after React commits DOM update
  useEffect(() => {
    if (cursorPosRef.current !== null && inputRef?.current) {
      const pos = cursorPosRef.current;
      inputRef.current.focus();
      inputRef.current.setSelectionRange(pos, pos);
      cursorPosRef.current = null;
    }
  }, [value, inputRef]);

  const togglePage = () => {
    return page == "keys" ? setPage("ipaV") : setPage("keys");
  };

  const toggleIPA = () => {
    return page == "ipaV" ? setPage("ipaC") : setPage("ipaV");
  };

  const handleOnPress = useCallback(
    (key: string) => {
      if (key == "enter") {
        return handleEnter?.(value);
      }

      const sortedKey = caps ? key.toUpperCase() : key.toLowerCase();

      // Get current cursor position from the input element
      const input = inputRef?.current;
      const start = input?.selectionStart ?? value.length;
      const end = input?.selectionEnd ?? value.length;

      let newValue = value;
      let newCursorPos = start;

      if (key == "space") {
        newValue = value.slice(0, start) + " " + value.slice(end);
        newCursorPos = start + 1;
      } else if (key == "backspace" || key == "⌫") {
        if (start === 0 && end === 0) return;
        if (start === end) {
          // Delete character before cursor
          newValue = value.slice(0, start - 1) + value.slice(end);
          newCursorPos = start - 1;
        } else {
          // Delete selection
          newValue = value.slice(0, start) + value.slice(end);
          newCursorPos = start;
        }
      } else {
        newValue = value.slice(0, start) + sortedKey + value.slice(end);
        newCursorPos = start + sortedKey.length;
      }

      // Store desired cursor position for restoration after React re-render
      cursorPosRef.current = newCursorPos;
      handleChange(newValue);
    },
    [caps, value, handleChange, handleEnter, inputRef],
  );

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  if (isMobile)
    return (
      <div className="flex w-full pb-5 flex-col fixed max-md:left-0 bottom-0 gap-2 max-w-3xl bg-light-gray border border-slate-200 rounded-lg p-2 z-200">
        <div className="flex w-full justify-between pt-4 pb-3 px-2">
          <p className="font-medium text-gray-500 uppercase"> URH </p>

          <button
            onMouseDown={(e) => {
              e.preventDefault();
              handleClose();
            }}
            className="cursor-pointer hover:text-red-800"
          >
            <X size={24} />
          </button>
        </div>

        {page == "keys" && (
          <div className={`grid grid-cols-9 w-full gap-1 justify-between`}>
            {mobileKeys.map((singleKey) => (
              <button
                key={singleKey}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleOnPress(singleKey);
                }}
                className={` bg-white text-base-green w-full py-3 text-base hover:bg-slate-200 shadow border border-slate-200 rounded-lg cursor-pointer`}
              >
                {caps ? singleKey.toUpperCase() : singleKey}
              </button>
            ))}
          </div>
        )}

        {page == "ipaV" && (
          <div className={`grid grid-cols-8 w-full gap-1 justify-between`}>
            {ipaVowels.map((singleKey, index) => (
              <button
                key={singleKey}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleOnPress(singleKey);
                }}
                className={` bg-white text-base-green w-full py-3 text-base transition-colors hover:bg-slate-200 shadow border border-slate-200 rounded-lg cursor-pointer`}
              >
                {caps ? singleKey.toUpperCase() : singleKey}
              </button>
            ))}
          </div>
        )}

        {page == "ipaC" && (
          <div className={`grid grid-cols-8 w-full gap-1 justify-between`}>
            {ipaConsonants.map((singleKey, index) => (
              <button
                key={singleKey}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleOnPress(singleKey);
                }}
                className={` bg-white text-base-green w-full py-3 text-base transition-colors hover:bg-slate-200 shadow border border-slate-200 rounded-lg cursor-pointer`}
              >
                {caps ? singleKey.toUpperCase() : singleKey}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-1 justify-between">
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              setCaps(!caps);
            }}
            className={`${
              caps ? "bg-base-green text-white" : "bg-white text-base-green"
            } py-3 text-base shadow border border-slate-200 px-5 rounded-lg cursor-pointer`}
          >
            ⇪
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              togglePage();
            }}
            className={`bg-white text-base-green py-3 text-base shadow border border-slate-200 hover:bg-slate-200 px-5 rounded-lg cursor-pointer`}
          >
            {page == "keys" ? "IPA" : "ABC"}
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              handleOnPress("space");
            }}
            className={`bg-white text-base-green py-3 text-base shadow border border-slate-200 px-5 rounded-lg cursor-pointer flex-1`}
          >
            Uphẹ
          </button>
          {page == "keys" ? (
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                handleOnPress("•");
              }}
              className={`bg-white text-base-green py-3 text-base shadow border border-slate-200 hover:bg-slate-200 px-5 rounded-lg cursor-pointer`}
            >
              •
            </button>
          ) : (
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                toggleIPA();
              }}
              className={`bg-white text-base-green py-3 text-base shadow border border-slate-200 hover:bg-slate-200 px-5 rounded-lg cursor-pointer`}
            >
              {page == "ipaV" ? "1/2" : "2/2"}
            </button>
          )}

          <button
            onMouseDown={(e) => {
              e.preventDefault();
              handleOnPress("enter");
            }}
            className={`bg-white text-base-green py-3 text-base shadow border border-slate-200 px-5 rounded-lg cursor-pointer`}
          >
            ⏎
          </button>
        </div>
      </div>
    );

  return (
    <motion.div
      drag
      className="flex flex-col absolute left-1/2 -translate-x-1/2 top-32 w-full cursor-grab gap-2 max-w-3xl bg-light-gray border border-slate-200 rounded-lg p-2 z-200 "
    >
      <div className="flex w-full justify-between p-2">
        <p className="font-medium text-gray-500 uppercase"> URH </p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <RiDraggable strokeWidth={1.5} size={20} />
          <span>{t("moveKeyboard")}</span>
        </div>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            handleClose();
          }}
          className="cursor-pointer hover:text-red-800"
        >
          <X size={26} />
        </button>
      </div>

      {page == "keys" && (
        <div className={`grid grid-cols-9 w-full gap-1 justify-between`}>
          {mobileKeys.map((singleKey, index) => (
            <button
              key={singleKey}
              onMouseDown={(e) => {
                e.preventDefault();
                handleOnPress(singleKey);
              }}
              className={` bg-white text-base-green w-full py-3 text-base hover:bg-slate-200 shadow border border-slate-200 rounded-lg cursor-pointer`}
            >
              {caps ? singleKey.toUpperCase() : singleKey}
            </button>
          ))}
        </div>
      )}

      {page == "ipaV" && (
        <div className={`grid grid-cols-8 w-full gap-1 justify-between`}>
          {ipaVowels.map((singleKey, index) => (
            <button
              key={singleKey}
              onMouseDown={(e) => {
                e.preventDefault();
                handleOnPress(singleKey);
              }}
              className={` bg-white text-base-green w-full py-3 text-base transition-colors hover:bg-slate-200 shadow border border-slate-200 rounded-lg cursor-pointer`}
            >
              {caps ? singleKey.toUpperCase() : singleKey}
            </button>
          ))}
        </div>
      )}

      {page == "ipaC" && (
        <div className={`grid grid-cols-8 w-full gap-1 justify-between`}>
          {ipaConsonants.map((singleKey, index) => (
            <button
              key={singleKey}
              onMouseDown={(e) => {
                e.preventDefault();
                handleOnPress(singleKey);
              }}
              className={` bg-white text-base-green w-full py-3 text-base transition-colors hover:bg-slate-200 shadow border border-slate-200 rounded-lg cursor-pointer`}
            >
              {caps ? singleKey.toUpperCase() : singleKey}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-1 justify-between">
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            setCaps(!caps);
          }}
          className={`${
            caps
              ? "bg-base-green text-white uppercase"
              : "bg-white text-base-green hover:bg-slate-200"
          } py-3 text-base shadow border border-slate-200 px-5 rounded-lg cursor-pointer`}
        >
          ⇪
        </button>

        <button
          onMouseDown={(e) => {
            e.preventDefault();
            togglePage();
          }}
          className={`bg-white text-base-green py-3 text-base shadow border border-slate-200 hover:bg-slate-200 px-5 rounded-lg cursor-pointer`}
        >
          {page == "keys" ? "IPA" : "ABC"}
        </button>

        <button
          onMouseDown={(e) => {
            e.preventDefault();
            handleOnPress("space");
          }}
          className={`bg-white text-base-green py-3 text-base shadow border border-slate-200 hover:bg-slate-200 px-5 rounded-lg cursor-pointer flex-1`}
        >
          Uphẹ
        </button>

        {page == "keys" ? (
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              handleOnPress("•");
            }}
            className={`bg-white text-base-green py-3 text-base shadow border border-slate-200 hover:bg-slate-200 px-5 rounded-lg cursor-pointer`}
          >
            •
          </button>
        ) : (
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              toggleIPA();
            }}
            className={`bg-white text-base-green py-3 text-base shadow border border-slate-200 hover:bg-slate-200 px-5 rounded-lg cursor-pointer`}
          >
            {page == "ipaV" ? "CONS" : "VOW"}
          </button>
        )}

        <button
          onMouseDown={(e) => {
            e.preventDefault();
            handleOnPress("enter");
          }}
          className={`bg-white text-base-green py-3 text-base shadow border border-slate-200 hover:bg-slate-200 px-5 rounded-lg cursor-pointer`}
        >
          Ruo
        </button>
      </div>
    </motion.div>
  );
};

export default Keyboard;
