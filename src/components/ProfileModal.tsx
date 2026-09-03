import React, { useState, useMemo } from "react";
import Image from "next/image";
import { FiEdit } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { useAppSelector } from "@/types/hooks";
import { RiLoader2Fill } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import { useUpdateNameMutation, useUpdateProfileImageMutation } from "@/slice/userEndpoints";

interface ProfileProps {
  closeModal: () => void;
}

const ProfileModal: React.FC<ProfileProps> = ({ closeModal }) => {
  const [newName, setNewName] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const { user } = useAppSelector((state) => state.auth);
  const [updateNameMutation] = useUpdateNameMutation();
  const [updateProfileImageMutation, { isLoading: updateStarted }] = useUpdateProfileImageMutation();
  const { t } = useTranslation("common");


  // Convert uploaded file to base64
  // const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     const result = reader.result as string;
  //     if (result) {
  //       // Keep the full Data URL (don't strip prefix)
  //       setSelectedImage(result);
  //     }
  //   };
  //   reader.readAsDataURL(file);
  // };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
  };

  const handleUpdateProfile = async () => {
    if (!newName.trim() && !selectedImage) return;

    const firstName = newName.split(" ")[0] || user?.firstName || "";
    const lastName = newName.split(" ").slice(1).join(" ") || user?.lastName || "";

    try {
      if (newName.trim()) {
        await updateNameMutation({ firstName, lastName }).unwrap();
      }
      if (selectedImage) {
        await updateProfileImageMutation({ imageFile: selectedImage }).unwrap();
      }
      closeModal();
    } catch (err: unknown) {
      console.error((err as { data?: { message?: string } })?.data?.message || "Profile update failed");
    }
  };

  const imagePreviewUrl = useMemo(
    () => (selectedImage ? URL.createObjectURL(selectedImage) : null),
    [selectedImage],
  );

  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-black/20 flex items-center justify-center z-[9999] overflow-y-auto py-4">
      <section className="bg-[#f2feff] p-6 rounded-xl w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.3)] my-auto mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#05353A]">{t('personalDetails')}</h2>
          <button onClick={closeModal} className="text-[#05353A]">
            <MdClose size={24} />
          </button>
        </div>

        {/* Profile picture with edit button */}
        <div className="flex justify-center mb-6 relative">
          <div className="relative">
            <Image
              src={imagePreviewUrl || "/man.png"}
              alt="Profile of user"
              className="rounded-full cursor-pointer object-cover"
              width={100}
              height={100}
            />
            <label className="absolute bottom-0 right-0 bg-[#05353A] text-white p-2 rounded-full hover:bg-[#05353A]/90 transition-colors cursor-pointer">
              <FiEdit size={16} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#05353A] mb-1">
              {t('currentName')}
            </label>
            <div className="p-2 rounded-xl border border-[#05353A]/20 capitalize text-[#05353A] bg-white">
              {user?.firstName} {user?.lastName}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#05353A] mb-1">
              {t('newName')}
            </label>
            <input
              type="text"
              className="w-full p-2 rounded-xl border border-[#05353A]/20 bg-white text-[#05353A] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#05353A]"
              placeholder={t('newName')}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex">
          <button
            onClick={handleUpdateProfile}
            disabled={updateStarted}
            className="bg-[#05353A] text-white py-2 px-6 w-full rounded-lg font-medium flex items-center justify-center disabled:opacity-50"
          >
            {updateStarted ? (
              <>
                <RiLoader2Fill className="animate-spin mr-2" />
                Updating...
              </>
            ) : (
              t('done')
            )}
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProfileModal;
