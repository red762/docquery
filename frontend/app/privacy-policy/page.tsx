export const metadata = {
  title: "Privacy Policy – DocQuery",
  description: "Learn how DocQuery protects your data and ensures user privacy.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Privacy Policy</h1>
      <p className="mb-4">
        At <strong>DocQuery</strong>, we value your privacy. This Privacy Policy outlines how we
        collect, use, and protect your personal information when you use our platform.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">1. Information We Collect</h2>
      <p className="mb-3">
        We collect limited information necessary to provide our services, including:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>Uploaded documents for AI processing (not stored permanently).</li>
        <li>Basic usage data to improve performance and reliability.</li>
        <li>Contact details if you reach out to our support team.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">2. How We Use Information</h2>
      <p className="mb-4">
        Your data is used solely to provide document analysis functionality and improve our
        services. We do not sell or share your information with third parties.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">3. Data Security</h2>
      <p className="mb-4">
        All files are transmitted securely using HTTPS. Uploaded documents are deleted automatically
        after processing to ensure your data remains private.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">4. Cookies</h2>
      <p className="mb-4">
        We use minimal cookies to enhance your browsing experience. You can disable cookies in your
        browser settings at any time.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">5. Google AdSense</h2>
      <p className="mb-4">
        We may use Google AdSense to serve advertisements. Google uses cookies to deliver ads based
        on your visits to this and other websites. You can opt out of personalized advertising by
        visiting{" "}
        <a
          href="https://adssettings.google.com/"
          className="text-blue-600 hover:underline"
          target="_blank"
        >
          Google Ad Settings
        </a>
        .
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">6. Contact Us</h2>
      <p>
        For any privacy concerns, contact us at{" "}
        <a
          href="mailto:privacy@docquery.online"
          className="text-blue-600 hover:underline"
        >
          privacy@docquery.online
        </a>.
      </p>

      <p className="text-sm text-gray-500 mt-8">
        Last updated: {new Date().getFullYear()}.
      </p>
    </main>
  );
}
