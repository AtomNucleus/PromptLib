import React, { useEffect, useRef } from 'react';
import { ItemKind } from '../types';
import { SortOption } from '../App';
import { FilterIcon, SearchIcon, SortAscIcon } from './icons';

interface SearchBarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    activeKind: ItemKind | 'all';
    setActiveKind: (kind: ItemKind | 'all') => void;
    activeFilterCount: number;
    onFiltersClick: () => void;
    sortBy: SortOption;
    setSortBy: (sort: SortOption) => void;
    itemCount: number;
}

const kindOptions: { kind: ItemKind | 'all', label: string }[] = [
    { kind: 'all', label: 'All' },
    { kind: 'prompt', label: 'Prompts' },
    { kind: 'bookmark', label: 'Bookmarks' },
    { kind: 'note', label: 'Notes' },
];

export const SearchBar: React.FC<SearchBarProps> = ({
    searchTerm,
    setSearchTerm,
    activeKind,
    setActiveKind,
    activeFilterCount,
    onFiltersClick,
    sortBy,
    setSortBy,
    itemCount
}) => {
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey) return;

            if (e.key === '/') {
                if(document.activeElement?.tagName.toLowerCase() !== 'input' && document.activeElement?.tagName.toLowerCase() !== 'textarea') {
                    e.preventDefault();
                    searchInputRef.current?.focus();
                }
            }
            if (e.key === 'f') {
                 if(document.activeElement?.tagName.toLowerCase() !== 'input' && document.activeElement?.tagName.toLowerCase() !== 'textarea') {
                    e.preventDefault();
                    onFiltersClick();
                }
            }
             if (e.key === 't') {
                 if(document.activeElement?.tagName.toLowerCase() !== 'input' && document.activeElement?.tagName.toLowerCase() !== 'textarea') {
                    e.preventDefault();
                    const currentIndex = kindOptions.findIndex(k => k.kind === activeKind);
                    const nextIndex = (currentIndex + 1) % kindOptions.length;
                    setActiveKind(kindOptions[nextIndex].kind);
                }
            }
            if (e.key === 'Escape') {
                searchInputRef.current?.blur();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeKind, setActiveKind, onFiltersClick]);

    return (
        <div className="mb-6 space-y-4">
            <div className="flex gap-2 md:gap-4 items-center">
                <div className="relative flex-grow">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 pointer-events-none" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search items… (Press `/` to focus)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-900 text-zinc-200 placeholder-zinc-500 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                    />
                </div>
                <button
                    onClick={onFiltersClick}
                    className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium py-2 px-4 rounded-lg border border-zinc-800 transition-colors"
                    aria-label="Open filters"
                >
                    <FilterIcon className="w-5 h-5" />
                    <span>Filters</span>
                    {activeFilterCount > 0 && (
                        <span className="bg-emerald-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
                 <div className="relative">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="appearance-none cursor-pointer bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium py-2 pl-4 pr-10 rounded-lg border border-zinc-800 transition-colors focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        aria-label="Sort by"
                    >
                        <option value="recent">Recent</option>
                        <option value="alphabetical">A-Z</option>
                    </select>
                    <SortAscIcon className="w-5 h-5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 p-1 bg-zinc-900 rounded-lg border border-zinc-800">
                    {kindOptions.map(({ kind, label }) => (
                        <button
                            key={kind}
                            onClick={() => setActiveKind(kind)}
                            className={`text-sm px-3 py-1 rounded-md transition-colors duration-200 ${
                                activeKind === kind
                                    ? 'bg-zinc-700 text-white shadow-inner'
                                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <div className="text-sm text-zinc-500">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </div>
            </div>
        </div>
    );
};