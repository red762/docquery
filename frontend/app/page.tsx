"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";
import Landing from "./components/Landing";
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
  const [fadeState, setFadeState] = useState<"fade-in" | "fade-out" | "visible">("visible");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [responses]);

  // ✅ Handle file selection
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

  // ✅ Remove file — only fade out when last file is deleted
const handleRemoveFile = (index: number) => {
  const updated = files.filter((_, i) => i !== index);
  setFiles(updated);

  // 🔹 Only trigger fade-out if all files were ready
    if (!showUploadUI) {
    setFadeState("fade-out");
    setTimeout(() => {
      setAllFilesReady(false);
      setShowUploadUI(true);
      setFadeState("fade-in");
      setTimeout(() => setFadeState("visible"), 800);
    }, 600);
  } 
  if (allFilesReady && updated.length === 0) {
    setFadeState("fade-out");
    setTimeout(() => {
      setAllFilesReady(false);
      setShowUploadUI(true);
      setFadeState("fade-in");
      setTimeout(() => setFadeState("visible"), 800);
    }, 600);
  } 
  // 🔹 Otherwise just update state quietly
  else if (updated.length === 0) {
    setAllFilesReady(false);
    setShowUploadUI(true);
  }
};

  // ✅ File upload logic
  const handleProcessFiles = async () => {
    if (files.length === 0) return;
    setError(null);
    setIsProcessing(true);

    setFadeState("fade-out");
    setTimeout(() => {
      setShowUploadUI(false);
      setFadeState("fade-in");
    }, 300);

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

  // ✅ Chat query logic
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

  // ✅ Sidebar quick prompts
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

  // ✅ Fade animation classes
  const fadeClasses = {
    "fade-in": "opacity-100 transition-opacity duration-[800ms] ease-in-out",
    "fade-out": "opacity-0 transition-opacity duration-[800ms] ease-in-out",
    visible: "opacity-100",
  };

  return (
    <main className="flex flex-col h-screen bg-gray-50 text-gray-900 overflow-hidden">
      {/* Navbar */}
      <Navbar
        files={files}
        isProcessing={isProcessing}
        allFilesReady={allFilesReady}
        error={error}
        onFileChange={handleFileChange}
        onRemoveFile={handleRemoveFile}
        onProcessFiles={handleProcessFiles}
      />

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
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

        {/* Main content area */}
        <section
          className={`relative flex-1 flex flex-col min-h-0 bg-gray-50 overflow-y-auto scroll-smooth p-4 sm:p-6 md:p-8 ${fadeClasses[fadeState]}`}
        >
          {/* 🧭 Landing Page */}
          {showUploadUI && !isProcessing && !allFilesReady && (
            <Landing
              files={files}
              isProcessing={isProcessing}
              onFileChange={handleFileChange}
              onProcessFiles={handleProcessFiles}
            />
          )}

          {/* 🌀 Processing Loader */}
          {isProcessing && !allFilesReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-20 transition-opacity duration-500 ease-in-out">
              <div className="w-10 sm:w-12 h-10 sm:h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-700 font-medium text-sm sm:text-base">
                Processing your documents...
              </p>
            </div>
          )}

          {/* 💬 Chat Section */}
          {allFilesReady && (
            <div className="flex flex-col flex-1 transition-opacity duration-[800ms] ease-in-out">
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {responses.map((res, i) => {
                  const [question, answer] = res.split("||");
                  return (
                    <div
                      key={i}
                      className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm transition-transform duration-500 hover:scale-[1.01]"
                    >
                      <p className="font-semibold text-gray-900 mb-2">
                        Q{i + 1}: {question}
                      </p>
                      <div className="text-gray-800 leading-relaxed">
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
              <div className="mt-4 flex-shrink-0 flex items-center border border-gray-300 rounded-lg bg-white p-2 shadow-sm transition-all duration-500 ease-in-out">
                <input
                  type="text"
                  placeholder={loading ? "Processing..." : "Ask a question..."}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAskQuery()}
                  disabled={!allFilesReady || loading}
                  className="flex-grow px-3 py-2 focus:outline-none disabled:opacity-50 text-black placeholder-gray-500"
                />
                <button
                  onClick={handleAskQuery}
                  disabled={loading || !allFilesReady}
                  className={`ml-2 px-4 py-2 rounded-md ${
                    loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                  } text-white transition-colors duration-300 font-medium`}
                >
                  {loading ? "Thinking..." : "Send"}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
