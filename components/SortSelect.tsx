'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <select
      className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white text-[#1A1A1A] focus:ring-2 focus:ring-[#0056B3] focus:border-[#0056B3] outline-none"
      defaultValue={searchParams.get('sort') || 'newest'}
      onChange={(e) => handleSort(e.target.value)}
    >
      <option value="newest">Newest</option>
      <option value="name_asc">Name A–Z</option>
      <option value="name_desc">Name Z–A</option>
    </select>
  );
}
