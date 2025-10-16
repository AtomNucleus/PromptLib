import React, { useState, useRef, useEffect } from 'react';
import { generateVariableSuggestions } from '../services/geminiService';
import { SparklesIcon, LoadingSpinner } from './icons';

interface VariableInputProps {
    name: string;
    promptBody: string;
}

export const VariableInput: React.FC<VariableInputProps> = ({ name, promptBody }) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [value, setValue] = useState('');
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleGenerateSuggestions = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const newSuggestions = await generateVariableSuggestions(promptBody, name);
            setSuggestions(newSuggestions);
            if (newSuggestions.length > 0) {
                setDropdownOpen(true);
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to get suggestions.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSuggestionClick = (suggestion: string) => {
        setValue(suggestion);
        setDropdownOpen(false);
    };
    
    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);


    return (
        <div className="relative" ref={wrapperRef}>
            <label htmlFor={`var-${name}`} className="block text-xs font-medium text-zinc-400 mb-1">
                {`{{${name}}}`}
            </label>
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    id={`var-${name}`}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onFocus={() => suggestions.length > 0 && setDropdownOpen(true)}
                    placeholder={`Enter value for ${name}...`}
                    className="w-full bg-zinc-800 text-zinc-200 placeholder-zinc-500 border border-zinc-700 rounded-md px-3 py-1.5 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    autoComplete="off"
                />
                <button
                    type="button"
                    onClick={handleGenerateSuggestions}
                    disabled={isLoading}
                    className="p-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-md transition-colors duration-200 disabled:bg-zinc-700 disabled:cursor-not-allowed flex-shrink-0"
                    title="Generate AI suggestions"
                    aria-label={`Generate AI suggestions for ${name}`}
                >
                    {isLoading ? <LoadingSpinner className="w-4 h-4" /> : <SparklesIcon className="w-4 h-4" />}
                </button>
            </div>
            {isDropdownOpen && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-zinc-800 border border-zinc-700 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                    <ul>
                        {suggestions.map((suggestion, index) => (
                            <li key={index}>
                                <button
                                    type="button"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="w-full text-left px-4 py-2 text-sm text-zinc-200 hover:bg-violet-600 hover:text-white transition-colors"
                                >
                                    {suggestion}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        </div>
    );
};
