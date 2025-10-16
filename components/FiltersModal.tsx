import React from 'react';
import { Modal } from './Modal';
import { Tag } from './Tag';

interface FiltersModalProps {
    isOpen: boolean;
    onClose: () => void;
    allTags: string[];
    activeTags: Set<string>;
    toggleTag: (tag: string) => void;
    clearFilters: () => void;
}

export const FiltersModal: React.FC<FiltersModalProps> = ({
    isOpen,
    onClose,
    allTags,
    activeTags,
    toggleTag,
    clearFilters
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Filters">
            <div className="space-y-6">
                <div>
                    <h3 className="text-base font-semibold text-zinc-300 mb-3">Filter by Tag</h3>
                    {allTags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {allTags.map(tag => (
                                <Tag
                                    key={tag}
                                    label={tag}
                                    isActive={activeTags.has(tag)}
                                    onClick={() => toggleTag(tag)}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-zinc-500 text-sm">No tags available to filter by.</p>
                    )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
                    <button
                        onClick={() => {
                            clearFilters();
                        }}
                        className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors disabled:text-zinc-600 disabled:cursor-not-allowed"
                        disabled={activeTags.size === 0}
                    >
                        Clear Tag Filters
                    </button>
                    <button
                        onClick={onClose}
                        className="ml-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        Done
                    </button>
                </div>
            </div>
        </Modal>
    );
};