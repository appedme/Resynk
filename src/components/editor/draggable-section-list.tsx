"use client";

import React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from "@/components/ui/button";
import { GripVertical, ChevronDown, ChevronRight } from "lucide-react";

interface SectionItem {
    id: string;
    title: string;
    icon: React.ReactNode;
    component: React.ReactNode;
    isRequired?: boolean;
}

interface SortableSectionItemProps {
    section: SectionItem;
    isActive: boolean;
    isExpanded: boolean;
    onSelect: (sectionId: string) => void;
    onToggle: (sectionId: string) => void;
}

function SortableSectionItem({
    section,
    isActive,
    isExpanded,
    onSelect,
    onToggle,
}: SortableSectionItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: section.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className={`${isDragging ? 'z-50' : ''}`}>
            <Button
                variant={isActive ? "default" : "ghost"}
                className="w-full justify-between h-10 pl-2"
                onClick={() => {
                    onSelect(section.id);
                    if (!isExpanded) {
                        onToggle(section.id);
                    }
                }}
            >
                <div className="flex items-center gap-2 flex-1">
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-move p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <GripVertical className="w-3 h-3 text-gray-400" />
                    </div>
                    {section.icon}
                    <span className="text-sm">{section.title}</span>
                    {section.isRequired && (
                        <span className="text-red-500 text-xs">*</span>
                    )}
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggle(section.id);
                    }}
                >
                    {isExpanded ? (
                        <ChevronDown className="w-3 h-3" />
                    ) : (
                        <ChevronRight className="w-3 h-3" />
                    )}
                </Button>
            </Button>
        </div>
    );
}

interface DraggableSectionListProps {
    sections: SectionItem[];
    activeSection: string;
    expandedSections: Set<string>;
    onSectionSelect: (sectionId: string) => void;
    onSectionToggle: (sectionId: string) => void;
    onSectionsReorder: (sections: SectionItem[]) => void;
}

export function DraggableSectionList({
    sections,
    activeSection,
    expandedSections,
    onSectionSelect,
    onSectionToggle,
    onSectionsReorder,
}: DraggableSectionListProps) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = sections.findIndex((section) => section.id === active.id);
            const newIndex = sections.findIndex((section) => section.id === over?.id);

            const reorderedSections = arrayMove(sections, oldIndex, newIndex);
            onSectionsReorder(reorderedSections);
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-1">
                    {sections.map((section) => (
                        <SortableSectionItem
                            key={section.id}
                            section={section}
                            isActive={activeSection === section.id}
                            isExpanded={expandedSections.has(section.id)}
                            onSelect={onSectionSelect}
                            onToggle={onSectionToggle}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
