'use client';

import { useState } from 'react';
import apiClient from '@/lib/api-client';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRODUCT_CATEGORIES = [
  'Realistic Life-size Series',
  'Realistic Dildos',
  'Male Masturbators',
  'Vibrators & Wands',
  'Couples & Games',
  'BDSM & Fetish',
  'Lingerie & Accessories',
  'Other / Multiple Categories',
];

const BUSINESS_NEEDS = [
  'Wholesale Bulk Purchase',
  'OEM / Custom Branding',
  'ODM / Product Development',
  'Sample Evaluation',
  'Long-term Partnership',
];

const CONTACT_METHODS = [
  'WhatsApp',
  'Email',
  'Phone Call',
  'WeChat',
];

export default function InquiryModal({ isOpen, onClose }: InquiryModalProps) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    categories: [] as string[],
    businessNeeds: [] as string[],
    estimatedQuantity: '',
    message: '',
    contactMethod: '',
    contactInfo: '',
    name: '',
    company: '',
    country: '',
  });

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleArrayItem = (field: 'categories' | 'businessNeeds', value: string) => {
    const current = formData[field];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setFormData({ ...formData, [field]: updated });
  };

  const canProceedStep1 = formData.categories.length > 0;
  const canProceedStep2 = formData.businessNeeds.length > 0;
  const canProceedStep3 = formData.contactMethod && formData.contactInfo && formData.name;
  const canSubmit = canProceedStep3;

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    try {
      await apiClient.post('/v1/inquiries', {
        customerName: formData.name,
        customerEmail: formData.contactMethod === 'Email' ? formData.contactInfo : undefined,
        customerPhone: formData.contactMethod !== 'Email' ? formData.contactInfo : undefined,
        companyName: formData.company || undefined,
        country: formData.country || undefined,
        message: [
          `Product Categories: ${formData.categories.join(', ')}`,
          `Business Needs: ${formData.businessNeeds.join(', ')}`,
          `Estimated Order Qty: ${formData.estimatedQuantity || 'Not specified'}`,
          `Preferred Contact: ${formData.contactMethod}`,
          formData.message ? `Additional Notes: ${formData.message}` : '',
        ].filter(Boolean).join('\n'),
        source: 'WEBSITE_FORM',
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit inquiry:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setSubmitted(false);
      setFormData({
        categories: [],
        businessNeeds: [],
        estimatedQuantity: '',
        message: '',
        contactMethod: '',
        contactInfo: '',
        name: '',
        company: '',
        country: '',
      });
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                {submitted ? 'Inquiry Submitted!' : 'Request Wholesale Pricing'}
              </h2>
              {!submitted && (
                <p className="text-sm text-text-secondary mt-1">
                  Tell us what you need and we'll get back to you within 24 hours
                </p>
              )}
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {!submitted && (
            <>
              <div className="mt-5 flex items-center gap-2">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        s <= step ? 'bg-brand' : ''
                      }`}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-1.5 text-xs text-text-secondary text-right">
                Step {step} of 3
              </div>
            </>
          )}
        </div>

        {/* Content */}
        {submitted ? (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Thank you for your inquiry!</h3>
            <p className="text-sm text-text-secondary mb-6">
              Our sales team will contact you via {formData.contactMethod} within 24 hours.
            </p>
            <button
              onClick={handleClose}
              className="px-8 py-3 rounded-lg bg-brand text-white font-semibold hover:bg-brand-hover transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="px-6 py-6 min-h-[380px]">
            {/* Step 1: Product Categories */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-1">
                    What products are you interested in?
                  </h3>
                  <p className="text-sm text-text-secondary">Select all that apply</p>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleArrayItem('categories', cat)}
                      className={`p-3 rounded-lg border text-left text-sm transition-all ${
                        formData.categories.includes(cat)
                          ? 'border-brand bg-brand-light text-brand font-medium'
                          : 'border-gray-200 hover:border-gray-300 text-text-primary'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Business Needs */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-1">
                    What are your business needs?
                  </h3>
                  <p className="text-sm text-text-secondary">Select all that apply</p>
                </div>
                <div className="space-y-2.5">
                  {BUSINESS_NEEDS.map((need) => (
                    <button
                      key={need}
                      onClick={() => toggleArrayItem('businessNeeds', need)}
                      className={`w-full p-3.5 rounded-lg border text-left text-sm transition-all ${
                        formData.businessNeeds.includes(need)
                          ? 'border-brand bg-brand-light text-brand font-medium'
                          : 'border-gray-200 hover:border-gray-300 text-text-primary'
                      }`}
                    >
                      {need}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Estimated order quantity per SKU
                  </label>
                  <input
                    type="text"
                    value={formData.estimatedQuantity}
                    onChange={(e) => setFormData({ ...formData, estimatedQuantity: e.target.value })}
                    placeholder="e.g., 200 pcs or 1,000+ pcs"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-text-primary placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Additional notes (optional)
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Any specific requirements or questions..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-text-primary placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors text-sm resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Contact Info */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-1">
                    How can we reach you?
                  </h3>
                  <p className="text-sm text-text-secondary">We'll respond within 24 hours</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Full name"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-text-primary placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Company name"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-text-primary placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Your country"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-text-primary placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Preferred Contact Method *
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {CONTACT_METHODS.map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setFormData({ ...formData, contactMethod: method, contactInfo: '' })}
                        className={`p-2.5 rounded-lg border text-sm text-center transition-all ${
                          formData.contactMethod === method
                            ? 'border-brand bg-brand-light text-brand font-medium'
                            : 'border-gray-200 hover:border-gray-300 text-text-primary'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    {formData.contactMethod || 'Contact'} Info *
                  </label>
                  <input
                    type="text"
                    value={formData.contactInfo}
                    onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                    placeholder={
                      formData.contactMethod === 'WhatsApp' ? '+86 138 xxxx xxxx' :
                      formData.contactMethod === 'Email' ? 'your@email.com' :
                      formData.contactMethod === 'WeChat' ? 'WeChat ID' :
                      'Enter your contact details'
                    }
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-text-primary placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {!submitted && (
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between bg-surface">
            <button
              onClick={handlePrevious}
              disabled={step === 1}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                step === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white'
              }`}
            >
              Previous
            </button>

            {step < 3 ? (
              <button
                onClick={handleNext}
                disabled={(step === 1 && !canProceedStep1) || (step === 2 && !canProceedStep2)}
                className="px-6 py-2.5 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                className="px-6 py-2.5 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Submitting...
                  </span>
                ) : (
                  'Submit Inquiry'
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
