"use client";
import ReactMarkdown from "react-markdown";
import { removeMarkdownComments } from "~/helper/removeMarkDownComments";
import { api } from "~/trpc/react";

export default function Home() {
  const createC2PATextMutation = api.createText.createC2PAText.useMutation();

  return (
    <div className="flex flex-col space-y-4 p-4">
      <button
        onClick={() => {
          createC2PATextMutation.mutate({
            title: "Hello World",
            text: "Hello World",
          });
        }}
      >
        Click me
      </button>
      <div>
        {createC2PATextMutation.data && (
          <ReactMarkdown>
            {removeMarkdownComments(createC2PATextMutation.data)}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
