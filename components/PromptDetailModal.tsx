import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Prompt } from '../types';
import { SparklesIcon, LoadingSpinner } from './icons';
import { VariableInput } from './VariableInput';

interface PromptDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    prompt: Prompt;
    onUpdate: (prompt: Prompt) => void;
    onRefine: (prompt: Prompt, framework: string) => Promise<void>;
    refinementFrameworks: string[];
    isLoading: boolean;
}

export const PromptDetailModal: React.FC<PromptDetailModalProps> = ({ isOpen, onClose, prompt, onUpdate, onRefine, refinementFrameworks, isLoading }) => {
    const [editablePrompt, setEditablePrompt] = useState<Prompt>(prompt);
    const [selectedFramework, setSelectedFramework] = useState(refinementFrameworks[0]);
    
    useEffect(() => {
        setEditablePrompt(prompt);
    }, [prompt]);

    const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newBody = e.target.value;
        const newVariables = Array.from(newBody.matchAll(/{{(.*?)}}/g)).map(match => match[1]);
        setEditablePrompt(p => ({ ...p, body: newBody, variables: [...new Set(newVariables)] }));
    };

    const handleRefineClick = () => {
        onRefine(editablePrompt, selectedFramework);
    }
    
    const handleSaveChanges = () => {
        onUpdate(editablePrompt);
        onClose();
    }
    
    return (
        <Modal isOpen={isOpen} onClose={handleSaveChanges} title={editablePrompt.title}>
            <div className="space-y-6">
                <div>
                    <label htmlFor="prompt-body" className="block text-sm font-medium text-zinc-300 mb-1">
                        Prompt Body
                    </label>
                    <textarea
                        id="prompt-body"
                        rows={10}
                        value={editablePrompt.body}
                        onChange={handleBodyChange}
                        className="w-full bg-zinc-950 text-zinc-200 placeholder-zinc-500 border border-zinc-700 rounded-md px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none font-mono text-sm"
                    />
                </div>

                {editablePrompt.variables && editablePrompt.variables.length > 0 && (
                     <div>
                        <h3 className="text-sm font-medium text-zinc-300 mb-2">Variables</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-950 p-4 rounded-md">
                            {editablePrompt.variables.map(variable => (
                                <VariableInput 
                                    key={variable} 
                                    name={variable}
                                    promptBody={editablePrompt.body}
                                />
                            ))}
                        </div>
                    </div>
                )}
                
                <div>
                    <h3 className="text-sm font-medium text-zinc-300 mb-2">AI Refinement</h3>
                    <div className="flex gap-2 items-stretch bg-zinc-950 p-3 rounded-md">
                         <select
                            value={selectedFramework}
                            onChange={(e) => setSelectedFramework(e.target.value)}
                            className="bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none flex-grow"
                        >
                            {refinementFrameworks.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                        <button
                            onClick={handleRefineClick}
                            disabled={isLoading}
                            className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-zinc-700 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <LoadingSpinner className="w-5 h-5"/>
                            ) : (
                                <SparklesIcon className="w-5 h-5"/>
                            )}
                            <span>Refine</span>
                        </button>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-zinc-800">
                     <button
                        onClick={handleSaveChanges}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                       Save & Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};
