"use client";

import React, { useState, useRef } from "react";
import {
  BsUpload,
  BsClipboard,
  BsCheck2,
  BsCloudCheckFill,
  BsImages,
  BsExclamationTriangle,
  BsFileEarmarkCheck,
} from "react-icons/bs";

interface UploadedMediaItem {
  id: string;
  url: string;
  rawUrl: string;
  filename: string;
  size: number;
  uploadedAt: string;
}

export default function MediaTab() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [recentUploads, setRecentUploads] = useState<UploadedMediaItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
      setError(
        `File is ${(file.size / 1024 / 1024).toFixed(2)} MB. Maximum allowed size is strictly 1.0 MB.`
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed (JPEG, PNG, WEBP, SVG, GIF).");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to commit image to GitHub repository.");
      }

      const newItem: UploadedMediaItem = {
        id: `upload-${Date.now()}`,
        url: data.url,
        rawUrl: data.rawUrl,
        filename: data.filename,
        size: data.size,
        uploadedAt: new Date().toLocaleTimeString(),
      };

      setRecentUploads([newItem, ...recentUploads]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Upload Zone Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-neutral-800 pb-4">
          <h3 className="font-playfair text-xl font-bold text-white flex items-center gap-2">
            <BsImages className="text-pawcab-gold" />
            <span>GitHub Media & Image Uploader</span>
          </h3>
          <p className="text-xs text-neutral-400">
            Upload images directly into your GitHub repository under <code className="text-pawcab-gold">public/images/uploads/</code>.
          </p>
        </div>

        {/* Serverless & size alert */}
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-start gap-3 text-xs text-neutral-300">
          <BsCloudCheckFill className="text-emerald-400 text-lg shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-neutral-100">
              Serverless Safe & Zero Local Disk Writing
            </p>
            <p className="text-neutral-400 leading-relaxed">
              Files are converted in-memory to base64 and committed directly via the GitHub Contents API. No serverless filesystem write errors (<code className="text-neutral-300">ENOENT: no such file or directory, mkdir &apos;/var/task/...&apos;</code>). Maximum file size is strictly 1 MB.
            </p>
          </div>
        </div>

        {/* Drag & drop / click upload area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-neutral-700 hover:border-pawcab-gold rounded-3xl p-8 sm:p-12 text-center bg-neutral-950/60 hover:bg-neutral-950 transition cursor-pointer group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 mx-auto flex items-center justify-center text-neutral-400 group-hover:text-pawcab-gold group-hover:scale-110 transition mb-4">
            {uploading ? (
              <svg
                className="animate-spin h-7 w-7 text-pawcab-gold"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <BsUpload className="text-2xl" />
            )}
          </div>

          <h4 className="text-sm font-semibold text-white mb-1">
            {uploading ? "Committing Image to GitHub..." : "Click to select and upload image"}
          </h4>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Supported formats: JPG, PNG, WEBP, SVG. Strict size limit: &le; 1 MB per file.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800 text-error-dark text-xs flex items-center gap-2">
            <BsExclamationTriangle className="text-red-400 text-sm shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Recent Uploads Reel */}
      {recentUploads.length > 0 && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="font-playfair text-xl font-bold text-white flex items-center gap-2">
            <BsFileEarmarkCheck className="text-emerald-400" />
            <span>Recently Uploaded to GitHub</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentUploads.map((item) => (
              <div
                key={item.id}
                className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 space-y-3"
              >
                <div className="h-36 rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.filename}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-mono text-neutral-300 truncate" title={item.filename}>
                    {item.filename}
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    {(item.size / 1024).toFixed(1)} KB • {item.uploadedAt}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(item.url)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-medium transition cursor-pointer"
                  >
                    {copiedUrl === item.url ? (
                      <>
                        <BsCheck2 className="text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <BsClipboard className="text-[11px]" />
                        <span>Copy Web Path</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

