'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import {
  SearchForm,
  SearchInputWrapper,
  SearchInput,
  SearchButton,
} from './SearchBox.styles';

export function SearchBox() {
  const [name, setName] = useState('');
  const router = useRouter();

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name.trim()) {
      router.push(`/search/name/${encodeURIComponent(name)}`);
    }
  };

  return (
    <SearchForm onSubmit={submitHandler}>
      <SearchInputWrapper>
        <SearchInput
          type="text"
          name="q"
          id="q"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Cerca prodotti..."
        />
        <SearchButton type="submit" aria-label="Cerca">
          <Search size={18} />
        </SearchButton>
      </SearchInputWrapper>
    </SearchForm>
  );
}

export default SearchBox;
