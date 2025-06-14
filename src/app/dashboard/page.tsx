"use client";

import { useState, useEffect } from "react";
import { Plus, FileText, MoreHorizontal, Search, Star, Eye, Download, Share2, Copy, Trash2, Edit3, BarChart3, TrendingUp, Users, Clock, Grid, List, SortAsc, SortDesc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useUser } from "@stackframe/stack";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import Header from "@/components/header";
import { useRouter } from "next/navigation";
import { NewResumeDialog } from "@/components/editor/new-resume-dialog";

// Types
interface Resume {
  id: string;
  title: string;
  template: 'modern' | 'professional' | 'creative';
  lastModified: string;
  status: 'draft' | 'published' | 'archived';
  atsScore: number;
  views: number;
  downloads: number;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
  tags: string[];
}

interface DashboardStats {
  totalResumes: number;
  avgAtsScore: number;
  totalViews: number;
  totalDownloads: number;
  activeResumes: number;
  recentActivity: number;
}

// Mock data for resumes
const mockResumes: Resume[] = [
  {
    id: "1",
    title: "Senior Frontend Developer Resume",
    template: "modern",
    lastModified: "2 hours ago",
    status: "draft",
    atsScore: 85,
    views: 12,
    downloads: 3,
    favorite: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    tags: ["frontend", "react", "typescript"],
  },
  {
    id: "2",
    title: "Product Manager Resume",
    template: "professional",
    lastModified: "1 day ago",
    status: "published",
    atsScore: 92,
    views: 28,
    downloads: 8,
    favorite: false,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-19",
    tags: ["product", "management", "strategy"],
  },
  {
    id: "3",
    title: "UX Designer Portfolio",
    template: "creative",
    lastModified: "3 days ago",
    status: "draft",
    atsScore: 78,
    views: 5,
    downloads: 1,
    favorite: true,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-17",
    tags: ["design", "ux", "figma"],
  },
  {
    id: "4",
    title: "Marketing Specialist CV",
    template: "professional",
    lastModified: "1 week ago",
    status: "published",
    atsScore: 88,
    views: 15,
    downloads: 4,
    favorite: false,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-13",
    tags: ["marketing", "digital", "campaigns"],
  },
];

export default function Dashboard() {
  const user = useUser();
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>(mockResumes);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"lastModified" | "title" | "atsScore" | "views">("lastModified");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "published" | "archived">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);
  const [userResumes, setUserResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/handler/sign-in');
      return;
    }

    // Load user's resumes from database
    loadUserResumes();
  }, [user, router]);

  const loadUserResumes = async () => {
    if (!user) return;

    console.log('📊 Loading resumes for user:', user.id);

    try {
      const response = await fetch('/api/resumes');
      console.log('📡 API response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('📄 Resumes loaded:', data.resumes?.length || 0);
        setUserResumes(data.resumes || []);
      } else {
        const errorData = await response.text();
        console.error('❌ API error:', response.status, errorData);
        toast.error('Failed to load your resumes');
      }
    } catch (error) {
      console.error('💥 Failed to load resumes:', error);
      toast.error('Failed to load your resumes');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Use only user's actual resumes from database
  const displayResumes = userResumes;

  // Calculate dashboard stats
  const stats: DashboardStats = {
    totalResumes: displayResumes.length,
    avgAtsScore: displayResumes.length > 0 ? Math.round(displayResumes.reduce((acc, resume) => acc + resume.atsScore, 0) / displayResumes.length) : 0,
    totalViews: displayResumes.reduce((acc, resume) => acc + resume.views, 0),
    totalDownloads: displayResumes.reduce((acc, resume) => acc + resume.downloads, 0),
    activeResumes: displayResumes.filter(r => r.status === 'published').length,
    recentActivity: displayResumes.filter(r => {
      const lastModified = new Date(r.updatedAt);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - lastModified.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }).length,
  };

  // Filter and sort resumes
  const filteredResumes = displayResumes
    .filter(resume => {
      const matchesSearch = resume.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resume.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = filterStatus === "all" || resume.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue: string | number = a[sortBy];
      let bValue: string | number = b[sortBy];

      if (sortBy === "lastModified") {
        aValue = new Date(a.updatedAt).getTime();
        bValue = new Date(b.updatedAt).getTime();
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Handle resume actions
  const handleFavorite = (id: string) => {
    setResumes(resumes.map(resume =>
      resume.id === id ? { ...resume, favorite: !resume.favorite } : resume
    ));
    const resume = displayResumes.find(r => r.id === id);
    toast.success(resume?.favorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleDuplicate = (id: string) => {
    const original = displayResumes.find(r => r.id === id);
    if (original) {
      const duplicate: Resume = {
        ...original,
        id: Date.now().toString(),
        title: `${original.title} (Copy)`,
        status: "draft",
        views: 0,
        downloads: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        lastModified: "Just now",
      };
      setResumes([duplicate, ...resumes]);
      toast.success('Resume duplicated successfully');
    }
  };

  const handleShare = async (id: string) => {
    const shareUrl = `${window.location.origin}/resume/${id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard');
    } catch (error) {
      console.error('Failed to copy share link:', error);
      toast.error('Failed to copy share link');
    }
  };

  const handleDownload = (id: string) => {
    // This would typically trigger the export functionality
    toast.info(`Opening export options for resume ${id}...`);
    // In a real implementation, this would open the export dialog or redirect to editor with export mode
  };

  const handleDelete = (id: string) => {
    setResumeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (resumeToDelete) {
      setResumes(resumes.filter(r => r.id !== resumeToDelete));
      setResumeToDelete(null);
      toast.success('Resume deleted successfully');
    }
    setDeleteDialogOpen(false);
  };

  const getStatusColor = (status: Resume['status']) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAtsScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-blue-100 text-blue-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Manage your professional resumes and track their performance
                </p>
              </div>
              <div className="flex items-center gap-3">
                <NewResumeDialog onResumeCreated={loadUserResumes} />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalResumes}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline w-3 h-3 mr-1" />
                  +2 this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg ATS Score</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avgAtsScore}%</div>
                <Progress value={stats.avgAtsScore} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalViews}</div>
                <p className="text-xs text-muted-foreground">
                  +12 this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Downloads</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalDownloads}</div>
                <p className="text-xs text-muted-foreground">
                  +5 this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeResumes}</div>
                <p className="text-xs text-muted-foreground">
                  Currently active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.recentActivity}</div>
                <p className="text-xs text-muted-foreground">
                  Past 7 days
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search resumes by title or tags..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={(value: "all" | "draft" | "published" | "archived") => setFilterStatus(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: "lastModified" | "title" | "atsScore" | "views") => setSortBy(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lastModified">Last Modified</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="atsScore">ATS Score</SelectItem>
                  <SelectItem value="views">Views</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>

              <div className="border-l pl-2 flex gap-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Resume Grid/List */}
          {filteredResumes.length > 0 ? (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredResumes.map((resume) => (
                <Card key={resume.id} className={`group hover:shadow-lg transition-all duration-200 ${viewMode === "list" ? "flex" : ""}`}>
                  {viewMode === "grid" ? (
                    <>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg truncate">{resume.title}</CardTitle>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleFavorite(resume.id)}
                                className="p-1 h-auto"
                              >
                                <Star className={`w-4 h-4 ${resume.favorite ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                              </Button>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {resume.template.charAt(0).toUpperCase() + resume.template.slice(1)} Template
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {resume.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {resume.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{resume.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem asChild>
                                <Link href={`/editor/${resume.id}`}>
                                  <Edit3 className="w-4 h-4 mr-2" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicate(resume.id)}>
                                <Copy className="w-4 h-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleShare(resume.id)}>
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownload(resume.id)}>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(resume.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
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
                            <Badge className={getStatusColor(resume.status)}>
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
                              <Badge className={getAtsScoreColor(resume.atsScore)}>
                                {resume.atsScore}%
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {resume.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <Download className="w-3 h-3" />
                                {resume.downloads}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Link href={`/editor/${resume.id}`} className="flex-1">
                              <Button variant="outline" className="w-full">
                                <Edit3 className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                            </Link>
                            <Button variant="default" className="flex-1">
                              <Eye className="w-4 h-4 mr-1" />
                              Preview
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    // List view
                    <div className="flex items-center p-6 w-full">
                      <div className="flex-1 grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                        <div className="lg:col-span-2">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleFavorite(resume.id)}
                              className="p-1 h-auto"
                            >
                              <Star className={`w-4 h-4 ${resume.favorite ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                            </Button>
                            <div>
                              <h3 className="font-semibold">{resume.title}</h3>
                              <p className="text-sm text-gray-500">{resume.template} template</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <Badge className={getStatusColor(resume.status)}>
                            {resume.status}
                          </Badge>
                        </div>
                        <div>
                          <Badge className={getAtsScoreColor(resume.atsScore)}>
                            {resume.atsScore}%
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {resume.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {resume.downloads}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {resume.lastModified}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem asChild>
                            <Link href={`/editor/${resume.id}`}>
                              <Edit3 className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(resume.id)}>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShare(resume.id)}>
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(resume.id)}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(resume.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="text-center py-16">
              {searchQuery || filterStatus !== "all" ? (
                <>
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No resumes found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Try adjusting your search criteria or filters
                  </p>
                  <Button variant="outline" onClick={() => { setSearchQuery(""); setFilterStatus("all"); }}>
                    Clear filters
                  </Button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          )}

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your resume
                  and remove all associated data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  );
}
