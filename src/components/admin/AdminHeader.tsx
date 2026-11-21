"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BsArrowRepeat,
  BsBoxArrowUpRight,
  BsBoxArrowRight,
  BsCloudCheckFill,
  BsExclamationCircleFill,
  BsGit,
  BsUpload,
} from "react-icons/bs";

interface AdminHeaderProps {
  hasUnsavedChanges: boolean;
  syncStatus: "synced" | "syncing" | "dirty" | "error" | "local";
  currentSha: string | null;
  branch: string;
  isPublishing: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  onOpenPublishModal: () => void;
  onLogout: () => void;
}

export default function AdminHeader({
  hasUnsavedChanges,
  syncStatus,
  currentSha,
  branch,
  isPublishing,
  isRefreshing,
  onRefresh,
  onOpenPublishModal,
  onLogout,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 text-white px-4 sm:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Brand & GitHub status */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-deep-midnight border border-sand-beige/30 p-1.5 flex items-center justify-center shrink-0">
              <Image
                src="/images/logo-pawcab.png"
                alt="The PawCab Logo"
                width={30}
                height={30}
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-playfair font-bold text-base text-white">The PawCab</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-pawcab-gold/20 text-pawcab-gold tracking-widest uppercase">
                  CMS
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">Website Content Management</p>
            </div>
          </div>

          {/* Sync indicator pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-950 border border-neutral-800 text-xs">
            {syncStatus === "syncing" && (
              <>
                <svg
                  className="animate-spin h-3.5 w-3.5 text-pawcab-gold"
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
                <span className="text-neutral-300">Syncing with GitHub...</span>
              </>
            )}

            {syncStatus === "synced" && (
              <>
                <BsCloudCheckFill className="text-emerald-400 text-sm" />
                <span className="text-emerald-300 font-medium">Synced with GitHub</span>
                <span className="text-neutral-600 font-mono">|</span>
                <span className="font-mono text-neutral-400 flex items-center gap-1 text-[11px]">
                  <BsGit className="text-[10px]" /> {branch}
                  {currentSha ? `@${currentSha.substring(0, 7)}` : ""}
                </span>
              </>
            )}

            {syncStatus === "dirty" && (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-amber-300 font-medium">Unsaved Changes</span>
              </>
            )}

            {syncStatus === "local" && (
              <>
                <BsExclamationCircleFill className="text-amber-400 text-sm" />
                <span className="text-amber-300 font-medium">Local Mode (No GitHub PAT)</span>
              </>
            )}

            {syncStatus === "error" && (
              <>
                <BsExclamationCircleFill className="text-red-400 text-sm" />
                <span className="text-error-dark font-medium">Sync Issue</span>
              </>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Refresh Data button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing || isPublishing}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-medium text-neutral-200 transition cursor-pointer disabled:opacity-50"
            title="Fetch latest content.json from GitHub"
          >
            <BsArrowRepeat className={`text-sm ${isRefreshing ? "animate-spin text-pawcab-gold" : ""}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>

          {/* View live site button */}
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-medium text-neutral-200 transition cursor-pointer"
            title="Open website preview in new tab"
          >
            <BsBoxArrowUpRight className="text-xs" />
            <span className="hidden sm:inline">View Site</span>
          </Link>

          {/* Publish / Save Changes button */}
          <button
            type="button"
            onClick={onOpenPublishModal}
            disabled={isPublishing}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition cursor-pointer shadow-lg disabled:opacity-50 ${
              hasUnsavedChanges
                ? "bg-pawcab-gold hover:bg-pawcab-gold/90 text-deep-midnight ring-2 ring-pawcab-gold/40 animate-pulse"
                : "bg-success hover:bg-emerald-500 text-white"
            }`}
          >
            <BsUpload className="text-sm" />
            <span>{hasUnsavedChanges ? "Publish Changes" : "Save / Publish"}</span>
          </button>

          {/* Logout button */}
          <button
            type="button"
            onClick={onLogout}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-red-950/60 hover:text-red-400 border border-neutral-700 text-neutral-400 transition cursor-pointer ml-1"
            title="Log out of CMS"
          >
            <BsBoxArrowRight className="text-base" />
          </button>
        </div>
      </div>
    </header>
  );
}

