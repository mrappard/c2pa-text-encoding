"use client";

import { useEffect, useMemo, useState } from "react";
import Markdown from "react-markdown";
import { C2paManifest } from "c2pa-react-component";
import "c2pa-react-component/style.css";
import { variationSelectorToByte, embedSecretRepeatedly } from "~/encoder";
import type { ReaderAsset } from "~/store/readerStore";

interface ReaderProps {
  asset: ReaderAsset;
}

type View = "document" | "c2pa";

export const Reader = ({ asset }: ReaderProps) => {
  const [view, setView] = useState<View>("document");
  const [isRaw, setIsRaw] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Control" || e.key === "Meta") setIsRaw(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Control" || e.key === "Meta") setIsRaw(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const cleanedMarkdown = useMemo(
    () => asset.markdown.replace(/<!--[\s\S]*?-->/g, ""),
    [asset.markdown],
  );

  // Strip any existing variation selectors so the carrier is clean plain text,
  // then re-embed asset.id as the hidden secret for copy-paste traceability.
  const encodedRawText = useMemo(() => {
    const plainText = Array.from(cleanedMarkdown)
      .filter((ch) => variationSelectorToByte(ch.codePointAt(0)!) === null)
      .join("");
    return embedSecretRepeatedly(plainText, asset.id, { spacing: 24 }).embeddedText;
  }, [cleanedMarkdown, asset.id]);

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Sub-toolbar */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-2 shrink-0">
        <div className="flex gap-1">
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
          <button
            onClick={() => setView("c2pa")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              view === "c2pa"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            C2PA
          </button>
        </div>

        {view === "document" && (
          <span className="text-xs font-mono text-gray-400 select-none">
            {isRaw
              ? "RAW  · release Ctrl / ⌘ to render"
              : "RENDERED  · hold Ctrl / ⌘ for raw"}
          </span>
        )}
      </div>

      {/* Content */}
      {view === "c2pa" ? (
        <div className="flex-1 overflow-auto p-6 flex justify-center">
          <C2paManifest
            manifest={asset.manifest}
            level={2}
            onViewMore={undefined}
            defaultViewMore={false}
          />
        </div>
      ) : (
        <div className="flex flex-col flex-1 overflow-auto p-8">
          <h1 className="text-3xl font-bold text-gray-900 border-b pb-4 mb-6">
            {asset.title}
          </h1>
          {isRaw ? (
            <pre className="flex-1 whitespace-pre-wrap break-words font-mono text-sm text-gray-700 leading-relaxed">
              {encodedRawText}
            </pre>
          ) : (
            <div className="prose prose-slate max-w-none text-gray-700 leading-relaxed">
              <Markdown>{cleanedMarkdown}</Markdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
