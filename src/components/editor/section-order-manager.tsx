"use client";

import { useState } from "react";
import { GripVertical, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  isVisible: boolean;
  isRequired: boolean;
  order: number;
}

interface SectionOrderManagerProps {
  sections: Section[];
  onSectionsChange: (sections: Section[]) => void;
}

export function SectionOrderManager({ sections, onSectionsChange }: SectionOrderManagerProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    setDraggedItem(sectionId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverItem(sectionId);
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e: React.DragEvent, targetSectionId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetSectionId) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const draggedSection = sections.find(s => s.id === draggedItem);
    const targetSection = sections.find(s => s.id === targetSectionId);
    
    if (!draggedSection || !targetSection) return;

    const reorderedSections = [...sections];
    const draggedIndex = reorderedSections.findIndex(s => s.id === draggedItem);
    const targetIndex = reorderedSections.findIndex(s => s.id === targetSectionId);

    // Remove dragged item
    reorderedSections.splice(draggedIndex, 1);
    
    // Insert at new position
    reorderedSections.splice(targetIndex, 0, draggedSection);

    // Update order numbers
    const updatedSections = reorderedSections.map((section, index) => ({
      ...section,
      order: index
    }));

    onSectionsChange(updatedSections);
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleVisibilityChange = (sectionId: string, isVisible: boolean) => {
    const updatedSections = sections.map(section =>
      section.id === sectionId ? { ...section, isVisible } : section
    );
    onSectionsChange(updatedSections);
  };

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Section Order & Visibility</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Drag sections to reorder them on your resume
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sortedSections.map((section) => (
            <div
              key={section.id}
              draggable={!section.isRequired}
              onDragStart={(e) => handleDragStart(e, section.id)}
              onDragOver={(e) => handleDragOver(e, section.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, section.id)}
              className={`
                flex items-center gap-3 p-3 rounded-lg border transition-all duration-200
                ${dragOverItem === section.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' : 'border-gray-200 dark:border-gray-700'}
                ${draggedItem === section.id ? 'opacity-50' : ''}
                ${section.isRequired ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800 cursor-move hover:bg-gray-50 dark:hover:bg-gray-700'}
              `}
            >
              {/* Drag Handle */}
              <div className={`${section.isRequired ? 'opacity-30' : 'opacity-60 hover:opacity-100'}`}>
                <GripVertical className="w-4 h-4 text-gray-400" />
              </div>

              {/* Section Info */}
              <div className="flex items-center gap-2 flex-1">
                {section.icon}
                <span className="text-sm font-medium">{section.title}</span>
                {section.isRequired && (
                  <Badge variant="secondary" className="text-xs">Required</Badge>
                )}
              </div>

              {/* Visibility Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVisibilityChange(section.id, !section.isVisible)}
                  disabled={section.isRequired}
                  className="h-8 w-8 p-0"
                >
                  {section.isVisible ? (
                    <Eye className="w-4 h-4 text-green-600" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            💡 <strong>Tip:</strong> Required sections cannot be reordered or hidden. 
            Drag non-required sections to change their order on your resume.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
