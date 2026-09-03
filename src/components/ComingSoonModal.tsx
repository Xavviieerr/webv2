import React from "react";
import { MdClose } from "react-icons/md";
import { useTranslation } from "react-i18next";
import Link from "next/link";

interface ComingSoonModalProps {
  closeModal: () => void;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ closeModal }) => {
  const { t } = useTranslation("common");

  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-black/20 flex items-center justify-center z-[9999] overflow-y-auto py-4">
      <section className="bg-[#f2feff] p-6 rounded-xl w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.3)] my-auto mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#05353A]">{t("comingSoon")}</h2>
          <button onClick={closeModal} className="text-[#05353A]">
            <MdClose size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-[#05353A] text-base">
            {t("comingSoonMessage")}
          </p>

          <div className="flex gap-3 mt-6">
            <button
              onClick={closeModal}
              className="flex-1 py-2 px-4 border border-[#05353A] text-[#05353A] rounded-lg font-medium hover:bg-[#05353A]/10 transition-colors"
            >
              {t("cancel")}
            </button>
            <Link
              href="/signin"
              className="flex-1 py-2 px-4 bg-[#05353A] text-white rounded-lg font-medium hover:opacity-90 transition text-center"
              onClick={closeModal}
            >
              {t("login")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComingSoonModal;

