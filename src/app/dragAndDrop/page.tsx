"use client";

import { C2paManifest, type ManifestStore, type VerificationOutcome  } from "c2pa-react-component";
import { useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { api } from "~/trpc/react";
import "c2pa-react-component/style.css";
import { C2paButton } from "../_components/button";
import { useReaderStore } from "~/store/readerStore";


const isMarkdownFile = (file: File) => {
  const fileName = file.name.toLowerCase();

  return fileName.endsWith(".md") || fileName.endsWith(".markdown");
};

export default function DragAndDropPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileText, setFileText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [verificationResult, setVerificationResult] = useState<VerificationOutcome | null>(null);

  const readerStore = useReaderStore()

  const verifyC2PATextMutation = api.verifyText.verifyC2PAText.useMutation();

  const verifyFile = async (file: File) => {
    setErrorMessage("");
    setVerificationResult(null);

    if (!isMarkdownFile(file)) {
      setFileName("");
      setFileText("");
      setErrorMessage("Drop a .MD or .Markdown file.");
      return;
    }

    const markdown = await file.text();

    setFileName(file.name);
    setFileText(markdown);

    const result = await verifyC2PATextMutation.mutateAsync({ markdown });
    setVerificationResult(result as unknown as VerificationOutcome);
  };

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];

    if (!file) return;

    void verifyFile(file).catch((error: unknown) => {
      setVerificationResult(null);
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to verify this file.",
      );
    });
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
    event.target.value = "";
  };





  return (
    <main className="flex min-h-screen flex-col bg-gray-100 p-6">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6">
        <header>
          <h1 className="text-2xl font-semibold text-gray-950">
            Verify Markdown Document
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Drop a signed Markdown file to inspect its C2PA verification result.
          </p>
        </header>

        <section className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="flex flex-col gap-4">
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white p-8 text-center shadow-sm transition-colors ${isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-300"
                }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".md,.markdown,text/markdown,text/plain"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="text-sm font-medium text-gray-900">
                Drop a .MD or .Markdown file here
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Or click to select one from your system.
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900">File</h2>
              <p className="mt-2 text-sm text-gray-600">
                {fileName || "No file selected"}
              </p>
              {fileText && (
                <p className="mt-1 text-xs text-gray-400">
                  {fileText.length.toLocaleString()} characters loaded
                </p>
              )}
            </div>

            {errorMessage && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </p>
            )}
          </div>

          <section className="flex min-h-0 flex-col rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <h2 className="text-sm font-semibold text-gray-900">
                C2PA Verification Result
              </h2>
              {verifyC2PATextMutation.isPending && (
                <span className="text-xs font-medium text-blue-600">
                  Verifying...
                </span>
              )}
            </div>

            <div className="min-h-96 flex-1 overflow-auto p-4 text-sm leading-6 text-gray-800">
              {/* Center Components please */}
              <div className="h-full rounded-lg border border-gray-200 bg-gray-50 p-4 flex items-center justify-center space-y-4">
                {verificationResult && <div>
                  <C2paManifest
                    manifest={verificationResult}
                    level={2}
                    onViewMore={undefined}
                    defaultViewMore={false}
                  />

                  <div className="mt-4">
                    <C2paButton onClick={()=>{

                      const title =   verificationResult?.manifestStore?.manifests[verificationResult.manifestStore?.activeManifest]?.title;
                      const id = verificationResult.manifestStore?.activeManifest;

                      if (!title || !id || !verificationResult || !fileText) return;
                      readerStore.insertAsset({
                        id,
                        title,
                        manifest: verificationResult,
                        markdown: fileText
                      })
                    }} >Add to Library</C2paButton>
                  </div>

                </div>}
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
