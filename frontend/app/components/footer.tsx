import Link from "next/link";

export default function Footer() {
  return (
<footer className="w-full border-t border-gray-200 text-sm text-gray-600 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 sm:px-6 md:px-8 bg-white text-center sm:text-left mt-16">

    {/* ✅ Left (or centered on mobile) */}
      <div className="mb-2 sm:mb-0">
        <p>
          © 2025{" "}
          <Link
            href="/"
            className="font-semibold text-gray-900 hover:text-blue-600 transition"
          >
            DocQuery
          </Link>
          . All rights reserved.
        </p>
      </div>

      {/* ✅ Right (centered below on mobile) */}
      <div className="flex justify-center sm:justify-end space-x-4">
        <Link href="/about" className="hover:text-gray-900 transition">
          About
        </Link>
        <Link href="/privacy-policy" className="hover:text-gray-900 transition">
          Privacy
        </Link>
        <Link href="/terms" className="hover:text-gray-900 transition">
          Terms
        </Link>
      </div>
    </footer>
  );
}
