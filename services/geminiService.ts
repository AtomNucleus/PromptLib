
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedPrompt, Prompt } from "../types";

// IMPORTANT: Replace with your actual API key, ideally from environment variables.
// For this example, we'll use a placeholder and show a warning if it's not set.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn(
        "Gemini API key not found. Please set the API_KEY environment variable. Using mock data."
    );
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });
const model = "gemini-2.5-pro";

// Utility function to extract variables from a string like {{variable}}
const extractVariables = (text: string): string[] => {
    const matches = text.match(/{{(.*?)}}/g);
    if (!matches) {
        return [];
    }
    // Return unique variable names without the curly braces
    return [...new Set(matches.map(v => v.replace(/{{|}}/g, '')))];
};

// Helper to extract JSON from a string, potentially with markdown fences
const extractJson = (text: string): any => {
    const match = text.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = match ? match[1] : text;
    try {
        return JSON.parse(jsonString.trim());
    } catch (error) {
        console.error("Failed to parse JSON from Gemini response:", jsonString);
        throw new Error("Received invalid JSON from the Gemini API.");
    }
};


export const composePromptsFromIdea = async (idea: string): Promise<Prompt[]> => {
    if (!API_KEY) {
        // Return mock data if API key is not available
        return [
            { id: crypto.randomUUID(), kind: 'prompt', title: 'Mock: Social Media Post', body: `Create a social media post about ${idea} for {{platform}}.`, variables: ['platform'], tags: ['mock', 'social-media'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: crypto.randomUUID(), kind: 'prompt', title: 'Mock: Blog Post Idea', body: `Write a blog post outline about the benefits of ${idea}. Target audience is {{audience}}.`, variables: ['audience'], tags: ['mock', 'blogging'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
        ];
    }
    
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: [{
                role: "user",
                parts: [{
                    text: [
                      `Turn this idea into 5 high-quality, reusable prompts.`,
                      `For each prompt, provide a concise title, a detailed body, and identify useful variables in the format {{variable}}.`,
                      `Also suggest 3-5 relevant tags for categorization.`,
                      `Ensure the prompt body is well-structured and guides the AI effectively.`,
                      `Seed Idea:\n${idea}`
                    ].join("\n")
                }]
            }],
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        prompts: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    body: { type: Type.STRING },
                                    tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                                },
                                required: ["title", "body", "tags"],
                            }
                        }
                    },
                    required: ["prompts"]
                }
            }
        });

        const result = JSON.parse(response.text);
        
        return result.prompts.map((p: any): Prompt => ({
            id: crypto.randomUUID(),
            kind: 'prompt',
            title: p.title,
            body: p.body,
            variables: extractVariables(p.body),
            tags: p.tags,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            source: { type: 'composer', idea: idea }
        }));

    } catch (error) {
        console.error("Error composing prompts:", error);
        throw new Error("Failed to generate prompts from Gemini API.");
    }
};

export const distillBookmarkFromUrl = async (url: string): Promise<{ summary: string; prompts: GeneratedPrompt[]; tags: string[] }> => {
    if (!API_KEY) {
        return {
            summary: "This is a mock summary of the URL. The Gemini API key is not configured.",
            prompts: [
                { title: "Mock: Explain this to a 5-year-old", body: "Explain the main concept of the page at the provided URL to a 5-year-old.", variables: [], tags: ["mock", "explain"] },
                { title: "Mock: Create a tweet thread", body: "Summarize the key takeaways from the URL in a 3-part tweet thread.", variables: [], tags: ["mock", "social-media"] }
            ],
            tags: ["mock", "distilled"]
        };
    }

    try {
         const prompt = `Based on the content found at the URL "${url}", perform the following tasks and respond ONLY with a single, valid JSON object that follows the specified schema. Do not include any other text, markdown formatting, or explanations outside of the JSON object.

Tasks:
1. Write a concise, insightful summary of the key ideas.
2. Suggest 3-5 relevant tags or keywords.
3. Generate 3 high-quality, reusable prompt ideas. For each prompt, provide a title and a body. Identify any variables using {{variable_name}} syntax.

JSON Schema:
{
  "summary": "string",
  "tags": ["string"],
  "prompts": [
    {
      "title": "string",
      "body": "string"
    }
  ]
}`;
        const response = await ai.models.generateContent({
            model: model,
            contents: [{
                role: 'user',
                parts: [{ text: prompt }]
            }],
            config: {
                tools: [{googleSearch: {}}],
            }
        });

        const result = extractJson(response.text);
        
        const promptsWithVars = result.prompts.map((p: any) => ({
             ...p,
             variables: extractVariables(p.body),
             tags: result.tags || []
        }));

        return {
            summary: result.summary,
            prompts: promptsWithVars,
            tags: result.tags
        };

    } catch (error) {
        console.error("Error distilling bookmark:", error);
        throw new Error("Failed to distill bookmark from Gemini API.");
    }
};

export const refinePromptBody = async (prompt: Prompt, framework: string): Promise<string> => {
     if (!API_KEY) {
        return `${prompt.body}\n\n---\n*Mock Refinement Applied: ${framework}*`;
    }

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: [{
                role: 'user',
                parts: [{
                    text: `Take the following prompt and refine it using the "${framework}" framework. Only return the refined prompt body, nothing else.\n\nOriginal Prompt:\n---\n${prompt.body}`
                }]
            }]
        });

        return response.text.trim();

    } catch (error) {
        console.error("Error refining prompt:", error);
        throw new Error("Failed to refine prompt with Gemini API.");
    }
};

export const generateVariableSuggestions = async (promptBody: string, variableName: string): Promise<string[]> => {
    if (!API_KEY) {
        return [
            `Mock suggestion 1 for ${variableName}`,
            `Mock suggestion 2 for ${variableName}`,
            `Mock suggestion 3 for ${variableName}`,
        ];
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{
                role: "user",
                parts: [{
                    text: [
                        `You are an AI assistant that helps create high-quality prompt variables.`,
                        `Analyze the following prompt template and suggest 5-7 creative and diverse options for the "{{${variableName}}}" variable.`,
                        `The suggestions should be concise and directly usable as values for the variable.`,
                        `\nPrompt Template:\n---\n${promptBody}\n---`,
                    ].join("\n")
                }]
            }],
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                                description: `A suggestion for the {{${variableName}}} variable.`
                            }
                        }
                    },
                    required: ["suggestions"]
                }
            }
        });

        const result = JSON.parse(response.text);
        return result.suggestions || [];

    } catch (error) {
        console.error(`Error generating suggestions for variable "${variableName}":`, error);
        throw new Error(`Failed to generate suggestions for {{${variableName}}}.`);
    }
};
