export const metadata = {
  title: "Terms of Service – DocQuery",
  description: "Read the terms and conditions of using the DocQuery platform.",
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Terms of Service</h1>
      <p className="mb-4">
        By accessing or using <strong>DocQuery</strong>, you agree to the following terms and
        conditions. Please read them carefully before using the service.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">1. Use of the Service</h2>
      <p className="mb-4">
        DocQuery provides an AI-driven tool to analyze, summarize, and extract insights from
        uploaded documents. You agree to use the platform only for lawful purposes.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">2. Intellectual Property</h2>
      <p className="mb-4">
        All platform content, branding, and interface design are owned by DocQuery. You retain
        ownership of any documents you upload.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">3. User Responsibilities</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Do not upload sensitive or illegal materials.</li>
        <li>Do not use the service to violate copyright or intellectual property rights.</li>
        <li>Do not attempt to reverse-engineer or misuse the platform.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">4. Disclaimer of Warranty</h2>
      <p className="mb-4">
        DocQuery is provided “as is” without warranties of any kind. We strive for accuracy but do
        not guarantee the completeness or reliability of generated outputs.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">5. Limitation of Liability</h2>
      <p className="mb-4">
        DocQuery shall not be liable for any indirect, incidental, or consequential damages
        resulting from your use of the platform.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">6. Updates to These Terms</h2>
      <p className="mb-4">
        We may revise these terms periodically. Continued use of DocQuery after updates implies
        acceptance of the revised terms.
      </p>

      <p className="text-sm text-gray-500 mt-8">
        Last updated: {new Date().getFullYear()}.
      </p>
    </main>
  );
}
