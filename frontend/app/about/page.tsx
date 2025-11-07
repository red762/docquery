

import Link from "next/link";


export const metadata = {
  title: "About – DocQuery",
  description:
    "Learn more about DocQuery, your intelligent assistant for document analysis and AI-powered insights.",
};
export default function AboutPage() {
  return (
    
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white text-gray-800">
      
      {/* ===== NAVBAR ===== */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <nav className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
          >
            DocQuery
          </Link>
          <div className="space-x-6 text-sm font-medium">

            <Link
              href="/about"
              className="text-blue-600 font-semibold transition-colors"
            >
              About
            </Link>
            <Link
              href="/terms"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy-policy"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Privacy
            </Link>
          </div>
        </nav>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-grow max-w-3xl mx-auto px-6 py-24 sm:py-28 text-gray-800 leading-relaxed">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-900 text-center">
          About DocQuery
        </h1>

        <section className="space-y-6 text-[15px] sm:text-base text-justify text-gray-700">
          <p>
            <strong className="text-blue-600">DocQuery</strong> is an
            AI-powered document analysis platform that helps you interact with
            your files intelligently. Upload any document —{" "}
            <em>PDF, DOCX, XLSX, PPTX, or TXT</em> — and ask natural-language
            questions, extract data, or generate summaries in seconds.
          </p>

          <p>
            Our goal is to make document understanding effortless. Whether
            you're a student, researcher, or professional, DocQuery saves you
            time by combining cutting-edge AI models with a simple, intuitive
            interface.
          </p>

          <p>
            The platform was built with{" "}
            <span className="font-medium">privacy</span>,{" "}
            <span className="font-medium">accuracy</span>, and{" "}
            <span className="font-medium">speed</span> in mind — so your
            documents are processed securely, and your insights arrive
            instantly.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">
            Our Mission
          </h2>
          <p className="text-gray-700 text-justify">
            To empower users worldwide with intelligent tools that make reading,
            learning, and research faster, smarter, and more effective.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">
            Contact Us
          </h2>
          <p className="text-gray-700 text-justify">
            For questions, feedback, or partnership inquiries, reach us at{" "}
            <a
              href="mailto:support@docquery.online"
              className="text-blue-600 hover:underline font-medium"
            >
              support@docquery.online
            </a>
            .
          </p>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-gray-200 bg-gray-50 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} DocQuery Online — All rights reserved.
      </footer>
    </div>
  );
}
