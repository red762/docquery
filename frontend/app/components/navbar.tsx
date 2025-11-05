"use client";

import { useState } from "react";
import { ChevronDown, FileText, X, Upload, CheckCircle } from "lucide-react";

interface UploadedFile {
  file: File;
  status: "uploaded" | "processing" | "ready";
}

interface NavbarProps {
  files: UploadedFile[];
  isProcessing: boolean;
  allFilesReady: boolean;
  error: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  onProcessFiles: () => void;
}

export default function Navbar({
  files,
  isProcessing,
  allFilesReady,
  error,
  onFileChange,
  onRemoveFile,
  onProcessFiles,
}: NavbarProps) {
  const [showMobileFiles, setShowMobileFiles] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <nav className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3">
        {/* ✅ Left: Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-blue-600 text-white font-bold text-sm">
            DQ
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">
            DocQuery
          </h1>
        </div>

        {/* ✅ Center: Uploaded Files */}
        <div className="flex-1 flex justify-center items-center">
          {/* Desktop file list */}
          <div className="hidden md:flex overflow-x-auto space-x-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {files.length > 0 ? (
              files.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-md text-xs sm:text-sm text-gray-700 whitespace-nowrap"
                >
                  <FileText size={14} className="text-blue-600" />
                  <span className="truncate max-w-[120px] sm:max-w-[180px]">
                    {f.file.name}
                  </span>
                  <button
                    onClick={() => onRemoveFile(i)}
                    className="text-gray-400 hover:text-red-500 text-xs"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm italic whitespace-nowrap">
                No documents uploaded
              </p>
            )}
          </div>

          {/* Mobile dropdown file list */}
          <div className="md:hidden relative">
            {files.length > 0 ? (
              <button
                onClick={() => setShowMobileFiles(!showMobileFiles)}
                className="flex items-center gap-1 text-sm text-gray-700 font-medium border px-2 py-1 rounded-md hover:bg-gray-50"
              >
                {files.length} file{files.length > 1 ? "s" : ""}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${
                    showMobileFiles ? "rotate-180" : ""
                  }`}
                />
              </button>
            ) : (
              <p className="text-gray-400 text-sm italic">No files</p>
            )}

            {showMobileFiles && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 shadow-lg rounded-md w-56 max-h-64 overflow-y-auto z-50">
                {files.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3 py-2 text-sm border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText size={14} className="text-blue-600" />
                      <span className="truncate">{f.file.name}</span>
                    </div>
                    <button
                      onClick={() => onRemoveFile(i)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ✅ Right: Upload Button */}
        <div className="flex items-center ml-3">
          <label
            htmlFor="file-upload"
            className={`cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-white transition 
              ${
                allFilesReady
                  ? "bg-green-600 hover:bg-green-700"
                  : isProcessing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {allFilesReady ? (
              <>
                <CheckCircle size={16} className="text-white" />
                Ready
              </>
            ) : (
              <>
                <Upload size={16} />
                {isProcessing ? "Processing..." : "Upload"}
              </>
            )}
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            accept=".txt,.docx,.xlsx,.pptx,.pdf"
            className="hidden"
            onChange={onFileChange}
            disabled={isProcessing}
          />
        </div>
      </nav>

      {/* ✅ Smooth fade error message */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          error ? "opacity-100 max-h-20 py-2" : "opacity-0 max-h-0 py-0"
        } bg-red-50 text-red-600 border-t border-red-200 text-sm text-center overflow-hidden`}
      >
        {error}
      </div>
    </header>
  );
}
