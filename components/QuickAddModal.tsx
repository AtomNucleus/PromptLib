import React, { useState } from 'react';
import { Modal } from './Modal';
import { SparklesIcon, LoadingSpinner } from './icons';

interface QuickAddModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (idea: string) => Promise<void>;
    isLoading: boolean;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
    const [idea, setIdea] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (idea.trim()) {
            onSubmit(idea);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Quick Add & Compose">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="idea" className="block text-sm font-medium text-zinc-300 mb-1">
                        Your Idea or Goal
                    </label>
                    <textarea
                        id="idea"
                        rows={6}
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        placeholder="e.g., A marketing campaign for a new sustainable coffee brand..."
                        className="w-full bg-zinc-800 text-zinc-200 placeholder-zinc-500 border border-zinc-700 rounded-md px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                     <p className="text-xs text-zinc-500 mt-2">Describe what you want to achieve, and Gemini will generate 5 ready-to-use prompts for you.</p>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading || !idea.trim()}
                        className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-zinc-700 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <LoadingSpinner className="w-5 h-5"/>
                                Composing...
                            </>
                        ) : (
                             <>
                                <SparklesIcon className="w-5 h-5" />
                                Make Prompts
                            </>
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};