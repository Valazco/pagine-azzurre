'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function SearchBox() {
  const [name, setName] = useState('');
  const router = useRouter();

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name.trim()) {
      router.push(`/search/name/${encodeURIComponent(name)}`);
    }
  };

  return (
    <form onSubmit={submitHandler} className="flex items-center gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          name="q"
          id="q"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Cerca prodotti..."
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
          aria-label="Cerca"
        >
          <Search size={20} />
        </button>
      </div>
    </form>
  );
}
