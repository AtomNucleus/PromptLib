import React from 'react';
import { Modal } from './Modal';
import { Bookmark } from '../types';
import { SparklesIcon, LinkIcon, LoadingSpinner } from './icons';

interface BookmarkDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookmark: Bookmark;
    onDistill: (bookmark: Bookmark) => Promise<void>;
    isLoading: boolean;
}

export const BookmarkDetailModal: React.FC<BookmarkDetailModalProps> = ({ isOpen, onClose, bookmark, onDistill, isLoading }) => {
    
    const handleDistillClick = () => {
        onDistill(bookmark);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={bookmark.title}>
            <div className="space-y-6">
                <div className="flex items-center gap-3 bg-zinc-950 p-3 rounded-md">
                    {bookmark.favicon && <img src={bookmark.favicon} alt="favicon" className="w-6 h-6 rounded" />}
                    <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 truncate font-mono flex items-center gap-2">
                        <LinkIcon className="w-4 h-4 flex-shrink-0" />
                        {bookmark.url}
                    </a>
                </div>

                {bookmark.body && (
                    <div>
                        <h3 className="text-sm font-medium text-zinc-300 mb-2">AI Summary</h3>
                        <div className="bg-zinc-950 p-4 rounded-md text-zinc-300 prose prose-sm prose-invert max-w-none">
                           <p>{bookmark.body}</p>
                        </div>
                    </div>
                )}
                
                <div className="flex justify-end pt-4 border-t border-zinc-800">
                     <button
                        onClick={handleDistillClick}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-zinc-700 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <LoadingSpinner className="w-5 h-5"/>
                                Distilling...
                            </>
                        ) : (
                            <>
                                <SparklesIcon className="w-5 h-5"/>
                                Distill & Create Prompts
                            </>
                        )}
                    </button>
                </div>
                <p className="text-xs text-zinc-500 text-center">
                    "Distill" uses Gemini with Google Search to read the webpage, generate a summary, and create new prompts based on its content.
                </p>
            </div>
        </Modal>
    );
};