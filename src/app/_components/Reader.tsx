"use client";

interface ReaderProps {
  title: string;
  content: string;
}

export const Reader = ({ title, content }: ReaderProps) => {
  return (
    <div className="flex flex-col h-full bg-white p-8 overflow-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 border-b pb-4">
        {title}
      </h1>
      <div 
        className="prose prose-slate max-w-none text-gray-700 leading-relaxed whitespace-pre-line"
      >
        {content}
      </div>
    </div>
  );
};
