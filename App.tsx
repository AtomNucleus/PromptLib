import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Item, ItemKind, Prompt } from './types';
import { INITIAL_ITEMS, REFINEMENT_FRAMEWORKS } from './constants';
import { composePromptsFromIdea, distillBookmarkFromUrl, refinePromptBody } from './services/geminiService';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ItemList } from './components/ItemList';
import { QuickAddModal } from './components/QuickAddModal';
import { PromptDetailModal } from './components/PromptDetailModal';
import { BookmarkDetailModal } from './components/BookmarkDetailModal';
import { LoadingSpinner } from './components/icons';
import { FiltersModal } from './components/FiltersModal';

export type SortOption = 'recent' | 'alphabetical';

const App: React.FC = () => {
    const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
    const [activeKind, setActiveKind] = useState<ItemKind | 'all'>('all');
    const [sortBy, setSortBy] = useState<SortOption>('recent');

    const [isQuickAddOpen, setQuickAddOpen] = useState(false);
    const [isFiltersOpen, setFiltersOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        items.forEach(item => {
            if (item.tags) {
                item.tags.forEach(tag => tags.add(tag));
            }
        });
        return Array.from(tags).sort();
    }, [items]);

    const filteredItems = useMemo(() => {
        let filtered = items.filter(item => {
            const searchMatch = searchTerm.length === 0 ||
                item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.kind === 'note' && item.body?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.kind === 'prompt' && item.body?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.kind === 'bookmark' && item.url?.toLowerCase().includes(searchTerm.toLowerCase()));

            const tagMatch = activeTags.size === 0 ||
                item.tags?.some(tag => activeTags.has(tag));

            const kindMatch = activeKind === 'all' || item.kind === activeKind;

            return searchMatch && tagMatch && kindMatch;
        });

        filtered.sort((a, b) => {
            if (sortBy === 'alphabetical') {
                return a.title.localeCompare(b.title);
            }
            // default to 'recent'
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });

        return filtered;

    }, [items, searchTerm, activeTags, activeKind, sortBy]);

    const handleQuickAdd = async (idea: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const newPrompts = await composePromptsFromIdea(idea);
            setItems(prev => [...newPrompts, ...prev]);
            setQuickAddOpen(false);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDistillBookmark = async (item: Item) => {
        if (item.kind !== 'bookmark' || !item.url) return;
        setIsLoading(true);
        setError(null);
        try {
            const { summary, prompts, tags } = await distillBookmarkFromUrl(item.url);
            const newPrompts: Prompt[] = prompts.map(p => ({
                id: crypto.randomUUID(),
                kind: 'prompt',
                title: p.title,
                body: p.body,
                variables: p.variables || [],
                tags: p.tags || [],
                source: { type: 'bookmark-distill', url: item.url },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }));

            setItems(prev => {
                const updatedItem = { ...item, body: summary, tags: [...new Set([...(item.tags || []), ...tags])] };
                const otherItems = prev.filter(i => i.id !== item.id);
                return [...newPrompts, updatedItem, ...otherItems];
            });
            setSelectedItem(null);

        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
            // Even if it fails, close the modal
            setSelectedItem(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefinePrompt = async (prompt: Prompt, framework: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const refinedBody = await refinePromptBody(prompt, framework);
            const updatedPrompt = { ...prompt, body: refinedBody, updatedAt: new Date().toISOString() };
            setItems(prev => prev.map(i => i.id === prompt.id ? updatedPrompt : i));
            setSelectedItem(updatedPrompt); // Keep modal open with updated content
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to refine prompt.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleUpdateItem = (updatedItem: Item) => {
        setItems(items => items.map(item => item.id === updatedItem.id ? {...updatedItem, updatedAt: new Date().toISOString()} : item));
    };


    const toggleTag = useCallback((tag: string) => {
        setActiveTags(prev => {
            const newTags = new Set(prev);
            if (newTags.has(tag)) {
                newTags.delete(tag);
            } else {
                newTags.add(tag);
            }
            return newTags;
        });
    }, []);

    const clearFilters = useCallback(() => {
        setActiveTags(new Set());
    }, []);

    const closeModal = () => setSelectedItem(null);

    return (
        <div className="min-h-screen bg-black font-sans">
            <Header onQuickAdd={() => setQuickAddOpen(true)} />
            <main className="container mx-auto px-4 py-8">
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    activeKind={activeKind}
                    setActiveKind={setActiveKind}
                    activeFilterCount={activeTags.size}
                    onFiltersClick={() => setFiltersOpen(true)}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    itemCount={filteredItems.length}
                />
                
                {error && (
                    <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md mb-6" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                
                {isLoading && (
                     <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="flex flex-col items-center gap-4">
                            <LoadingSpinner className="w-12 h-12" />
                            <p className="text-lg text-zinc-300">Gemini is thinking...</p>
                        </div>
                    </div>
                )}

                <ItemList items={filteredItems} onSelectItem={setSelectedItem} onTagClick={toggleTag} />
            </main>

            <QuickAddModal
                isOpen={isQuickAddOpen}
                onClose={() => setQuickAddOpen(false)}
                onSubmit={handleQuickAdd}
                isLoading={isLoading}
            />

            <FiltersModal
                isOpen={isFiltersOpen}
                onClose={() => setFiltersOpen(false)}
                allTags={allTags}
                activeTags={activeTags}
                toggleTag={toggleTag}
                clearFilters={clearFilters}
            />

            {selectedItem?.kind === 'prompt' && (
                <PromptDetailModal
                    isOpen={!!selectedItem}
                    onClose={closeModal}
                    prompt={selectedItem}
                    onUpdate={handleUpdateItem}
                    onRefine={handleRefinePrompt}
                    refinementFrameworks={REFINEMENT_FRAMEWORKS}
                    isLoading={isLoading}
                />
            )}
            
            {selectedItem?.kind === 'bookmark' && (
                <BookmarkDetailModal
                    isOpen={!!selectedItem}
                    onClose={closeModal}
                    bookmark={selectedItem}
                    onDistill={handleDistillBookmark}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
};

export default App;