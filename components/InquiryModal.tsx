'use client';

import { useState } from 'react';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  translations: any;
}

export default function InquiryModal({ isOpen, onClose, translations }: InquiryModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    industry: '',
    securityConcern: '',
    contactMethod: '',
    contactInfo: '',
  });

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Submit form
      console.log('Form submitted:', formData);
      onClose();
      setStep(1);
      setFormData({ industry: '', securityConcern: '', contactMethod: '', contactInfo: '' });
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const industries = [
    'Pharmaceuticals',
    'Luxury & Beauty',
    'High-end Liquor',
    'Government Documents',
    'Electronics',
    'Automotive',
    'Food & Beverage',
    'Other',
  ];

  const securityConcerns = [
    'Counterfeiting Prevention',
    'Tamper Evidence',
    'Supply Chain Tracking',
    'Brand Protection',
    'Regulatory Compliance',
    'Multiple Concerns',
  ];

  const contactMethods = [
    'WhatsApp',
    'Email',
    'Phone Call',
    'WeChat',
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-gradient-to-br from-[#141414] to-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#E5E5E5] mb-2">
                {translations.leadGen.title}
              </h2>
              <p className="text-gray-400 text-sm">
                {translations.leadGen.subtitle}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 flex items-center space-x-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    s <= step ? 'bg-gradient-to-r from-[#00F2FE] to-[#00C4CC]' : ''
                  }`}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-500 text-right">
            Step {step} of 3
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8 min-h-[400px]">
          {/* Step 1: Industry Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-[#E5E5E5] mb-2">
                  {translations.leadGen.step1.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {translations.leadGen.step1.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {industries.map((industry) => (
                  <button
                    key={industry}
                    onClick={() => setFormData({ ...formData, industry })}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      formData.industry === industry
                        ? 'border-[#00F2FE] bg-[#00F2FE]/10'
                        : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <span className={`text-sm font-medium ${
                      formData.industry === industry ? 'text-[#00F2FE]' : 'text-[#E5E5E5]'
                    }`}>
                      {industry}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Security Concern */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-[#E5E5E5] mb-2">
                  {translations.leadGen.step2.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {translations.leadGen.step2.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {securityConcerns.map((concern) => (
                  <button
                    key={concern}
                    onClick={() => setFormData({ ...formData, securityConcern: concern })}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      formData.securityConcern === concern
                        ? 'border-[#00F2FE] bg-[#00F2FE]/10'
                        : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <span className={`text-sm font-medium ${
                      formData.securityConcern === concern ? 'text-[#00F2FE]' : 'text-[#E5E5E5]'
                    }`}>
                      {concern}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Contact Info */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-[#E5E5E5] mb-2">
                  {translations.leadGen.step3.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {translations.leadGen.step3.description}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#E5E5E5] mb-2">
                    Preferred Contact Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {contactMethods.map((method) => (
                      <button
                        key={method}
                        onClick={() => setFormData({ ...formData, contactMethod: method })}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          formData.contactMethod === method
                            ? 'border-[#00F2FE] bg-[#00F2FE]/10'
                            : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                        }`}
                      >
                        <span className={`text-sm font-medium ${
                          formData.contactMethod === method ? 'text-[#00F2FE]' : 'text-[#E5E5E5]'
                        }`}>
                          {method}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#E5E5E5] mb-2">
                    {formData.contactMethod || 'Contact'} Information
                  </label>
                  <input
                    type="text"
                    value={formData.contactInfo}
                    onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                    placeholder={
                      formData.contactMethod === 'WhatsApp' ? '+1 234 567 8900' :
                      formData.contactMethod === 'Email' ? 'your@email.com' :
                      'Enter your contact details'
                    }
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-[#E5E5E5] placeholder-gray-500 focus:outline-none focus:border-[#00F2FE] transition-colors"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-white/10 flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={step === 1}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              step === 1
                ? 'opacity-50 cursor-not-allowed text-gray-500'
                : 'text-[#E5E5E5] hover:bg-white/5'
            }`}
          >
            {translations.leadGen.previous}
          </button>

          <button
            onClick={handleNext}
            disabled={
              (step === 1 && !formData.industry) ||
              (step === 2 && !formData.securityConcern) ||
              (step === 3 && (!formData.contactMethod || !formData.contactInfo))
            }
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#00F2FE] to-[#00C4CC] text-[#050505] font-semibold hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 3 ? translations.leadGen.complete : translations.leadGen.next}
          </button>
        </div>
      </div>
    </div>
  );
}
