"use client";

import { useState } from "react";
import { Edit2, Save, X } from "lucide-react";

interface InlineEditIndicatorProps {
    isEditing: boolean;
    isHovering: boolean;
    onSave?: () => void;
    onCancel?: () => void;
    position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
}

export function InlineEditIndicator({
    isEditing,
    isHovering,
    onSave,
    onCancel,
    position = 'top-right'
}: InlineEditIndicatorProps) {
    if (!isEditing && !isHovering) return null;

    const positionClasses = {
        'top-right': 'top-0 right-0',
        'bottom-right': 'bottom-0 right-0',
        'top-left': 'top-0 left-0',
        'bottom-left': 'bottom-0 left-0'
    };

    return (
        <div className={`absolute ${positionClasses[position]} flex gap-1 bg-white border border-gray-200 rounded shadow-lg p-1 z-10`}>
            {isEditing ? (
                <>
                    <button
                        onClick={onSave}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        title="Save changes (Enter)"
                    >
                        <Save size={12} />
                    </button>
                    <button
                        onClick={onCancel}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Cancel editing (Escape)"
                    >
                        <X size={12} />
                    </button>
                </>
            ) : (
                <div className="p-1 text-blue-600" title="Click to edit">
                    <Edit2 size={12} />
                </div>
            )}
        </div>
    );
}

interface InlineEditWrapperProps {
    children: React.ReactNode;
    isEditing: boolean;
    onClick?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
    className?: string;
}

export function InlineEditWrapper({
    children,
    isEditing,
    onClick,
    onSave,
    onCancel,
    className = ""
}: InlineEditWrapperProps) {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <div
            className={`relative inline-block ${className} ${isEditing ? 'ring-2 ring-blue-300' : ''}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={onClick}
        >
            {children}
            <InlineEditIndicator
                isEditing={isEditing}
                isHovering={isHovering}
                onSave={onSave}
                onCancel={onCancel}
            />
        </div>
    );
}
