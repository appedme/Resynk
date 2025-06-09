import { Plus, FileText, Calendar, MoreHorizontal, Search, Filter, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

// Mock data for resumes
const mockResumes = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    template: "Modern",
    lastModified: "2 hours ago",
    status: "draft",
    atsScore: 85,
    views: 12,
    favorite: true,
  },
  {
    id: "2",
    title: "Product Manager Resume",
    template: "Professional",
    lastModified: "1 day ago",
    status: "published",
    atsScore: 92,
    views: 28,
    favorite: false,
  },
  {
    id: "3",
    title: "UX Designer Portfolio",
    template: "Creative",
    lastModified: "3 days ago",
    status: "draft",
    atsScore: 78,
    views: 5,
    favorite: true,
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Resumes
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Manage and edit your professional resumes
            </p>
          </div>
          <Link href="/editor">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create New Resume
            </Button>
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search resumes..."
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                +1 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg ATS Score</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">
                +5% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">
                +12 from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Resumes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                Currently published
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Resume Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockResumes.map((resume) => (
            <Card key={resume.id} className="group hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{resume.title}</CardTitle>
                      {resume.favorite && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {resume.template} Template
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem>Share</DropdownMenuItem>
                      <DropdownMenuItem>Download</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                {/* Resume Preview Placeholder */}
                <div className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg h-48 mb-4 flex items-center justify-center">
                  <FileText className="w-12 h-12 text-gray-400" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={resume.status === "published" ? "default" : "secondary"}>
                      {resume.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {resume.lastModified}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        ATS Score:
                      </span>
                      <Badge
                        variant={resume.atsScore >= 80 ? "default" : "secondary"}
                        className={resume.atsScore >= 80 ? "bg-green-100 text-green-800" : ""}
                      >
                        {resume.atsScore}%
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">
                      {resume.views} views
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Link href={`/editor/${resume.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Edit
                      </Button>
                    </Link>
                    <Button variant="default" className="flex-1">
                      Preview
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State (if no resumes) */}
        {mockResumes.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No resumes yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Create your first resume to get started with Resynk
            </p>
            <Link href="/editor">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Resume
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
