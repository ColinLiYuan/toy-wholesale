'use client';

import { useState } from 'react';
import translations from '@/lib/i18n';

export default function VerifyPage() {
  
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      return;
    }

    setLoading(true);
    setResult(null);

    // Mock verification logic
    setTimeout(() => {
      if (code.trim() === '123456') {
        setResult('success');
      } else {
        setResult('error');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] py-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#00F2FE]/20 to-[#00F2FE]/5 border border-[#00F2FE]/30 mb-6">
            <svg className="w-10 h-10 text-[#00F2FE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#E5E5E5] mb-4">
            {translations.verify.title}
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {translations.verify.subtitle}
          </p>
        </div>

        {/* Verification Form */}
        <div className="bg-gradient-to-br from-[#141414] to-[#0A0A0A] border border-white/10 rounded-2xl p-8 md:p-12 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-[#E5E5E5] mb-3">
                {translations.verify.placeholder}
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 16-digit security code"
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-lg text-[#E5E5E5] placeholder-gray-500 focus:outline-none focus:border-[#00F2FE] focus:ring-1 focus:ring-[#00F2FE] transition-all text-lg tracking-widest"
                disabled={loading}
                maxLength={16}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#00F2FE] to-[#00C4CC] text-[#050505] py-4 px-6 rounded-lg font-semibold text-lg hover:shadow-[0_0_30px_rgba(0,242,254,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#050505]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {translations.verify.verifying}
                </>
              ) : (
                translations.verify.button
              )}
            </button>
          </form>
        </div>

        {/* Verification Result */}
        {result === 'success' && (
          <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 border-2 border-green-500/50 rounded-2xl p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-400 mb-2">
                {translations.verify.result.valid}
              </h2>
              <p className="text-green-300">
                Authentication Successful: Genuine Product
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-6 space-y-3 mt-6">
              <h3 className="font-semibold text-green-400 mb-3">
                {translations.verify.result.productInfo}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Product:</span>
                  <span className="ml-2 font-medium text-[#E5E5E5]">Holographic Security Label</span>
                </div>
                <div>
                  <span className="text-gray-400">Batch:</span>
                  <span className="ml-2 font-medium text-[#E5E5E5]">HV-2026-04-A</span>
                </div>
                <div>
                  <span className="text-gray-400">Security Level:</span>
                  <span className="ml-2 font-medium text-[#E5E5E5]">Level 3 - Forensic</span>
                </div>
                <div>
                  <span className="text-gray-400">Verify Time:</span>
                  <span className="ml-2 font-medium text-[#E5E5E5]">{new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {result === 'error' && (
          <div className="bg-gradient-to-br from-red-900/20 to-red-800/10 border-2 border-red-500/50 rounded-2xl p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500 rounded-full mb-4">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-red-400 mb-2">
                Code Not Found
              </h2>
              <p className="text-red-300">
                The security code you entered could not be verified. Please contact support.
              </p>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-[#0A0A0A] border border-white/10 rounded-xl p-6 md:p-8">
          <h3 className="text-lg font-semibold text-[#E5E5E5] mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-[#00F2FE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How to find the security code?
          </h3>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li className="flex items-start">
              <span className="text-[#00F2FE] mr-2">•</span>
              <span>The security code is typically located on the product label or sticker</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#00F2FE] mr-2">•</span>
              <span>Scratch off the coating to reveal the complete security code</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#00F2FE] mr-2">•</span>
              <span>The security code consists of 16-20 digits and letters</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#00F2FE] mr-2">•</span>
              <span>Each code can only be verified once for maximum security</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
