"use client";
import { useState } from "react";

type FileStatus = "uploaded" | "processing" | "ready";
interface UploadedFile {
  file: File;
  status: FileStatus;
}

const ALLOWED_EXTENSIONS = ["txt", "docx", "xlsx", "pptx", "pdf"];
const BACKEND_URL = "http://127.0.0.1:8000";

export default function Home() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [responses, setResponses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [allFilesReady, setAllFilesReady] = useState(false);

  // 🧹 Reset query engine completely (chat + state)
  const resetQueryEngine = () => {
    setResponses([]);
    setQuery("");
    setAllFilesReady(false);
    setError(null);
  };

  // 📂 Handle new file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    const validFiles: UploadedFile[] = [];
    const invalidFiles: string[] = [];

    selectedFiles.forEach((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext && ALLOWED_EXTENSIONS.includes(ext)) {
        validFiles.push({ file, status: "uploaded" });
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      setError(
        `Unsupported file types: ${invalidFiles.join(", ")}. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`
      );
      return;
    }

    // ✅ Add new files and reset query engine
    setFiles((prev) => [...prev, ...validFiles]);
    resetQueryEngine();

    e.target.value = "";
  };

  // 🗑️ Remove a file and reset query engine
  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    resetQueryEngine();
  };

  // ⚙️ Upload files to backend for processing
  const handleProcessFiles = async () => {
    if (files.length === 0) return;

    setFiles((prev) => prev.map((f) => ({ ...f, status: "processing" })));
    setAllFilesReady(false);

    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f.file));

      const res = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      setFiles((prev) => prev.map((f) => ({ ...f, status: "ready" })));
      setAllFilesReady(true);
    } catch (err) {
      console.error(err);
      setError("Error uploading files. Ensure backend is running.");
      setFiles((prev) => prev.map((f) => ({ ...f, status: "uploaded" })));
    }
  };

  // 💬 Ask the backend a question
  const handleAskQuery = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("question", query);

      const res = await fetch(`${BACKEND_URL}/query`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        setResponses((prev) => [...prev, `${query}||⚠️ ${data.error}`]);
      } else {
        setResponses((prev) => [...prev, `${query}||${data.answer}`]);
      }
    } catch {
      setResponses((prev) => [
        ...prev,
        `${query}||⚠️ Backend not reachable.`,
      ]);
    } finally {
      setQuery("");
      setLoading(false);
    }
  };

  const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAskQuery();
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-white text-gray-800 px-4 pb-24 pt-8">
      <section className="text-center max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">DocQuery</h1>
        <p className="text-gray-500 mb-8">
          Upload multiple documents and ask questions.  
          The AI will answer only based on your uploaded files.
        </p>

        {/* Upload Button */}
        <label
          htmlFor="file-upload"
          className="cursor-pointer inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition mb-6"
        >
          Upload Documents
        </label>
        <input
          id="file-upload"
          type="file"
          multiple
          accept=".txt,.docx,.xlsx,.pptx,.pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        {error && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-6 max-w-md mx-auto">
            {error}
          </div>
        )}

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 justify-center mb-10">
          <Step number="1" title="Upload" desc="Add your documents (TXT, DOCX, XLSX, PPTX, PDF)" />
          <Step number="2" title="Process" desc="AI extracts and indexes your documents" />
          <Step number="3" title="Ask" desc="Ask questions and get precise answers" />
        </div>

        {/* Uploaded Files List */}
        {files.length > 0 && (
          <div className="w-full max-w-md mx-auto text-left">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">
              Uploaded Documents
            </h3>
            <ul className="space-y-2 mb-6">
              {files.map((f, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="truncate text-gray-700">{f.file.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        f.status === "uploaded"
                          ? "bg-gray-200 text-gray-700"
                          : f.status === "processing"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {f.status.charAt(0).toUpperCase() + f.status.slice(1)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFile(i)}
                    className="ml-3 text-gray-400 hover:text-red-500 transition"
                    title="Remove document"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>

            {!allFilesReady ? (
              <div className="text-center">
                <button
                  onClick={handleProcessFiles}
                  className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
                >
                  Start Processing
                </button>
              </div>
            ) : (
              <div className="text-center text-green-600 font-medium">
                ✅ All documents processed!
              </div>
            )}
          </div>
        )}

        {/* Query Engine */}
        {allFilesReady && (
          <div className="mt-10 w-full max-w-xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Query Your Documents
            </h3>

            <div className="space-y-4 bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-[400px] overflow-y-auto shadow-sm">
              {responses.map((res, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
                >
                  <p className="text-sm font-semibold text-gray-900 mb-2 whitespace-pre-line">
                    Q{i + 1}: {res.split("||")[0]}
                  </p>
                  <div className="flex items-start gap-2">
                    <span className="text-xl">🤖</span>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {res.split("||")[1]}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex items-center border border-gray-300 rounded-xl shadow-sm p-2 mt-4">
              <input
                type="text"
                placeholder="Ask a question about your documents..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleEnterPress}
                className="flex-grow px-3 py-2 rounded-lg focus:outline-none text-gray-700"
              />
              <button
                onClick={handleAskQuery}
                disabled={loading}
                className={`ml-2 px-4 py-2 rounded-lg ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white font-medium transition`}
              >
                {loading ? "Thinking..." : "Ask"}
              </button>
            </div>
          </div>
        )}
      </section>

      <footer className="fixed bottom-0 left-0 w-full border-t border-gray-200 bg-white py-3 text-center text-sm text-gray-500 backdrop-blur-md bg-opacity-90">
        © {new Date().getFullYear()} DocQuery — Intelligent Document Analysis
      </footer>
    </main>
  );
}

function Step({
  number,
  title,
  desc,
}: {
  number: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-3 font-semibold text-blue-700">
        {number}
      </div>
      <h4 className="font-semibold text-gray-800 mb-1">{title}</h4>
      <p className="text-xs text-gray-500 text-center">{desc}</p>
    </div>
  );
}
