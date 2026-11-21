"use client";

import React, { useEffect } from "react";
import { BsCheckCircleFill, BsExclamationTriangleFill, BsXCircleFill, BsX } from "react-icons/bs";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    success: <BsCheckCircleFill className="text-emerald-500 text-lg shrink-0 mt-0.5" />,
    error: <BsXCircleFill className="text-red-500 text-lg shrink-0 mt-0.5" />,
    warning: <BsExclamationTriangleFill className="text-amber-500 text-lg shrink-0 mt-0.5" />,
    info: <BsCheckCircleFill className="text-info text-lg shrink-0 mt-0.5" />,
  };

  const borderColors = {
    success: "border-emerald-500/30 bg-emerald-950/90 text-emerald-100",
    error: "border-red-500/30 bg-red-950/90 text-red-100",
    warning: "border-amber-500/30 bg-amber-950/90 text-amber-100",
    info: "border-blue-500/30 bg-blue-950/90 text-blue-100",
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-md transition-all animate-fadeIn ${borderColors[toast.type]}`}
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0 text-left">
        <h4 className="text-sm font-semibold leading-tight">{toast.title}</h4>
        {toast.message && (
          <p className="text-xs opacity-90 mt-1 leading-relaxed break-words">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="opacity-70 hover:opacity-100 transition p-1 -mr-1 -mt-1 text-base cursor-pointer"
      >
        <BsX />
      </button>
    </div>
  );
}

