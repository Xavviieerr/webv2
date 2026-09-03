"use client";

import { Provider } from "react-redux";
import React, { useRef } from "react";
import { persistor, store } from "@/store/store";
import "@/slice/endpoints";
import { PersistGate } from "redux-persist/integration/react";
import { Store } from "@reduxjs/toolkit";
import Loader from "@/components/Loader";
import { Toaster } from "react-hot-toast";

export const ColorModeContext = React.createContext({
  toggleColorMode: () => { },
});

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<Store | null>(null);
  if (!storeRef.current) {
    storeRef.current = store;
  }
  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={<Loader />} persistor={persistor}>
        <Toaster position="top-center" />
        {children}
      </PersistGate>
    </Provider>
  );
};
