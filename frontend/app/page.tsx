"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";
import { Menu } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";

type FileStatus = "uploaded" | "processing" | "ready";
interface UploadedFile {
  file: File;
  status: FileStatus;
}

const ALLOWED_EXTENSIONS = ["txt", "docx", "xlsx", "pptx", "pdf"];
const BACKEND_URL = "https://docquery-oixr.onrender.com";

export default function Page() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [responses, setResponses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [allFilesReady, setAllFilesReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUploadUI, setShowUploadUI] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [responses]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    const validFiles: UploadedFile[] = [];
    const invalidFiles: string[] = [];

    selectedFiles.forEach((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext && ALLOWED_EXTENSIONS.includes(ext))
        validFiles.push({ file, status: "uploaded" });
      else invalidFiles.push(file.name);
    });

    if (invalidFiles.length > 0) {
      setError(
        `Unsupported file types: ${invalidFiles.join(", ")}. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`
      );
      setTimeout(() => setError(null), 2000);
      return;
    }

    setFiles((prev) => [...prev, ...validFiles]);
    setResponses([]);
    setAllFilesReady(false);
    e.target.value = "";
  };

  const handleRemoveFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    if (updated.length === 0) {
      setAllFilesReady(false);
      setShowUploadUI(true);
    }
  };

  const handleProcessFiles = async () => {
    if (files.length === 0) return;
    setError(null);
    setIsProcessing(true);
    setShowUploadUI(false);
    setAllFilesReady(false);

    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f.file));
      const res = await fetch(`${BACKEND_URL}/upload`, { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      setFiles((prev) => prev.map((f) => ({ ...f, status: "ready" })));
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAllFilesReady(true);
    } catch (err) {
      console.error(err);
      setError("Error uploading files. Ensure backend is running.");
      setTimeout(() => setError(null), 1500);
      setShowUploadUI(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAskQuery = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("question", query);
      const res = await fetch(`${BACKEND_URL}/query`, { method: "POST", body: formData });
      const data = await res.json();
      setResponses((prev) => [...prev, `${query}||${data.answer ?? "⚠️ Error"}`]);
    } catch {
      setResponses((prev) => [...prev, `${query}||⚠️ Backend not reachable.`]);
    } finally {
      setQuery("");
      setLoading(false);
    }
  };

  const handleAskQueryPrompt = async (customPrompt: string) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("question", customPrompt);
      const res = await fetch(`${BACKEND_URL}/query`, { method: "POST", body: formData });
      const data = await res.json();
      setResponses((prev) => [...prev, `${customPrompt}||${data.answer ?? "⚠️ Error"}`]);
    } catch {
      setResponses((prev) => [...prev, `${customPrompt}||⚠️ Backend not reachable.`]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-screen bg-gray-50 text-gray-900 overflow-hidden">
      {/* ✅ Navbar on top (full width) */}
      <Navbar
        files={files}
        isProcessing={isProcessing}
        allFilesReady={allFilesReady}
        error={error}
        onFileChange={handleFileChange}
        onRemoveFile={handleRemoveFile}
        onProcessFiles={handleProcessFiles}
      />

      {/* ✅ Main content area: Sidebar + Chat */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:flex w-64 flex-shrink-0 border-r border-gray-200 bg-white flex-col">
          <Sidebar
            files={files}
            onQuickAction={(prompt) => {
              if (!allFilesReady) return;
              setQuery(prompt);
              handleAskQueryPrompt(prompt);
            }}
            onClearContext={() => {
              setResponses([]);
              setQuery("");
              setError(null);
            }}
          />
        </aside>

        {/* Sidebar (mobile overlay) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-50 flex"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true"></div>
            <div
              className="relative z-10 w-64 bg-white border-r border-gray-200 shadow-lg flex flex-col animate-slide-in"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar
                files={files}
                onQuickAction={(prompt) => {
                  if (!allFilesReady) return;
                  setQuery(prompt);
                  handleAskQueryPrompt(prompt);
                  setSidebarOpen(false);
                }}
                onClearContext={() => {
                  setResponses([]);
                  setQuery("");
                  setError(null);
                }}
              />
            </div>
          </div>
        )}

        {/* Chat Area */}
        <section className="relative flex-1 flex flex-col min-h-0 bg-gray-50 p-4 sm:p-6 md:p-8">
          {/* Upload Section */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${
              showUploadUI && !isProcessing && !allFilesReady
                ? "opacity-100 scale-100 z-10"
                : "opacity-0 scale-95 pointer-events-none z-0"
            }`}
          >
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 sm:p-10 bg-white shadow-sm w-full max-w-md text-center">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                Upload your documents 📄
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Supported formats: txt, docx, xlsx, pptx, pdf
              </p>
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-block w-full px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition shadow-sm"
              >
                Select Files
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                accept=".txt,.docx,.xlsx,.pptx,.pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              {files.length > 0 && (
                <button
                  onClick={handleProcessFiles}
                  disabled={isProcessing}
                  className="mt-4 w-full px-5 py-2 rounded-lg font-medium shadow-sm bg-green-600 hover:bg-green-700 text-white transition"
                >
                  Start
                </button>
              )}
            </div>
          </div>

          {/* Loader */}
          {isProcessing && !allFilesReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-20">
              <div className="w-10 sm:w-12 h-10 sm:h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-700 font-medium text-sm sm:text-base">
                Processing your documents...
              </p>
            </div>
          )}

          {/* Scrollable Chat Section */}
          <div
            className={`flex flex-col flex-1 min-h-0 transition-all duration-700 ease-in-out ${
              allFilesReady && !isProcessing
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5 pointer-events-none"
            }`}
          >
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {responses.map((res, i) => {
                const [question, answer] = res.split("||");
                return (
                  <div key={i} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <p className="text-sm sm:text-base font-semibold text-black mb-2">
                      Q{i + 1}: {question}
                    </p>
                    <div className="text-sm sm:text-base text-black leading-relaxed prose max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex, rehypeRaw]}
                      >
                        {answer}
                      </ReactMarkdown>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="mt-4 flex-shrink-0 flex items-center border border-gray-300 rounded-lg bg-white p-2 sm:p-3 shadow-sm">
              <input
                type="text"
                placeholder={loading ? "Processing..." : "Ask a question..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAskQuery()}
                disabled={!allFilesReady || loading}
                className="flex-grow px-3 py-2 text-sm sm:text-base focus:outline-none disabled:opacity-50 text-black placeholder-gray-500"
              />
              <button
                onClick={handleAskQuery}
                disabled={loading || !allFilesReady}
                className={`ml-2 px-4 py-2 text-sm sm:text-base rounded-md ${
                  loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                } text-white transition font-medium`}
              >
                {loading ? "Thinking..." : "Send"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
