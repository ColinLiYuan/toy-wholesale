'use client';

import { COUNTRIES } from '@/lib/countries';

interface CountrySelectProps {
  value: string;
  onChange: (code: string) => void;
  className?: string;
}

export default function CountrySelect({ value, onChange, className }: CountrySelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className || 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent'}
    >
      <option value="">-- 选择国家 --</option>
      {COUNTRIES.map(([code, name]) => (
        <option key={code} value={code}>
          {name} ({code})
        </option>
      ))}
    </select>
  );
}
