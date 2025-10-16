import React from 'react';
import { Item, Prompt, Bookmark, Note } from '../types';
import { NoteIcon, PromptIcon, BookmarkIcon, LinkIcon } from './icons';
import { Tag } from './Tag';

interface ItemCardProps {
    item: Item;
    onSelect: () => void;
    onTagClick: (tag: string) => void;
}

const CardContent: React.FC<{ item: Item }> = ({ item }) => {
    switch (item.kind) {
        case 'prompt':
            const prompt = item as Prompt;
            return (
                <p className="text-zinc-400 text-sm line-clamp-3">{prompt.body}</p>
            );
        case 'note':
            const note = item as Note;
            return (
                <p className="text-zinc-400 text-sm line-clamp-3">{note.body}</p>
            );
        case 'bookmark':
            const bookmark = item as Bookmark;
            return (
                <div className="flex items-center gap-2 text-emerald-400 text-sm truncate">
                    <LinkIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{bookmark.url}</span>
                </div>
            );
        default:
            return null;
    }
};

const CardIcon: React.FC<{ kind: Item['kind'] }> = ({ kind }) => {
    const iconProps = { className: "w-5 h-5" };
    switch (kind) {
        case 'prompt': return <PromptIcon {...iconProps} />;
        case 'note': return <NoteIcon {...iconProps} />;
        case 'bookmark': return <BookmarkIcon {...iconProps} />;
        default: return null;
    }
};

export const ItemCard: React.FC<ItemCardProps> = ({ item, onSelect, onTagClick }) => {
    const { kind, title, tags, updatedAt } = item;

    const getBorderColor = () => {
        switch(kind) {
            case 'prompt': return 'hover:border-emerald-500';
            case 'bookmark': return 'hover:border-violet-500';
            case 'note': return 'hover:border-amber-500';
            default: return 'hover:border-zinc-500';
        }
    }
    
    const handleTagClick = (e: React.MouseEvent, tag: string) => {
        e.stopPropagation(); // Prevent card selection when clicking a tag
        onTagClick(tag);
    };

    return (
        <div
            onClick={onSelect}
            className={`bg-zinc-900 rounded-lg p-5 flex flex-col justify-between cursor-pointer border border-zinc-800 transition-all duration-200 hover:shadow-lg hover:shadow-black/50 hover:-translate-y-1 ${getBorderColor()}`}
        >
            <div>
                <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-zinc-100 pr-4">{title}</h3>
                    <div className="flex-shrink-0 text-zinc-400">
                      <CardIcon kind={kind} />
                    </div>
                </div>
                <div className="mb-4">
                    <CardContent item={item} />
                </div>
            </div>
            <div>
                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {tags.slice(0, 3).map(tag => <Tag key={tag} label={tag} onClick={() => onTagClick(tag)} />)}
                    </div>
                )}
                <p className="text-xs text-zinc-500">Updated {new Date(updatedAt).toLocaleDateString()}</p>
            </div>
        </div>
    );
};