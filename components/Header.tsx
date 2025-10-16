import React from 'react';
import { SparklesIcon, LogoIcon } from './icons';

interface HeaderProps {
    onQuickAdd: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onQuickAdd }) => {
    return (
        <header className="bg-black/80 backdrop-blur-md sticky top-0 z-40 border-b border-zinc-800">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <LogoIcon className="w-8 h-8" />
                    <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Prompt Architect</h1>
                </div>
                <button
                    onClick={onQuickAdd}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                    <SparklesIcon className="w-5 h-5" />
                    <span>Quick Add</span>
                </button>
            </div>
        </header>
    );
};