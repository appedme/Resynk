"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface NewResumeDialogProps {
  onResumeCreated?: () => void;
}

export function NewResumeDialog({ onResumeCreated }: NewResumeDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const router = useRouter();

  const loadTemplates = async () => {
    if (templates.length > 0) return; // Already loaded
    
    setLoadingTemplates(true);
    try {
      const response = await fetch('/api/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      } else {
        toast.error('Failed to load templates');
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      loadTemplates();
    }
  };

  const createResume = async () => {
    if (!title.trim()) {
      toast.error('Please enter a resume title');
      return;
    }

    if (!selectedTemplate) {
      toast.error('Please select a template');
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          templateId: selectedTemplate,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Resume created successfully!');
        setOpen(false);
        setTitle("");
        setSelectedTemplate("");
        
        // Navigate to the editor with the new resume
        router.push(`/editor/${data.resume.id}`);
        
        // Call callback if provided
        if (onResumeCreated) {
          onResumeCreated();
        }
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create resume');
      }
    } catch (error) {
      console.error('Error creating resume:', error);
      toast.error('Failed to create resume');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create New Resume
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Resume</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Resume Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Resume Title</Label>
            <Input
              id="title"
              placeholder="e.g., Senior Frontend Developer Resume"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Template Selection */}
          <div className="space-y-3">
            <Label>Choose Template</Label>
            {loadingTemplates ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {templates.map((template) => (
                  <Card 
                    key={template.id} 
                    className={`cursor-pointer border-2 transition-colors ${
                      selectedTemplate === template.id 
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950' 
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-sm">{template.name}</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                            {template.description}
                          </p>
                          <span className="inline-block bg-gray-100 dark:bg-gray-800 text-xs px-2 py-1 rounded-full mt-2">
                            {template.category}
                          </span>
                        </div>
                        {selectedTemplate === template.id && (
                          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button 
              onClick={createResume}
              disabled={isCreating || !title.trim() || !selectedTemplate}
            >
              {isCreating ? 'Creating...' : 'Create Resume'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
