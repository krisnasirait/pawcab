"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AppContent } from "@/types/content";
import AdminHeader from "@/components/admin/AdminHeader";
import ToastContainer, { ToastMessage } from "@/components/admin/Toast";
import ConfirmModal from "@/components/admin/ConfirmModal";
import CommitModal from "@/components/admin/CommitModal";

// Sub Tabs
import GeneralTab from "@/components/admin/tabs/GeneralTab";
import HomeTab from "@/components/admin/tabs/HomeTab";
import PetTransportTab from "@/components/admin/tabs/PetTransportTab";
import DogWalkingTab from "@/components/admin/tabs/DogWalkingTab";
import PetSittingTab from "@/components/admin/tabs/PetSittingTab";
import StoriesTab from "@/components/admin/tabs/StoriesTab";
import ProductsTab from "@/components/admin/tabs/ProductsTab";
import MediaTab from "@/components/admin/tabs/MediaTab";

import {
  BsGear,
  BsHouseDoor,
  BsCarFront,
  BsCompass,
  BsHeart,
  BsJournalBookmark,
  BsBoxSeam,
  BsImages,
  BsUpload,
  BsExclamationTriangleFill,
} from "react-icons/bs";

type TabId =
  | "general"
  | "home"
  | "pet-transport"
  | "dog-walking"
  | "pet-sitting"
  | "stories"
  | "products"
  | "media";

export default function AdminPage() {
  const router = useRouter();

  // Content Data State
  const [content, setContent] = useState<AppContent | null>(null);
  const [originalContent, setOriginalContent] = useState<AppContent | null>(null);
  const [sha, setSha] = useState<string | null>(null);
  const [repoInfo, setRepoInfo] = useState({
    owner: "AuxoaZ",
    repo: "lp-pawcab",
    branch: "main",
    contentPath: "content.json",
  });

  // UI Status State
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [baseSyncStatus, setBaseSyncStatus] = useState<"synced" | "error" | "local">("synced");
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // Modals & Toasts
  const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const addToast = (toast: Omit<ToastMessage, "id">) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 1. Initial content fetch on mount
  useEffect(() => {
    let active = true;

    async function loadInitialContent() {
      try {
        const res = await fetch("/api/admin/content", {
          cache: "no-store",
        });

        if (!active) return;

        if (res.status === 401) {
          router.push("/login?from=/admin");
          return;
        }

        const data = await res.json();
        if (!active) return;

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to load content from GitHub repository.");
        }

        setContent(data.content);
        setOriginalContent(data.content);
        setSha(data.sha);

        if (data.owner && data.repo) {
          setRepoInfo({
            owner: data.owner,
            repo: data.repo,
            branch: data.branch || "main",
            contentPath: data.contentPath || "content.json",
          });
        }

        if (data.warning) {
          setWarningMessage(data.warning);
          setBaseSyncStatus("local");
        } else {
          setWarningMessage(null);
          setBaseSyncStatus("synced");
        }
      } catch (err: unknown) {
        if (active) {
          console.error("Fetch content error:", err);
          setBaseSyncStatus("error");
        }
      } finally {
        if (active) {
          setIsLoadingInitial(false);
        }
      }
    }

    loadInitialContent();
    return () => {
      active = false;
    };
  }, [router]);

  // 2. Manual refresh handler
  const handleManualRefresh = useCallback(async () => {
    setIsRefreshing(true);

    try {
      const res = await fetch("/api/admin/content", {
        cache: "no-store",
      });

      if (res.status === 401) {
        router.push("/login?from=/admin");
        return;
      }

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load content from GitHub repository.");
      }

      setContent(data.content);
      setOriginalContent(data.content);
      setSha(data.sha);

      if (data.owner && data.repo) {
        setRepoInfo({
          owner: data.owner,
          repo: data.repo,
          branch: data.branch || "main",
          contentPath: data.contentPath || "content.json",
        });
      }

      if (data.warning) {
        setWarningMessage(data.warning);
        setBaseSyncStatus("local");
      } else {
        setWarningMessage(null);
        setBaseSyncStatus("synced");
      }

      addToast({
        type: "success",
        title: "Data Synced with GitHub",
        message: `Loaded latest state from ${data.branch || "main"} branch.`,
      });
    } catch (err: unknown) {
      console.error("Manual refresh error:", err);
      setBaseSyncStatus("error");
      addToast({
        type: "error",
        title: "Sync Error",
        message: err instanceof Error ? err.message : "Could not fetch content from GitHub.",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [router]);

  // Derived unsaved changes and effective sync status (zero cascading renders)
  const hasUnsavedChanges =
    content !== null &&
    originalContent !== null &&
    JSON.stringify(content) !== JSON.stringify(originalContent);

  const syncStatus: "synced" | "syncing" | "dirty" | "error" | "local" =
    isRefreshing || isPublishing
      ? "syncing"
      : baseSyncStatus === "error"
      ? "error"
      : baseSyncStatus === "local"
      ? "local"
      : hasUnsavedChanges
      ? "dirty"
      : "synced";

  // Warn user before leaving if unsaved changes exist
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // 3. Commit / Publish changes to GitHub API
  const handlePublish = async (commitMessage: string) => {
    if (!content) return;

    setIsPublishing(true);

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          sha,
          commitMessage,
        }),
      });

      const data = await res.json();

      if (res.status === 409) {
        throw new Error(
          "Conflict: The GitHub repository was updated by another commit. Please refresh data first to merge changes."
        );
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to commit content to GitHub repository.");
      }

      // Update state with new SHA and mark as clean
      if (data.sha) {
        setSha(data.sha);
      }
      setOriginalContent(content);
      setBaseSyncStatus("synced");
      setIsCommitModalOpen(false);

      addToast({
        type: "success",
        title: "Successfully Published to GitHub!",
        message: data.commit?.message
          ? `Commit: "${data.commit.message}"`
          : "Your changes have been committed directly to the repository.",
      });
    } catch (err: unknown) {
      console.error("Publish error:", err);
      addToast({
        type: "error",
        title: "Publish Failed",
        message: err instanceof Error ? err.message : "Failed to commit changes to GitHub.",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  // 4. Logout handler
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  // 5. Destructive action confirm helper
  const handleRequestDeleteConfirm = (title: string, onConfirmAction: () => void) => {
    setConfirmModal({
      isOpen: true,
      title: "Confirm Deletion",
      message: title,
      onConfirm: () => {
        onConfirmAction();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        addToast({
          type: "info",
          title: "Item Removed",
          message: "Remember to click Publish Changes to commit this deletion to GitHub.",
        });
      },
    });
  };

  // Navigation tab definitions
  const tabs = [
    { id: "general", label: "General & Contact", icon: <BsGear /> },
    { id: "home", label: "Home Page", icon: <BsHouseDoor /> },
    { id: "pet-transport", label: "Pet Transport & Calc", icon: <BsCarFront /> },
    { id: "dogWalking", idAlias: "dog-walking", label: "Dog Walking", icon: <BsCompass /> },
    { id: "petSitting", idAlias: "pet-sitting", label: "Pet Sitting", icon: <BsHeart /> },
    { id: "stories", label: "Stories & Community", icon: <BsJournalBookmark /> },
    {
      id: "products",
      label: `Products Catalog (${content?.products?.length || 0})`,
      icon: <BsBoxSeam />,
    },
    { id: "media", label: "Media & Uploader", icon: <BsImages /> },
  ];

  return (
    <div data-theme="admin" className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-pawcab-gold selection:text-deep-midnight">
      {/* Top Navbar */}
      <AdminHeader
        hasUnsavedChanges={hasUnsavedChanges}
        syncStatus={syncStatus}
        currentSha={sha}
        branch={repoInfo.branch}
        isPublishing={isPublishing}
        isRefreshing={isRefreshing}
        onRefresh={handleManualRefresh}
        onOpenPublishModal={() => setIsCommitModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-6">
        {/* Warning notification banner if GitHub PAT is missing */}
        {warningMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-start gap-3">
            <BsExclamationTriangleFill className="text-amber-400 text-base shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-100 mb-0.5">
                Local Mode: GitHub PAT Not Configured
              </p>
              <p className="text-amber-300/90 leading-relaxed">
                {warningMessage} Add <code className="font-mono bg-black/40 px-1 py-0.5 rounded">GITHUB_PAT=ghp_...</code> to your <code className="font-mono bg-black/40 px-1 py-0.5 rounded">.env</code> file with repo permissions to enable direct GitHub synchronization and base64 image commits.
              </p>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoadingInitial ? (
          <div className="space-y-6 animate-pulse py-12">
            <div className="h-10 bg-neutral-900 rounded-2xl w-1/3" />
            <div className="h-64 bg-neutral-900 rounded-3xl" />
            <div className="h-96 bg-neutral-900 rounded-3xl" />
          </div>
        ) : !content ? (
          /* Error State */
          <div className="text-center py-20 bg-neutral-900 border border-neutral-800 rounded-3xl p-8 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-red-950/50 text-red-400 flex items-center justify-center mx-auto mb-4 text-2xl">
              <BsExclamationTriangleFill />
            </div>
            <h3 className="font-playfair text-2xl font-bold text-white mb-2">
              Failed to Load Content
            </h3>
            <p className="text-xs text-neutral-400 mb-6">
              Could not communicate with GitHub API or read content.json. Please check your network or environment credentials.
            </p>
            <button
              type="button"
              onClick={handleManualRefresh}
              className="px-5 py-2.5 bg-pawcab-gold hover:bg-pawcab-gold/90 text-deep-midnight font-bold rounded-xl text-xs transition cursor-pointer"
            >
              Retry Sync
            </button>
          </div>
        ) : (
          /* Main Dashboard Content */
          <div className="space-y-6">
            {/* Main Tabs Navigation Bar */}
            <nav className="flex items-center gap-1.5 p-1.5 bg-neutral-900/90 border border-neutral-800 rounded-2xl overflow-x-auto scrollbar-none shadow-sm">
              {tabs.map((tab) => {
                const tabKey = (tab.idAlias || tab.id) as TabId;
                const isActive = activeTab === tabKey;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tabKey)}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      isActive
                        ? "bg-neutral-800 text-pawcab-gold shadow-sm border border-neutral-700/80"
                        : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800"
                    }`}
                  >
                    <span className="text-sm">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Active Tab Panel */}
            <div className="pb-24">
              {activeTab === "general" && (
                <GeneralTab content={content} onChange={setContent} />
              )}
              {activeTab === "home" && (
                <HomeTab content={content} onChange={setContent} />
              )}
              {activeTab === "pet-transport" && (
                <PetTransportTab content={content} onChange={setContent} />
              )}
              {activeTab === "dog-walking" && (
                <DogWalkingTab content={content} onChange={setContent} />
              )}
              {activeTab === "pet-sitting" && (
                <PetSittingTab content={content} onChange={setContent} />
              )}
              {activeTab === "stories" && (
                <StoriesTab
                  content={content}
                  onChange={setContent}
                  onRequestDeleteConfirm={handleRequestDeleteConfirm}
                />
              )}
              {activeTab === "products" && (
                <ProductsTab
                  content={content}
                  onChange={setContent}
                  onRequestDeleteConfirm={handleRequestDeleteConfirm}
                />
              )}
              {activeTab === "media" && <MediaTab />}
            </div>
          </div>
        )}
      </main>

      {/* Floating Save Action Bar (appears when user modifies data) */}
      {hasUnsavedChanges && !isLoadingInitial && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-neutral-900/95 border border-pawcab-gold/40 shadow-2xl rounded-2xl p-3 px-5 flex items-center gap-4 backdrop-blur-md animate-scaleUp">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-xs text-neutral-200 font-medium">
              You have unsaved changes ready to publish.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (originalContent) setContent(originalContent);
              }}
              className="px-3 py-1.5 rounded-xl border border-neutral-700 hover:bg-neutral-800 text-xs text-neutral-400 hover:text-white transition cursor-pointer"
            >
              Discard Edits
            </button>
            <button
              type="button"
              onClick={() => setIsCommitModalOpen(true)}
              disabled={isPublishing}
              className="px-4 py-1.5 rounded-xl bg-pawcab-gold hover:bg-pawcab-gold/90 text-deep-midnight text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-lg"
            >
              <BsUpload />
              <span>Publish to GitHub</span>
            </button>
          </div>
        </div>
      )}

      {/* Commit Modal */}
      <CommitModal
        isOpen={isCommitModalOpen}
        isPublishing={isPublishing}
        currentSha={sha}
        repoInfo={repoInfo}
        onConfirm={handlePublish}
        onCancel={() => setIsCommitModalOpen(false)}
      />

      {/* Confirm Deletion Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Visual Feedback Toasts */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
