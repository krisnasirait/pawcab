"use client";

import React, { useState } from "react";
import { BsGit, BsUpload, BsX } from "react-icons/bs";

interface CommitModalProps {
  isOpen: boolean;
  isPublishing: boolean;
  currentSha: string | null;
  repoInfo: {
    owner: string;
    repo: string;
    branch: string;
    contentPath: string;
  };
  onConfirm: (commitMessage: string) => Promise<void>;
  onCancel: () => void;
}

export default function CommitModal({
  isOpen,
  isPublishing,
  currentSha,
  repoInfo,
  onConfirm,
  onCancel,
}: CommitModalProps) {
  const [commitMessage, setCommitMessage] = useState("Update content.json via PawCab CMS");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(commitMessage);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative animate-scaleUp">
        <button
          onClick={onCancel}
          disabled={isPublishing}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white transition p-1 cursor-pointer disabled:opacity-50"
        >
          <BsX className="text-xl" />
        </button>

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-pawcab-gold/10 text-pawcab-gold flex items-center justify-center">
            <BsGit className="text-xl" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-white">Publish to GitHub</h3>
            <p className="text-xs text-neutral-400">
              Commit changes directly to your repository via GitHub Contents API
            </p>
          </div>
        </div>

        {/* Repository details pill */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-3.5 mb-5 space-y-1.5 text-xs text-neutral-300">
          <div className="flex justify-between">
            <span className="text-neutral-500">Repository:</span>
            <span className="font-mono text-neutral-200">
              {repoInfo.owner}/{repoInfo.repo}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Branch:</span>
            <span className="font-mono text-pawcab-gold">{repoInfo.branch}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Target File:</span>
            <span className="font-mono text-neutral-200">{repoInfo.contentPath}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Base SHA:</span>
            <span className="font-mono text-neutral-400">
              {currentSha ? currentSha.substring(0, 10) + "..." : "Initial Commit (None)"}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
              Commit Message
            </label>
            <input
              type="text"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="e.g. Update transport fares & zone pricing"
              disabled={isPublishing}
              required
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-neutral-100 text-sm placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-pawcab-gold focus:border-pawcab-gold transition disabled:opacity-50"
            />
            <p className="text-[11px] text-neutral-500 mt-1.5">
              This commit message will be recorded in GitHub commit history.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isPublishing}
              className="px-4 py-2.5 rounded-xl border border-neutral-700 hover:bg-neutral-800 text-sm font-medium transition cursor-pointer text-neutral-300 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPublishing}
              className="px-5 py-2.5 rounded-xl bg-pawcab-gold hover:bg-pawcab-gold/90 text-midnight text-sm font-semibold transition cursor-pointer flex items-center gap-2 shadow-lg disabled:opacity-60"
            >
              {isPublishing ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-midnight"
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
                  <span>Committing to GitHub...</span>
                </>
              ) : (
                <>
                  <BsUpload />
                  <span>Commit & Publish</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

