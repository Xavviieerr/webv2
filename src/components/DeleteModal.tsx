import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MdClose,
  MdWarning,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";

interface DeleteAccountModalProps {
  closeModal: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  closeModal,
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { t } = useTranslation("common");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle account deletion logic here
    console.log("Account deletion submitted");
    closeModal();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-black/20 flex items-center justify-center z-[9999] overflow-y-auto py-4">
      <section className="bg-[#f2feff] p-6 rounded-xl w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.3)] my-auto mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#05353A] flex items-center gap-2">
            <MdWarning className="text-red-500" size={24} />
            {t('deleteAccount')}
          </h2>
          <button
            onClick={closeModal}
            className="text-[#05353A] hover:text-[#05353A]/80 transition-colors"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Warning Message */}
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">
            {t('deleteAccountWarning')}
          </p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password Verification */}
          <div>
            <label className="block text-sm font-medium text-[#05353A] mb-2">
              {t('enterConfirmationPassword')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg border border-[#05353A]/20 bg-white text-[#05353A] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#05353A] pr-10"
                placeholder={t('yourPassword')}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-[#05353A]/70 hover:text-[#05353A]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <MdVisibilityOff size={20} />
                ) : (
                  <MdVisibility size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Confirmation Checkbox - Updated with green check */}
          <div className="flex items-start">
            <div className="relative flex items-center">
              <input
                id="confirmation"
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="peer appearance-none w-5 h-5 border-2 border-[#05353A] rounded 
                          checked:bg-[#05353A] checked:border-[#05353A] focus:outline-none focus:ring-2 focus:ring-[#05353A] focus:ring-offset-0"
                required
              />
              <svg
                className="absolute w-5 h-5 hidden peer-checked:block pointer-events-none text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <label
              htmlFor="confirmation"
              className="ml-2 text-sm text-[#05353A]"
            >
              {t('deleteAccountAcknowledgement')}
            </label>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 border border-[#05353A] text-[#05353A] py-3 px-6 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={!isChecked}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                isChecked
                  ? "bg-[#05353A] text-white "
                  : "bg-red-300 text-white cursor-not-allowed"
              }`}
            >
              {t('deleteAccount')}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default DeleteAccountModal;
