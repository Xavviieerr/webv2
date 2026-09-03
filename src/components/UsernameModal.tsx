import { useAppSelector } from "@/types/hooks";
import { useUpdateUserNameMutation } from "@/slice/userEndpoints";
import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { RiLoader2Fill } from "react-icons/ri";
import { useTranslation } from "react-i18next";

interface UsernameModalProps {
  closeModal: () => void;
}

const UsernameModal: React.FC<UsernameModalProps> = ({ closeModal }) => {
  const [newUsername, setNewUsername] = useState("");
  const { user } = useAppSelector((state) => state.auth);
  const [updateUserNameMutation, { isLoading: updateStarted }] = useUpdateUserNameMutation();
  const { t } = useTranslation("common");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;

    try {
      await updateUserNameMutation({ username: newUsername.trim() }).unwrap();
      closeModal();
    } catch (err: unknown) {
      console.error((err as { data?: { message?: string } })?.data?.message || "Update failed");
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-black/20 flex items-center justify-center z-[9999] overflow-y-auto py-4">
      <section className="bg-[#f2feff] p-6 rounded-xl w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.3)] my-auto mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#05353A]">{t('username')}</h2>
          <button
            onClick={closeModal}
            className="text-[#05353A] hover:text-[#05353A]/80 transition-colors"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#05353A] mb-2">
            {t('currentName')}
            </label>
            <div className="p-2 rounded-xl border border-[#05353A]/20 text-[#05353A] bg-white">
              {user?.username}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#05353A] mb-2">
              {t('newUsername')}
            </label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full p-2 rounded-xl border border-[#05353A]/20 bg-white text-[#05353A] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#05353A]"
              placeholder={t('newUsername')}
              required
            />
          </div>

          <p className="text-sm text-[#05353A]/70 -mt-4">
            {(t('changedUsernameNotice'))}
          </p>

          <div className="mt-6">
            <button
              type="submit"
              className="bg-[#05353A] text-white py-3 px-6 w-full rounded-lg font-medium hover:bg-[#05353A]/90 transition-colors flex items-center justify-center"
              disabled={updateStarted}
            >
              {updateStarted ? (
                <>
                  <RiLoader2Fill className="animate-spin mr-2" />
                  {t('updating')}
                </>
              ) : (
                t('done')
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default UsernameModal;
