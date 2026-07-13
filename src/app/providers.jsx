"use client";

import { Toast } from "@heroui/react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import AuthInitializer from "./AuthInitializer";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
        <AuthInitializer>{children}</AuthInitializer>
      <Toast.Provider swipeDirection="right" placement="bottom end" duration={3000} />
      
    </Provider>
  );
}
