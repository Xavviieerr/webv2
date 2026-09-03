import React from "react";
import ForgotPasswordModal from "@/features/auth/components/ForgotPasswordModal";

interface PasswordModalProps {
  closeModal: () => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ closeModal }) => {

  const handleCloseForgotPassword = () => {
    closeModal();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-black/20 flex items-center justify-center z-[9999] overflow-y-auto py-4">
      <div className="w-full max-w-md mx-auto my-auto">
        <ForgotPasswordModal closeModal={handleCloseForgotPassword} />
      </div>
    </div>
  );
};

export default PasswordModal;
