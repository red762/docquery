"use client";

import { Lightbulb, FileText, Sparkles, Brain, KeyRound, HelpCircle, Trash2 } from "lucide-react";

interface UploadedFile {
  file: File;
  status: "uploaded" | "processing" | "ready";
}

interface SidebarProps {
  files?: UploadedFile[];
  onQuickAction?: (prompt: string) => void;
  onClearContext?: () => void;
}

export default function Sidebar({ files = [], onQuickAction, onClearContext }: SidebarProps) {
  return (
    <aside className="h-full w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col p-5 overflow-y-auto">
      {/* Brand / Header */}
      <div className="mb-6">

        <p className="text-xs text-gray-500 mt-1 leading-snug">
          Your intelligent assistant for reading, summarizing, and analyzing documents.
        </p>
      </div>


      {/* Quick Actions */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">⚙️ Quick Actions</h3>
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => onQuickAction?.("Summarize all the documents")}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-md transition"
          >
            <Brain className="w-4 h-4" />
            Summarize All
          </button>

          <button
            onClick={() => onQuickAction?.("Extract the key points and main ideas from the document")}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-md transition"
          >
            <KeyRound className="w-4 h-4" />
            Extract Key Points
          </button>

          <button
            onClick={() => onQuickAction?.("Generate 5 comprehension questions about this document")}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-md transition"
          >
            <HelpCircle className="w-4 h-4" />
            Generate Questions
          </button>

          <button
            onClick={() => onClearContext?.()}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-md transition"
          >
            <Trash2 className="w-4 h-4" />
            Clear Context
          </button>
        </div>
      </div>

      {/* Uploaded Files */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">📂 Uploaded Files</h3>
        {files.length > 0 ? (
          <ul className="space-y-1 text-sm text-gray-700">
            {files.map((f, i) => (
              <li
                key={i}
                className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-2 py-1 rounded-md truncate"
              >
                <FileText className="w-4 h-4 text-gray-500 shrink-0" />
                <span className="truncate">{f.file.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-gray-500 italic">No files uploaded yet</p>
        )}
      </div>

      {/* Tip */}
      <div className="mt-auto bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-800 flex items-start gap-2">
        <Lightbulb className="w-5 h-5 mt-0.5 shrink-0 text-blue-500" />
        <p className="leading-snug">
          Tip: Try asking <span className="font-medium">“Explain the main argument in simpler terms.”</span>
        </p>
      </div>
    </aside>
  );
}
