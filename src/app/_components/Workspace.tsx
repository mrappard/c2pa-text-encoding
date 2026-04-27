"use client";

import { useEffect, useMemo, useState } from "react";
import Markdown from "react-markdown";
import {
  recoverMultipleSecretsFromText,
  variationSelectorToByte,
} from "~/encoder";
import { useReaderStore } from "~/store/readerStore";

const STORAGE_KEY = "gemini-workspace-content";
const MANIFESTS_KEY = "gemini-workspace-manifests";

type View = "markdown" | "document";

export interface DetectedManifest {
  id: string;
  text: string;
}

export const Workspace = () => {
  const assets = useReaderStore((s) => s.assets);

  const [view, setView] = useState<View>("markdown");
  const [content, setContent] = useState("");
  const [detectedManifests, setDetectedManifests] = useState<DetectedManifest[]>([]);

  useEffect(() => {
    const savedContent = localStorage.getItem(STORAGE_KEY);
    if (savedContent) setContent(savedContent);

    const savedManifests = localStorage.getItem(MANIFESTS_KEY);
    if (savedManifests) {
      try {
        setDetectedManifests(JSON.parse(savedManifests) as DetectedManifest[]);
      } catch {
        // corrupt storage — ignore
      }
    }
  }, []);

  // Ensure every single newline becomes a paragraph break for react-markdown,
  // without doubling lines that already have a blank line between them.
  const displayContent = useMemo(
    () => content.replace(/(?<!\n)\n(?!\n)/g, "\n\n"),
    [content],
  );

  const handleTextChange = (text: string) => {
    // Run recovery on the raw text before stripping
    const recovered = recoverMultipleSecretsFromText(text);
    const uniqueIds = Array.from(new Set(recovered.map((r) => r.secret)));
    const manifests: DetectedManifest[] = uniqueIds.map((id) => {
      const asset = assets.find((a) => a.id === id);
      return {
        id,
        text: asset ? asset.title : `unknown manifest: ${id}`,
      };
    });
    setDetectedManifests(manifests);
    localStorage.setItem(MANIFESTS_KEY, JSON.stringify(manifests));

    // Strip variation selectors so stored content is clean markdown
    const cleanText = Array.from(text)
      .filter((ch) => variationSelectorToByte(ch.codePointAt(0)!) === null)
      .join("");

    setContent(cleanText);
    localStorage.setItem(STORAGE_KEY, cleanText);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
      {/* Sub-toolbar */}
      <div className="flex items-center gap-1 border-b border-gray-200 bg-white px-6 py-2 shrink-0">
        <button
          onClick={() => setView("markdown")}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            view === "markdown"
              ? "bg-blue-100 text-blue-700"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          }`}
        >
          Markdown
        </button>
        <button
          onClick={() => setView("document")}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            view === "document"
              ? "bg-blue-100 text-blue-700"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          }`}
        >
          Document
        </button>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden p-6">
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {view === "markdown" ? (
            <textarea
              placeholder="Start typing or paste text from papers..."
              className="flex-1 p-4 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-gray-800 leading-relaxed"
              value={content}
              onChange={(e) => handleTextChange(e.target.value)}
            />
          ) : (
            <div className="flex-1 overflow-auto rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              {content ? (
                <div className="prose prose-slate max-w-none text-gray-700 leading-relaxed">
                  <Markdown>{displayContent}</Markdown>
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  Nothing to preview yet. Switch to Markdown and paste some text.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Detected sources panel */}
        <div className="w-80 shrink-0 flex flex-col gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Detected Sources
            </h3>
            {detectedManifests.length > 0 ? (
              <ul className="space-y-3">
                {detectedManifests.map((manifest) => (
                  <li
                    key={manifest.id}
                    className="rounded border border-blue-100 bg-blue-50 p-2"
                  >
                    <p className="text-sm italic text-gray-700">
                      &quot;{manifest.text}&quot;
                    </p>
                    <p className="mt-1 truncate font-mono text-xs text-gray-400">
                      {manifest.id}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 italic">
                No sources detected yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
