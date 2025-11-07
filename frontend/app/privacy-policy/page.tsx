"use client";

import Link from "next/link";



export default function PrivacyPolicyPage() {
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
              className="text-gray-700 hover:text-blue-600 transition-colors"
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
              className="text-blue-600 font-semibold transition-colors"
            >
              Privacy
            </Link>
          </div>
        </nav>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-grow max-w-3xl mx-auto px-6 py-24 sm:py-28 leading-relaxed text-gray-800">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-900 text-center">
          Privacy Policy
        </h1>
        <p className="text-gray-600 text-center mb-12 text-sm">
          Your privacy matters to us — last updated: {new Date().getFullYear()}
        </p>

        <section className="space-y-10 text-[15px] sm:text-base text-justify">
          <p>
            At <strong>DocQuery</strong>, we value your privacy. This Privacy
            Policy outlines how we collect, use, and protect your personal
            information when you use our platform.
          </p>

          <h2 className="text-2xl font-semibold mb-3">
            1. Information We Collect
          </h2>
          <p>
            We collect only the information necessary to provide and improve our
            services, including:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Uploaded documents for AI processing (not stored permanently).</li>
            <li>Basic usage data to improve performance and reliability.</li>
            <li>Contact details if you reach out to our support team.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-3">
            2. How We Use Information
          </h2>
          <p>
            Your data is used solely to provide document analysis functionality
            and to enhance platform performance. We never sell, rent, or share
            your data with third parties for marketing purposes.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-3">3. Data Security</h2>
          <p>
            All data transfers are encrypted via HTTPS. Uploaded documents are
            processed in isolated, temporary sessions and deleted automatically
            after analysis to ensure complete confidentiality.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-3">4. Cookies</h2>
          <p>
            We use minimal cookies to improve your experience and enable certain
            website features. You can disable cookies at any time in your
            browser settings without affecting most site functionality.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-3">5. Google AdSense</h2>
          <p>
            Our platform may display ads via Google AdSense. Google uses cookies
            to serve relevant ads based on your browsing history. You can opt
            out of personalized advertising at{" "}
            <a
              href="https://adssettings.google.com/"
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              Google Ad Settings
            </a>
            .
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-3">
            6. User Control and Data Rights
          </h2>
          <p>
            You have the right to request deletion of your data, inquire about
            stored information, or withdraw consent for data processing at any
            time by contacting us.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-3">7. Contact Us</h2>
          <p>
            For any questions, privacy concerns, or data access requests, please
            contact our support team at{" "}
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
