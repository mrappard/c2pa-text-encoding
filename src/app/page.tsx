"use client";

import { useState, useMemo } from "react";
import { DragAndDrop } from "./_components/DragAndDrop";
import { Reader } from "./_components/Reader";
import { Workspace } from "./_components/Workspace";
import { useReaderStore } from "~/store/readerStore";
import { api } from "~/trpc/react";
import type { ReaderAsset } from "~/store/readerStore";

type Tab = "reader" | "workspace" | "verify" | "debug";

const MODE_LABEL: Record<Tab, string> = {
  reader: "MODE: READING",
  workspace: "MODE: COMPOSING",
  verify: "MODE: VERIFYING",
  debug: "MODE: DEBUG",
};

export default function Home() {
  const assets = useReaderStore((s) => s.assets);
  const insertAsset = useReaderStore((s) => s.insertAsset);
  const deleteAsset = useReaderStore((s) => s.deleteAsset);

  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("reader");

  const filteredAssets = useMemo(
    () =>
      assets.filter((a) =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [assets, searchTerm],
  );

  const selectedAsset = useMemo(
    () => assets.find((a) => a.id === selectedAssetId) ?? assets[0] ?? null,
    [assets, selectedAssetId],
  );

  const populateMutation = api.createText.populateC2PAText.useMutation({
    onSuccess: (data) => {
      assets.forEach((a) => deleteAsset(a.id));
      (data as ReaderAsset[]).forEach((asset) => insertAsset(asset));
    },
  });

  return (
    <main className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600 mb-4">C2PA Text</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search library..."
              className="w-full pl-3 pr-4 py-2 bg-gray-100 border-transparent rounded-md focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
            Library
          </h2>
          {filteredAssets.map((asset) => (
            <button
              key={asset.id}
              onClick={() => {
                setSelectedAssetId(asset.id);
                setActiveTab("reader");
              }}
              className={`w-full text-left px-3 py-3 rounded-lg transition-colors text-sm font-medium ${
                selectedAsset?.id === asset.id
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {asset.title}
            </button>
          ))}
          {assets.length === 0 && (
            <p className="text-sm text-gray-400 px-2 italic">
              No documents yet. Use Verify to import a signed Markdown file.
            </p>
          )}
          {assets.length > 0 && filteredAssets.length === 0 && (
            <p className="text-sm text-gray-400 px-2 italic">
              No documents match your search.
            </p>
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      <section className="flex-1 flex flex-col overflow-hidden">
        {/* Tab Header */}
        <header className="bg-white border-b border-gray-200 px-6 flex items-center justify-between">
          <div className="flex space-x-8">
            {(["reader", "workspace", "verify", "debug"] as Tab[]).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ),
            )}
          </div>
          <div className="text-xs text-gray-400 font-mono">
            {MODE_LABEL[activeTab]}
          </div>
        </header>

        {/* Dynamic View Content */}
        <div className="flex-1 relative overflow-hidden">
          {activeTab === "reader" ? (
            selectedAsset ? (
              <Reader asset={selectedAsset} />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-400 italic">
                Import a document via the Verify tab to get started.
              </div>
            )
          ) : activeTab === "workspace" ? (
            <Workspace />
          ) : activeTab === "verify" ? (
            <DragAndDrop />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-6 p-8">
              <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-1 text-lg font-semibold text-gray-900">
                  Debug
                </h2>
                <p className="mb-6 text-sm text-gray-500">
                  Seeding the database will populate your library with the
                  default signed documents.{" "}
                  <span className="font-medium text-red-600">
                    This will erase all documents currently in your library.
                  </span>
                </p>

                {populateMutation.isSuccess && (
                  <p className="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                    Library seeded successfully with{" "}
                    {(populateMutation.data as ReaderAsset[]).length} documents.
                  </p>
                )}
                {populateMutation.isError && (
                  <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {populateMutation.error.message}
                  </p>
                )}

                <button
                  onClick={() => populateMutation.mutate()}
                  disabled={populateMutation.isPending}
                  className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {populateMutation.isPending ? "Seeding…" : "Seed DB"}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
