
import { Item } from './types';

export const INITIAL_ITEMS: Item[] = [
    {
        id: 'prompt-1',
        kind: 'prompt',
        title: 'Generate a blog post outline',
        body: 'Create a detailed blog post outline for the topic "{{topic}}". The target audience is {{audience}}, and the desired tone is {{tone}}. The outline should include an introduction, 3-5 main sections with sub-bullets, and a conclusion.',
        variables: ['topic', 'audience', 'tone'],
        tags: ['writing', 'blogging', 'content-creation'],
        createdAt: '2023-10-26T10:00:00Z',
        updatedAt: '2023-10-26T12:00:00Z',
        model: 'gemini-2.5-pro'
    },
    {
        id: 'bookmark-1',
        kind: 'bookmark',
        title: 'Google AI for Developers',
        url: 'https://ai.google.dev/',
        tags: ['ai', 'google', 'docs', 'gemini'],
        favicon: 'https://www.google.com/s2/favicons?domain=ai.google.dev&sz=128',
        createdAt: '2023-10-25T14:00:00Z',
        updatedAt: '2023-10-25T14:00:00Z'
    },
    {
        id: 'note-1',
        kind: 'note',
        title: 'Idea for new app feature',
        body: 'What if we used the URL Context tool from the Gemini API to automatically summarize and categorize bookmarks? This could be a game-changer for knowledge management.',
        tags: ['ideas', 'feature', 'gemini-api'],
        createdAt: '2023-10-24T09:30:00Z',
        updatedAt: '2023-10-24T09:30:00Z'
    },
    {
        id: 'prompt-2',
        kind: 'prompt',
        title: 'Dave Clark Cinematic Layout',
        body: `Generate a cinematic visual description using the Dave Clark method.\n\nSCENE:\n{{scene_description}}\n\nSHOT 1:\n- Camera Angle: \n- Lens: \n- Movement: \n- Subject: \n- Action:`,
        variables: ['scene_description'],
        tags: ['creative', 'writing', 'film', 'dave-clark'],
        createdAt: '2023-10-23T18:00:00Z',
        updatedAt: '2023-10-23T18:00:00Z',
    },
];

export const REFINEMENT_FRAMEWORKS = [
    'Okay/Better/Best',
    'Dave Clark Cinematic',
    'Problem/Agitate/Solve (PAS)',
    'Feature/Advantage/Benefit (FAB)',
    'Add more specific details',
    'Make it more concise',
];
