export const metadata = {
  title: "About – DocQuery",
  description: "Learn more about DocQuery, your intelligent assistant for document analysis and AI-powered insights.",
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">About DocQuery</h1>

      <p className="mb-4">
        <strong>DocQuery</strong> is an AI-powered document analysis platform that helps you
        interact with your files intelligently. Upload any document — PDF, DOCX, XLSX, PPTX, or TXT —
        and ask natural-language questions, extract data, or generate summaries in seconds.
      </p>

      <p className="mb-4">
        Our goal is to make document understanding effortless. Whether you're a student,
        researcher, or professional, DocQuery saves you time by combining cutting-edge AI models
        with a simple, intuitive interface.
      </p>

      <p className="mb-4">
        The platform was built with privacy, accuracy, and speed in mind — so your documents are
        processed securely, and your insights arrive instantly.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Our Mission</h2>
      <p>
        To empower users worldwide with intelligent tools that make reading, learning, and research
        faster and more effective.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Contact Us</h2>
      <p>
        For questions or partnership inquiries, reach us at{" "}
        <a
          href="mailto:support@docquery.online"
          className="text-blue-600 hover:underline"
        >
          support@docquery.online
        </a>.
      </p>
    </main>
  );
}
