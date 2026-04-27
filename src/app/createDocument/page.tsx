"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import { api } from "~/trpc/react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

export default function CreateDocument() {
  const [editorText, setEditorText] = useState(`# New document

Write Markdown in the editor, then switch to preview.

- Monaco Editor handles the source text
- ReactMarkdown renders the Markdown output
`);
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);
  const [title, setTitle] = useState("New document");
  const [authors, setAuthors] = useState([""]);

  const createC2PATextMutation = api.createText.createC2PAText.useMutation();

  const cleanAuthors = authors
    .map((author) => author.trim())
    .filter((author) => author.length > 0);

  const downloadMarkdownFile = (fileTitle: string, markdown: string) => {
    const safeTitle =
      fileTitle
        .trim()
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
        .replace(/\s+/g, " ") || "document";
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${safeTitle}.MD`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleAuthorDocument = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const signedMarkdown = await createC2PATextMutation.mutateAsync({
      title: title.trim(),
      text: editorText,
      authors: cleanAuthors,
    });

    downloadMarkdownFile(title, signedMarkdown);
    setIsAuthorModalOpen(false);
  };

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-gray-100">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Create Document
          </h1>
          <p className="text-sm text-gray-500">
            Draft Markdown source and preview the rendered document.
          </p>
        </div>

        <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-gray-700">
          <span>Markdown Preview</span>
          <button
            type="button"
            role="switch"
            aria-checked={showMarkdownPreview}
            onClick={() => setShowMarkdownPreview((current) => !current)}
            className={`relative h-7 w-12 rounded-full transition-colors ${
              showMarkdownPreview ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                showMarkdownPreview ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </label>

        <button
          type="button"
          onClick={() => setIsAuthorModalOpen(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
        >
          Author Document
        </button>
      </header>

      <section className="flex min-h-0 flex-1 p-6">
        {showMarkdownPreview ? (
          <article className="h-full w-full overflow-auto rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="mb-4 border-b border-gray-200 pb-3 text-3xl font-bold text-gray-950">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="mt-8 mb-3 text-2xl font-semibold text-gray-900">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mt-6 mb-2 text-xl font-semibold text-gray-900">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="mb-4 leading-7 text-gray-700">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-4 list-decimal space-y-2 pl-6 text-gray-700">
                    {children}
                  </ol>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="mb-4 border-l-4 border-blue-300 bg-blue-50 px-4 py-2 text-gray-700">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-900">
                    {children}
                  </code>
                ),
              }}
            >
              {editorText}
            </ReactMarkdown>
          </article>
        ) : (
          <div className="h-full w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <MonacoEditor
              height="100%"
              defaultLanguage="markdown"
              language="markdown"
              theme="vs"
              value={editorText}
              onChange={(value) => setEditorText(value ?? "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                padding: { top: 16, bottom: 16 },
                scrollBeyondLastLine: false,
                wordWrap: "on",
              }}
            />
          </div>
        )}
      </section>

      {isAuthorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/40 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="author-document-title"
            className="w-full max-w-lg rounded-lg border border-gray-200 bg-white shadow-xl"
          >
            <form onSubmit={handleAuthorDocument} className="flex flex-col">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2
                  id="author-document-title"
                  className="text-lg font-semibold text-gray-950"
                >
                  Author Document
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Add document metadata before creating the signed Markdown
                  file.
                </p>
              </div>

              <div className="space-y-5 px-6 py-5">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">
                    Title
                  </span>
                  <input
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    required
                    className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 transition-colors outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Authors
                    </span>
                    <button
                      type="button"
                      onClick={() => setAuthors((current) => [...current, ""])}
                      className="rounded-md border border-blue-200 px-3 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50"
                    >
                      Add Author
                    </button>
                  </div>

                  <div className="space-y-3">
                    {authors.map((author, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={author}
                          onChange={(event) => {
                            const nextAuthors = [...authors];
                            nextAuthors[index] = event.target.value;
                            setAuthors(nextAuthors);
                          }}
                          placeholder={`Author ${index + 1}`}
                          className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 transition-colors outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setAuthors((current) =>
                              current.length === 1
                                ? [""]
                                : current.filter(
                                    (_, authorIndex) => authorIndex !== index,
                                  ),
                            )
                          }
                          className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {createC2PATextMutation.error && (
                  <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {createC2PATextMutation.error.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
                <button
                  type="button"
                  onClick={() => setIsAuthorModalOpen(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    createC2PATextMutation.isPending ||
                    title.trim().length === 0 ||
                    editorText.trim().length === 0
                  }
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                >
                  {createC2PATextMutation.isPending
                    ? "Authoring..."
                    : "Author and Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
