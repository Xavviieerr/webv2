import React, { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-white min-h-screen w-full min-w-0 overflow-x-hidden">
      {children}
    </div>
  );
};

export default AuthLayout;
