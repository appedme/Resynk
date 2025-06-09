"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PersonalInfoEditorProps {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    summary: string;
  };
  onChange: (field: string, value: string) => void;
}

export function PersonalInfoEditor({ personalInfo, onChange }: PersonalInfoEditorProps) {

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="firstName" className="text-sm font-medium">
            First Name *
          </Label>
          <Input
            id="firstName"
            value={personalInfo.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            placeholder="John"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="lastName" className="text-sm font-medium">
            Last Name *
          </Label>
          <Input
            id="lastName"
            value={personalInfo.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            placeholder="Doe"
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email" className="text-sm font-medium">
          Email Address *
        </Label>
        <Input
          id="email"
          type="email"
          value={personalInfo.email}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="john.doe@example.com"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="phone" className="text-sm font-medium">
          Phone Number
        </Label>
        <Input
          id="phone"
          type="tel"
          value={personalInfo.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          placeholder="+1 (555) 123-4567"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="location" className="text-sm font-medium">
          Location
        </Label>
        <Input
          id="location"
          value={personalInfo.location}
          onChange={(e) => onChange('location', e.target.value)}
          placeholder="San Francisco, CA"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="website" className="text-sm font-medium">
          Website
        </Label>
        <Input
          id="website"
          type="url"
          value={personalInfo.website}
          onChange={(e) => onChange('website', e.target.value)}
          placeholder="https://yourwebsite.com"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="linkedin" className="text-sm font-medium">
          LinkedIn
        </Label>
        <Input
          id="linkedin"
          value={personalInfo.linkedin}
          onChange={(e) => onChange('linkedin', e.target.value)}
          placeholder="linkedin.com/in/johndoe"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="summary" className="text-sm font-medium">
          Professional Summary
        </Label>
        <Textarea
          id="summary"
          value={personalInfo.summary}
          onChange={(e) => onChange('summary', e.target.value)}
          placeholder="Write a brief professional summary that highlights your key skills and experience..."
          rows={4}
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">
          2-3 sentences that summarize your professional background and career objectives.
        </p>
      </div>
    </div>
  );
}
