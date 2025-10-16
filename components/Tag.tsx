import React from 'react';

interface TagProps {
    label: string;
    onClick?: () => void;
    isActive?: boolean;
}

export const Tag: React.FC<TagProps> = ({ label, onClick, isActive }) => {
    const baseClasses = "text-xs font-medium px-2.5 py-1 rounded-full transition-colors duration-200";

    if (onClick) {
         const stateClasses = isActive
            ? 'bg-emerald-500 text-white'
            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300';

        return (
             <button onClick={onClick} className={`${baseClasses} ${stateClasses}`}>
                {label}
            </button>
        )
    }

    return (
        <span className="text-xs font-medium bg-zinc-800 text-zinc-300 px-2 py-1 rounded-md">
            {label}
        </span>
    );
};