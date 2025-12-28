'use client';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

interface SearchBarProps {
    placeholder?: string;
    onSearch: (value: string) => void;
    value?: string;
}

export default function SearchBar({ placeholder = "Tìm kiếm...", onSearch, value = '' }: SearchBarProps) {
    const [query, setQuery] = useState(value);
    const onSearchRef = useRef(onSearch);

    // Cập nhật ref khi onSearch thay đổi
    useEffect(() => {
        onSearchRef.current = onSearch;
    }, [onSearch]);

    useEffect(() => {
        setQuery(value);
    }, [value]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onSearchRef.current(query);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleClear = () => {
        setQuery('');
        onSearchRef.current('');
    };

    return (
        <div className="w-full flex justify-center md:justify-start">
            <div className="relative flex items-center w-full max-w-md bg-white border border-[#e2e8f0] rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 focus-within:ring-2 focus-within:ring-[#14b8a6]/30 focus-within:border-[#0d9488] focus-within:shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                <span className="absolute left-3 text-gray-500 text-sm">
                    <FaSearch />
                </span>
                <InputText
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="pl-10 pr-10 py-3 w-full rounded-2xl text-[#334155] placeholder-[#64748b] border-0 focus:ring-0 outline-none transition-all duration-300 bg-transparent"
                />
                {query && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                        <FaTimes />
                    </button>
                )}
            </div>
        </div>
    );
}
