"use client";

import React from "react";

interface LandingProps {
  files: any[];
  isProcessing: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProcessFiles: () => void;
}

export default function Landing({
  files,
  isProcessing,
  onFileChange,
  onProcessFiles,
}: LandingProps) {
  return (
    <div className="flex flex-col items-center w-full min-h-full bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-900 overflow-y-auto scroll-smooth">
      {/* 🌟 Hero Section */}
      <section className="w-full max-w-5xl px-6 md:px-12 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
          Turn your documents into conversations
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8">
          Upload Word, Excel, PowerPoint or PDF files — then ask questions, get summaries, and extract insights effortlessly.
        </p>
      </section>

      {/* 📂 Upload Card */}
      <section className="w-full max-w-lg px-4 md:px-0 mb-20">
        <div className="group relative bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />
          <div className="relative z-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Upload your documents 📄
            </h2>
            <p className="text-gray-500 mb-6">
              Supported formats: <span className="font-medium">TXT, DOCX, XLSX, PPTX, PDF</span>
            </p>
            <label
              htmlFor="file-upload-2"
              className="cursor-pointer inline-block w-full px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition shadow-sm"
            >
              Choose Files
            </label>
            <input
              id="file-upload-2"
              type="file"
              multiple
              accept=".txt,.docx,.xlsx,.pptx,.pdf"
              className="hidden"
              onChange={onFileChange}
            />
            {files.length > 0 && (
              <button
                onClick={onProcessFiles}
                disabled={isProcessing}
                className={`mt-4 w-full px-5 py-2 rounded-lg font-medium shadow-sm text-white transition ${
                  isProcessing ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isProcessing ? "Processing…" : "Start"}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 🏆 Trust & Achievements Section */}
      {/* NOTE: explicitly using bg-gray-50 so it matches the surrounding page background exactly */}
      <section className="w-full bg-gray-50 py-10 mb-20 border-t border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 md:px-0 flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-16 text-center">
          {[
            {
              title: "#1 Document Chat AI",
              highlight: "Original",
              icon: "📄",
              color: "text-blue-600",
            },
            {
              title: "Questions answered every day",
              highlight: "1,000,000+",
              icon: "💬",
              color: "text-indigo-600",
            },
            {
              title: "Recognized by AI Tools of 2025",
              highlight: "Top 50",
              icon: "🚀",
              color: "text-pink-600",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-gray-800 transition-transform transform hover:scale-105"
            >
              <span className="text-3xl mb-2">{stat.icon}</span>
              <p className="text-sm sm:text-base text-gray-500 mb-1">{stat.title}</p>
              <h3 className={`text-lg sm:text-xl font-semibold ${stat.color}`}>{stat.highlight}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* ⚙️ Features Section */}
      <section className="w-full px-6 md:px-12 mb-24">
        <h2 className="text-3xl font-bold text-center mb-10">Powerful Features for Smarter Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "💬",
              title: "Chat with your Files",
              desc: "Ask questions about your documents and get instant, AI-powered answers.",
            },
            {
              icon: "⚡",
              title: "Smart Summaries",
              desc: "Generate concise summaries and extract insights in seconds.",
            },
            {
              icon: "🔍",
              title: "Advanced Understanding",
              desc: "Explore tables, formulas, and data points — without reading the whole document.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-1"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-xl mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🎓 Target Audience Section */}
      <section className="w-full px-6 md:px-12 mb-24">
        <h2 className="text-3xl font-bold text-center mb-10">Designed for Everyone</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "For Students 🎓",
              desc: "Summarize research papers, extract key points from textbooks, and prepare notes faster than ever.",
              colorClass: "bg-gradient-to-br from-blue-50 to-white",
            },
            {
              title: "For Researchers 🔬",
              desc: "Upload complex studies and get AI-driven insights, data extraction, and structured summaries instantly.",
              colorClass: "bg-gradient-to-br from-indigo-50 to-white",
            },
            {
              title: "For Professionals 💼",
              desc: "Analyze reports, presentations, and spreadsheets with AI-assisted summaries and intelligent context discovery.",
              colorClass: "bg-gradient-to-br from-teal-50 to-white",
            },
          ].map((audience, i) => (
            <div
              key={i}
              className={`${audience.colorClass} rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all`}
            >
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{audience.title}</h3>
              <p className="text-gray-600 leading-relaxed">{audience.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ❓ FAQ Section */}
      <section className="w-full px-6 md:px-12 mb-24">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {[
            {
              q: "Is my data secure?",
              a: "Yes — your files are processed securely and deleted automatically after analysis.",
            },
            {
              q: "What file types are supported?",
              a: "TXT, DOCX, XLSX, PPTX, and PDF are supported. More formats are coming soon.",
            },
            {
              q: "Do I need to register?",
              a: "No — you can start using DocQuery immediately without an account.",
            },
            {
              q: "How fast is the processing?",
              a: "Typically under 10 seconds for standard-size documents.",
            },
          ].map((faq, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <h4 className="font-semibold text-gray-800 mb-2">{faq.q}</h4>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🚀 Call to Action */}
      <section className="w-full max-w-xl px-6 md:px-0 text-center mb-32">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-gray-900">Ready to try DocQuery?</h2>
        <p className="text-gray-600 mb-6">Upload your documents for free and start chatting with them instantly.</p>
        <label
          htmlFor="file-upload-3"
          className="cursor-pointer px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-transform transform hover:-translate-y-1"
        >
          Upload Files
        </label>
        <input
          id="file-upload-3"
          type="file"
          multiple
          accept=".txt,.docx,.xlsx,.pptx,.pdf"
          className="hidden"
          onChange={onFileChange}
        />
      </section>

      {/* 🦶 Footer */}
      <footer className="w-full border-t border-gray-200 pt-10 pb-6 text-center text-sm text-gray-500">
        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-6 mb-4">
          <a href="#" className="hover:text-blue-600 transition-colors">About</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
        </div>
        <p>
          © {new Date().getFullYear()} <span className="font-semibold text-gray-800">DocQuery</span>. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
