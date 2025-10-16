
export type ItemKind = 'note' | 'prompt' | 'bookmark';

export interface BaseItem {
    id: string;
    kind: ItemKind;
    title: string;
    body?: string;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
    source?: Record<string, any>;
}

export interface Note extends BaseItem {
    kind: 'note';
}

export interface Bookmark extends BaseItem {
    kind: 'bookmark';
    url: string;
    favicon?: string;
}

export interface Prompt extends BaseItem {
    kind: 'prompt';
    body: string;
    variables?: string[];
    model?: string;
}

export type Item = Note | Bookmark | Prompt;

export interface GeneratedPrompt {
    title: string;
    body: string;
    variables: string[];
    tags: string[];
}
