"use client";
import { createContext, useContext, useState } from "react";
import ConfirmModal from "@/components/condirmodal/ConfirModal";

const ConfirmContext = createContext();

export function ConfirmProvider({ children }) {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "warning",
    onConfirm: null,
    onCancel: null,
  });

  const confirm = (title, message, type = "warning") => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        title,
        message,
        type,
        onConfirm: () => {
          setConfirmState({
            isOpen: false,
            title: "",
            message: "",
            type: "warning",
            onConfirm: null,
            onCancel: null,
          });
          resolve(true);
        },
        onCancel: () => {
          setConfirmState({
            isOpen: false,
            title: "",
            message: "",
            type: "warning",
            onConfirm: null,
            onCancel: null,
          });
          resolve(false);
        },
      });
    });
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        type={confirmState.type}
        onConfirm={confirmState.onConfirm}
        onCancel={confirmState.onCancel}
      />
    </ConfirmContext.Provider>
  );
}

// اینجا هوک رو تعریف کن
export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
};
