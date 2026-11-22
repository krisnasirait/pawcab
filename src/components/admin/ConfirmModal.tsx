"use client";

import React from "react";
import { BsExclamationTriangleFill, BsX } from "react-icons/bs";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  isDestructive = true,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl relative animate-scaleUp">
        <button
          onClick={onCancel}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white transition p-1 cursor-pointer"
        >
          <BsX className="text-xl" />
        </button>

        <div className="flex items-center gap-3.5 mb-4">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              isDestructive ? "bg-red-500/10 text-red-400" : "bg-pawcab-gold/10 text-pawcab-gold"
            }`}
          >
            <BsExclamationTriangleFill className="text-lg" />
          </div>
          <h3 className="font-display text-xl font-bold text-white">{title}</h3>
        </div>

        <p className="text-sm text-neutral-300 leading-relaxed mb-6">{message}</p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-neutral-700 hover:bg-neutral-800 text-sm font-medium transition cursor-pointer text-neutral-300 hover:text-white"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer shadow-lg ${
              isDestructive
                ? "bg-red-600 hover:bg-red-700 text-white shadow-red-900/30"
                : "bg-pawcab-gold hover:bg-pawcab-gold/90 text-midnight"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

