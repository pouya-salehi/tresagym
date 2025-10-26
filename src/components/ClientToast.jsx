"use client";
import { toast, Toaster } from "react-hot-toast";

export function ClientToast({ message }) {
  if (message) {
    toast.error(message);
  }
  return <Toaster />;
}
