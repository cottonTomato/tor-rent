"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";

export function useToast() {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const showToast = (msg: string) => {
    setMessage(msg);
    setOpen(true);
  };

  return {
    open,
    message,
    showToast,
    setOpen,
  };
}

export function Toast({ open, setOpen, message }: { open: boolean; setOpen: (val: boolean) => void; message: string }) {
  return (
    <ToastPrimitives.Provider>
      <ToastPrimitives.Root open={open} onOpenChange={setOpen}>
        <ToastPrimitives.Title>{message}</ToastPrimitives.Title>
        <ToastPrimitives.Close />
      </ToastPrimitives.Root>
      <ToastPrimitives.Viewport />
    </ToastPrimitives.Provider>
  );
}
