import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Silvibe',
  description: 'Privacy policy for Silvibe wholesale adult toys. Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-16 px-6 bg-[#F8F9FA] border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#1A1A1A]">
            Privacy Policy
          </h1>
          <p className="text-lg text-[#6C757D]">
            Last updated: April 27, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">1. Introduction</h2>
          <p className="text-[#6C757D] mb-6">
            Silvibe ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make wholesale purchases.
          </p>

          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">2. Information We Collect</h2>
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-3">Personal Information</h3>
          <p className="text-[#6C757D] mb-4">
            We may collect personal information that you voluntarily provide to us when you:
          </p>
          <ul className="list-disc pl-6 text-[#6C757D] mb-6 space-y-2">
            <li>Register for an account</li>
            <li>Place wholesale orders</li>
            <li>Contact us via email, WhatsApp, or inquiry forms</li>
            <li>Subscribe to our newsletter</li>
            <li>Request OEM/ODM services</li>
          </ul>

          <p className="text-[#6C757D] mb-4">This information may include:</p>
          <ul className="list-disc pl-6 text-[#6C757D] mb-6 space-y-2">
            <li>Name and company name</li>
            <li>Email address</li>
            <li>Phone number (including WhatsApp)</li>
            <li>Shipping and billing address</li>
            <li>Business information (tax ID, business license)</li>
            <li>Payment information</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-3">Automatically Collected Information</h3>
          <p className="text-[#6C757D] mb-6">
            When you visit our website, we may automatically collect certain information about your device and browsing behavior, including IP address, browser type, operating system, referring URLs, pages viewed, and time spent on pages.
          </p>

          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">3. How We Use Your Information</h2>
          <p className="text-[#6C757D] mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-6 text-[#6C757D] mb-6 space-y-2">
            <li>Process and fulfill wholesale orders</li>
            <li>Communicate with you about orders, shipments, and inquiries</li>
            <li>Provide customer support</li>
            <li>Send marketing communications (with your consent)</li>
            <li>Improve our website and services</li>
            <li>Comply with legal obligations</li>
            <li>Prevent fraud and ensure security</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">4. Information Sharing</h2>
          <p className="text-[#6C757D] mb-4">
            We do not sell, trade, or rent your personal information to third parties. We may share your information with:
          </p>
          <ul className="list-disc pl-6 text-[#6C757D] mb-6 space-y-2">
            <li><strong>Service providers:</strong> Payment processors, shipping carriers, and IT service providers who help us operate our business</li>
            <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
            <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">5. Data Security</h2>
          <p className="text-[#6C757D] mb-6">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
          </p>

          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">6. Cookies</h2>
          <p className="text-[#6C757D] mb-4">
            We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings.
          </p>

          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">7. Your Rights</h2>
          <p className="text-[#6C757D] mb-4">Depending on your location, you may have the right to:</p>
          <ul className="list-disc pl-6 text-[#6C757D] mb-6 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt-out of marketing communications</li>
            <li>Data portability</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">8. International Data Transfers</h2>
          <p className="text-[#6C757D] mb-6">
            Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your information during international transfers.
          </p>

          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">9. Children's Privacy</h2>
          <p className="text-[#6C757D] mb-6">
            Our website and products are intended for adults only (18+ years). We do not knowingly collect personal information from children under 18 years of age.
          </p>

          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">10. Changes to This Policy</h2>
          <p className="text-[#6C757D] mb-6">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
          </p>

          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">11. Contact Us</h2>
          <p className="text-[#6C757D] mb-4">
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <div className="bg-[#F8F9FA] p-6 rounded-lg mb-6">
            <p className="text-[#6C757D] mb-2"><strong>Email:</strong> colinliyuan@gmail.com</p>
            <p className="text-[#6C757D] mb-2"><strong>WhatsApp:</strong> +86 176 2018 9025</p>
            <p className="text-[#6C757D]"><strong>Address:</strong> Dongguan, Guangdong, China</p>
          </div>
        </div>
      </section>
    </div>
  );
}
