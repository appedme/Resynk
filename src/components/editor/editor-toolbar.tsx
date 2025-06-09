"use client";

import { 
  Undo, 
  Redo, 
  ZoomIn, 
  ZoomOut, 
  Monitor, 
  Smartphone, 
  Maximize,
  Type,
  Palette,
  Layout,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface EditorToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  zoom: number;
  previewMode: 'desktop' | 'mobile';
  onPreviewModeChange: (mode: 'desktop' | 'mobile') => void;
  onFullPreview: () => void;
  isFullPreview: boolean;
  template: 'modern' | 'professional' | 'creative';
  onTemplateChange: (template: 'modern' | 'professional' | 'creative') => void;
  // Typography settings
  fontSize: number;
  fontFamily: string;
  onFontSizeChange: (size: number) => void;
  onFontFamilyChange: (family: string) => void;
  // Color theme settings
  primaryColor: string;
  secondaryColor: string;
  onPrimaryColorChange: (color: string) => void;
  onSecondaryColorChange: (color: string) => void;
  // Layout settings
  spacing: 'compact' | 'normal' | 'relaxed';
  pageMargins: 'narrow' | 'normal' | 'wide';
  onSpacingChange: (spacing: 'compact' | 'normal' | 'relaxed') => void;
  onPageMarginsChange: (margins: 'narrow' | 'normal' | 'wide') => void;
}

export function EditorToolbar({
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  zoom,
  previewMode,
  onPreviewModeChange,
  onFullPreview,
  isFullPreview,
  template,
  onTemplateChange,
  fontSize,
  fontFamily,
  onFontSizeChange,
  onFontFamilyChange,
  primaryColor,
  secondaryColor,
  onPrimaryColorChange,
  onSecondaryColorChange,
  spacing,
  pageMargins,
  onSpacingChange,
  onPageMarginsChange,
}: EditorToolbarProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            {/* Undo/Redo */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onUndo}>
                  <Undo className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Undo (Ctrl+Z)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onRedo}>
                  <Redo className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Redo (Ctrl+Y)</p>
              </TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6 mx-2" />

            {/* Zoom Controls */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onZoomOut}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom Out</p>
              </TooltipContent>
            </Tooltip>

            <Badge variant="outline" className="text-xs px-2">
              {zoom}%
            </Badge>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onZoomIn}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom In</p>
              </TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6 mx-2" />

            {/* Preview Mode Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-md p-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onPreviewModeChange('desktop')}
                    className="px-2 h-7"
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Desktop Preview</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onPreviewModeChange('mobile')}
                    className="px-2 h-7"
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mobile Preview</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <Separator orientation="vertical" className="h-6 mx-2" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onFullPreview}>
                  <Maximize className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isFullPreview ? 'Exit Full Preview' : 'Full Preview'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Right Side Tools */}
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Type className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium">Typography Settings</h4>
                      
                      <div className="space-y-2">
                        <Label htmlFor="font-family">Font Family</Label>
                        <Select value={fontFamily} onValueChange={onFontFamilyChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Inter">Inter</SelectItem>
                            <SelectItem value="Georgia">Georgia</SelectItem>
                            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                            <SelectItem value="Arial">Arial</SelectItem>
                            <SelectItem value="Helvetica">Helvetica</SelectItem>
                            <SelectItem value="Roboto">Roboto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="font-size">Font Size: {fontSize}px</Label>
                        <Slider
                          value={[fontSize]}
                          onValueChange={(value) => onFontSizeChange(value[0])}
                          max={18}
                          min={10}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </TooltipTrigger>
              <TooltipContent>
                <p>Typography Settings</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Palette className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium">Color Theme</h4>
                      
                      <div className="space-y-2">
                        <Label htmlFor="primary-color">Primary Color</Label>
                        <div className="flex gap-2">
                          {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'].map((color) => (
                            <button
                              key={color}
                              className={`w-8 h-8 rounded-full border-2 ${
                                primaryColor === color ? 'border-gray-800' : 'border-gray-300'
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => onPrimaryColorChange(color)}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="secondary-color">Secondary Color</Label>
                        <div className="flex gap-2">
                          {['#6B7280', '#374151', '#1F2937', '#111827', '#4B5563', '#9CA3AF'].map((color) => (
                            <button
                              key={color}
                              className={`w-8 h-8 rounded-full border-2 ${
                                secondaryColor === color ? 'border-gray-800' : 'border-gray-300'
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => onSecondaryColorChange(color)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </TooltipTrigger>
              <TooltipContent>
                <p>Color Theme</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Layout className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium">Layout Settings</h4>
                      
                      <div className="space-y-2">
                        <Label htmlFor="spacing">Section Spacing</Label>
                        <Select value={spacing} onValueChange={onSpacingChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="compact">Compact</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="relaxed">Relaxed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="margins">Page Margins</Label>
                        <Select value={pageMargins} onValueChange={onPageMarginsChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="narrow">Narrow</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="wide">Wide</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </TooltipTrigger>
              <TooltipContent>
                <p>Layout Settings</p>
              </TooltipContent>
            </Tooltip>

            {/* Template Selection */}
            <Select onValueChange={onTemplateChange} defaultValue={template} >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modern">
                  <FileText className="mr-2 w-4 h-4" />
                  Modern
                </SelectItem>
                <SelectItem value="professional">
                  <FileText className="mr-2 w-4 h-4" />
                  Professional
                </SelectItem>
                <SelectItem value="creative">
                  <FileText className="mr-2 w-4 h-4" />
                  Creative
                </SelectItem>
              </SelectContent>
            </Select>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
