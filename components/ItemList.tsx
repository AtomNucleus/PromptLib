import React from 'react';
import { Item } from '../types';
import { ItemCard } from './ItemCard';

interface ItemListProps {
    items: Item[];
    onSelectItem: (item: Item) => void;
    onTagClick: (tag: string) => void;
}

export const ItemList: React.FC<ItemListProps> = ({ items, onSelectItem, onTagClick }) => {
    if (items.length === 0) {
        return (
            <div className="text-center py-16 px-6 bg-zinc-900/50 rounded-lg border border-dashed border-zinc-800">
                <h2 className="text-2xl font-semibold text-zinc-400">No Items Found</h2>
                <p className="text-zinc-500 mt-2">Try adjusting your search or filters.</p>
                 <p className="text-zinc-500 mt-4 text-sm">You can also use the <kbd className="font-sans bg-zinc-700 text-zinc-300 rounded-md px-1.5 py-0.5 text-xs border-b-2 border-zinc-600">Quick Add</kbd> button to create new prompts from an idea.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
                <ItemCard key={item.id} item={item} onSelect={() => onSelectItem(item)} onTagClick={onTagClick} />
            ))}
        </div>
    );
};