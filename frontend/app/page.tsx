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
import "katex/dist/katex.min.css"; // ✅ KaTeX CSS

type FileStatus = "uploaded" | "processing" | "ready";
interface UploadedFile {
  file: File;
  status: FileStatus;
}

const ALLOWED_EXTENSIONS = ["txt", "docx", "xlsx", "pptx", "pdf"];
const BACKEND_URL = "https://docquery-production-2939.up.railway.app";

// ✅ Utility: convert (\frac) / [\frac] to $...$ / $$...$$ for KaTeX
function formatMath(answer: string) {
  if (!answer) return "";
  return answer
    .replace(/\(\s*\\([a-zA-Z]+)/g, "$\\$1")
    .replace(/\)/g, "$")
    .replace(/\[\s*\\([a-zA-Z]+)/g, "$$\\$1")
    .replace(/\]/g, "$$")
    .replace(/\s{2,}/g, " ");
}

// ✅ Fix backend escaping
function fixMathSyntax(str: string) {
  if (!str) return "";
  return str
    .replaceAll("\\\\", "\\")
    .replaceAll("\\(", "$")
    .replaceAll("\\)", "$")
    .replaceAll("\\[", "$$")
    .replaceAll("\\]", "$$");
}



export default function Page() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [responses, setResponses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [allFilesReady, setAllFilesReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUploadUI, setShowUploadUI] = useState(true);
  const [fadeState, setFadeState] = useState<"fade-in" | "fade-out" | "visible">("visible");
  const [sessionId, setSessionId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [responses]);

  useEffect(() => {
    const initSession = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/session/start`, { method: "POST" });
        const data = await res.json();
        if (data.session_id) setSessionId(data.session_id);
      } catch {
        setError("Failed to start session with backend.");
      }
    };
    initSession();

    return () => {
      if (sessionId) {
        fetch(`${BACKEND_URL}/session/end?session_id=${sessionId}`, { method: "DELETE" });
      }
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    const validFiles: UploadedFile[] = [];
    const invalidFiles: string[] = [];

    selectedFiles.forEach((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext && ALLOWED_EXTENSIONS.includes(ext)) validFiles.push({ file, status: "uploaded" });
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
    if (files.length === 0 || !sessionId) return;
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
      const res = await fetch(`${BACKEND_URL}/upload?session_id=${sessionId}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      setFiles((prev) => prev.map((f) => ({ ...f, status: "ready" })));
      await new Promise((r) => setTimeout(r, 1000));
      setAllFilesReady(true);
    } catch {
      setError("Error uploading files. Ensure backend is running.");
      setShowUploadUI(true);
      setTimeout(() => setError(null), 1500);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAskQuery = async () => {
    if (!query.trim() || !sessionId) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("question", query);
      const res = await fetch(`${BACKEND_URL}/query?session_id=${sessionId}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResponses((prev) => [...prev, `${query}||${data.answer ?? "⚠️ Error"}`]);
    } catch {
      setResponses((prev) => [...prev, `${query}||⚠️ Backend not reachable.`]);
    } finally {
      setQuery("");
      setLoading(false);
    }
  };

  const handleAskQueryPrompt = async (prompt: string) => {
    if (!sessionId) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("question", prompt);
      const res = await fetch(`${BACKEND_URL}/query?session_id=${sessionId}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResponses((prev) => [...prev, `${prompt}||${data.answer ?? "⚠️ Error"}`]);
    } catch {
      setResponses((prev) => [...prev, `${prompt}||⚠️ Backend not reachable.`]);
    } finally {
      setLoading(false);
    }
  };

  const fadeClasses = {
    "fade-in": "opacity-100 transition-opacity duration-[800ms] ease-in-out",
    "fade-out": "opacity-0 transition-opacity duration-[800ms] ease-in-out",
    visible: "opacity-100",
  };

  return (
    <main className="flex flex-col h-screen bg-gray-50 text-gray-900 overflow-hidden">
      
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

        <section
          className={`relative flex-1 flex flex-col min-h-0 bg-gray-50 overflow-y-auto scroll-smooth p-4 sm:p-6 md:p-8 ${fadeClasses[fadeState]}`}
        >
          {showUploadUI && !isProcessing && !allFilesReady && (
            <Landing
              files={files}
              isProcessing={isProcessing}
              onFileChange={handleFileChange}
              onProcessFiles={handleProcessFiles}
            />
          )}

          {isProcessing && !allFilesReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-20">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-700 font-medium text-sm sm:text-base">
                Processing your documents...
              </p>
            </div>
          )}

          {allFilesReady && (
            <div className="flex flex-col flex-1">
              {/* Scrollable response list */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 scroll-smooth pb-28">
                {responses.map((res, i) => {
                  const [question, answer] = res.split("||");
                  return (
                    <div key={i} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <p className="font-semibold text-gray-900 mb-2">
                        Q{i + 1}: {question}
                      </p>
                      <div className="text-gray-800 leading-relaxed prose max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkMath]}
                          rehypePlugins={[[rehypeKatex, { strict: false }], rehypeRaw]}
                        >
                          {fixMathSyntax(answer)}
                        </ReactMarkdown>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* ✅ Centered Floating Input (inside scroll container) */}
              <div className="sticky bottom-4 flex justify-center z-50">
                <div className="flex items-center w-full max-w-3xl mx-auto border border-gray-300 rounded-2xl bg-white/80 backdrop-blur-md shadow-lg px-4 py-3">
                  <input
                    type="text"
                    placeholder={loading ? "Processing..." : "Ask a question..."}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAskQuery()}
                    disabled={!allFilesReady || loading}
                    className="flex-grow px-3 py-2 bg-transparent focus:outline-none disabled:opacity-50 text-black placeholder-gray-500"
                  />
                  <button
                    onClick={handleAskQuery}
                    disabled={loading || !allFilesReady}
                    className={`ml-3 px-5 py-2 rounded-xl ${
                      loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                    } text-white font-medium transition-colors shadow-sm`}
                  >
                    {loading ? "Thinking..." : "Send"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
