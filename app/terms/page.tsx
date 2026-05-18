import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Silvibe',
  description: 'Terms and conditions for purchasing wholesale adult toys from Silvibe. Read our terms of service before placing orders.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-16 px-6 bg-[#F8F9FA] border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#1A1A1A]">
            Terms of Service
          </h1>
          <p className="text-lg text-[#6C757D]">
            Last updated: April 27, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">1. Acceptance of Terms</h2>
          <p className="text-[#6C757D] mb-6">
            By accessing and using Silvibe's website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.
          </p>

          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">2. Eligibility</h2>
          <p className="text-[#6C757D] mb-4">To use our services, you must:</p>
          <ul className="list-disc pl-6 text-[#6C757D] mb-6 space-y-2">
            <li>Be at least 18 years old (or the legal age in your jurisdiction)</li>
            <li>Be purchasing for legitimate business purposes (wholesale/retail)</li>
            <li>Provide accurate and complete information</li>
            <li>Comply with all applicable laws and regulations</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">3. Wholesale Orders</h2>
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-3">Minimum Order Quantity (MOQ)</h3>
          <p className="text-[#6C757D] mb-4">
            We operate as a wholesale supplier with minimum order quantities that vary by product. MOQ requirements are clearly stated on each product page.
          </p>

          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-3">Order Confirmation</h3>
          <p className="text-[#6C757D] mb-6">
            All orders are subject to availability and confirmation. We reserve the right to accept or decline any order. Order confirmation does not constitute acceptance; we reserve the right to cancel orders due to pricing errors, product unavailability, or suspected fraud.
          </p>

          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">4. Pricing and Payment</h2>
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-3">Pricing</h3>
          <p className="text-[#6C757D] mb-4">All prices are:</p>
          <ul className="list-disc pl-6 text-[#6C757D] mb-6 space-y-2">
            <li>Quoted in USD unless otherwise stated</li>
            <li>Subject to change without notice</li>
            <li>Exclude shipping costs, taxes, and customs duties unless specified</li>
            <li>Based on the quantity ordered (volume discounts available)</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-3">Payment Terms</h3>
          <p className="text-[#6C757D] mb-4">We accept the following payment methods:</p>
          <ul className="list-disc pl-6 text-[#6C757D] mb-6 space-y-2">
            <li>Bank transfer (T/T)</li>
            <li>PayPal</li>
            <li>Wire transfer</li>
            <li>Other methods as agreed upon</li>
          </ul>
          <p className="text-[#6C757D] mb-6">
            Payment terms will be specified in your order confirmation. Full payment may be required before shipment for new customers.
          </p>

          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">5. Shipping and Delivery</h2>
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-3">Shipping Methods</h3>
          <p className="text-[#6C757D] mb-4">We offer various shipping options including:</p>
          <ul className="list-disc pl-6 text-[#6C757D] mb-6 space-y-2">
            <li>Express courier (DHL, FedEx, UPS)</li>
            <li>Air freight</li>
            <li>Sea freight (for large orders)</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-3">Delivery Time</h3>
          <p className="text-[#6C757D] mb-4">
            Delivery times vary based on:
          </p>
          <ul className="list-disc pl-6 text-[#6C757D] mb-6 space-y-2">
            <li>Shipping method selected</li>
            <li>Destination country</li>
            <li>Product availability</li>
            <li>Customs clearance procedures</li>
          </ul>
          <p className="text-[#6C757D] mb-6">
            Estimated delivery times are provided for reference only and are not guaranteed.
          </p>

          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-3">Customs and Duties</h3>
          <p className="text-[#6C757D] mb-6">
            Import duties, taxes, and customs fees are the responsibility of the buyer. We are not responsible for delays caused by customs clearance.
          </p>

          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">6. Product Quality and Compliance</h2>
          <p className="text-[#6C757D] mb-4">All our products:</p>
          <ul className="list-disc pl-6 text-[#6C757D] mb-6 space-y-2">
            <li>Are made from medical-grade silicone or body-safe materials</li>
            <li>Comply with relevant safety standards (RoHS, REACH, CE as applicable)</li>
            <li>Undergo quality control inspections before shipment</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">7. Returns and Refunds</h2>
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-3">Return Policy</h3>
          <p className="text-[#6C757D] mb-4">Due to the nature of our products:</p>
          <ul className="list-disc pl-6 text-[#6C757D] mb-6 space-y-2">
            <li>Returns are only accepted for defective or damaged products</li>
            <li>Products must be unopened and in original packaging (if return is due to buyer's error)</li>
            <li>Return requests must be made within 7 days of receipt</li>
            <li>Buyer is responsible for return shipping costs unless the return is due to our error</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-3">Refunds</h3>
          <p className="text-[#6C757D] mb-6">
            Refunds will be processed within 14 business days after we receive and inspect the returned items. Refunds will be issued to the original payment method.
          </p>

          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">8. OEM/ODM Services</h2>
          <p className="text-[#6C757D] mb-4">For custom manufacturing services:</p>
          <ul className="list-disc pl-6 text-[#6C757D] mb-6 space-y-2">
            <li>Separate agreements will be executed for OEM/ODM projects</li>
            <li>Minimum order quantities and lead times vary by project complexity</li>
            <li>Mold fees may apply for custom designs</li>
            <li>Intellectual property rights will be clearly defined in the agreement</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">9. Intellectual Property</h2>
          <p className="text-[#6C757D] mb-6">
            All content on this website, including text, images, logos, and product designs, is the property of Silvibe and is protected by copyright, trademark, and other intellectual property laws. You may not use our intellectual property without prior written consent.
          </p>

          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">10. Limitation of Liability</h2>
          <p className="text-[#6C757D] mb-6">
            To the maximum extent permitted by law, Silvibe shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website, products, or services. Our total liability shall not exceed the amount you paid for the specific product or service giving rise to the claim.
          </p>

          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">11. Indemnification</h2>
          <p className="text-[#6C757D] mb-6">
            You agree to indemnify and hold harmless Silvibe from any claims, damages, or expenses arising from your breach of these terms, violation of laws, or infringement of third-party rights.
          </p>

          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">12. Governing Law</h2>
          <p className="text-[#6C757D] mb-6">
            These terms shall be governed by and construed in accordance with the laws of the People's Republic of China. Any disputes shall be resolved through negotiation, and if unsuccessful, through arbitration in Dongguan, Guangdong, China.
          </p>

          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">13. Changes to Terms</h2>
          <p className="text-[#6C757D] mb-6">
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Continued use of our services constitutes acceptance of the modified terms.
          </p>

          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">14. Contact Information</h2>
          <p className="text-[#6C757D] mb-4">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="bg-[#F8F9FA] p-6 rounded-lg mb-6">
            <p className="text-[#6C757D] mb-2"><strong>Email:</strong> colinliyuan@gmail.com</p>
            <p className="text-[#6C757D] mb-2"><strong>WhatsApp:</strong> +86 138 2442 3871</p>
            <p className="text-[#6C757D]"><strong>Address:</strong> Dongguan, Guangdong, China</p>
          </div>
        </div>
      </section>
    </div>
  );
}
