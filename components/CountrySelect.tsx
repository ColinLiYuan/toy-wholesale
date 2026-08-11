'use client';

import { useState, useRef, useEffect } from 'react';
import { COUNTRIES, countryName } from '@/lib/countries';

interface CountrySelectProps {
  value: string;
  onChange: (code: string) => void;
  className?: string;
}

export default function CountrySelect({ value, onChange, className }: CountrySelectProps) {
  const [search, setSearch] = useState(value ? countryName(value) : '');
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = search
    ? COUNTRIES.filter(([code, name]) =>
        name.includes(search) || code.toLowerCase().includes(search.toLowerCase()))
    : COUNTRIES;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch(value ? countryName(value) : '');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [value]);

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={open ? search : (value ? countryName(value) : '')}
        placeholder="搜索国家..."
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
          if (!e.target.value) onChange('');
        }}
        className={className || 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent'}
      />
      {open && (
        <ul className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-gray-400">无匹配国家</li>
          ) : filtered.slice(0, 50).map(([code, name]) => (
            <li
              key={code}
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 ${code === value ? 'bg-blue-100' : ''}`}
              onClick={() => {
                onChange(code);
                setSearch(name);
                setOpen(false);
              }}
            >
              {name} <span className="text-gray-400">({code})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
