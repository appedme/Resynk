"use client";

import { useState } from "react";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  TrendingUp,
  Target,
  Zap,
  Award,
  Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ATSAnalyzer, type ATSAnalysisResult } from "@/lib/ats-analyzer";
import Link from "next/link";

export default function ATSCalculatorPage() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<ATSAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');

  const analyzeResume = () => {
    if (!resumeText.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis delay for better UX
    setTimeout(() => {
      const result = ATSAnalyzer.analyzeResume(resumeText, jobDescription);
      setAnalysis(result);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setResumeText(text);
        setActiveTab('analyze');
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Resynk</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/editor">
                <Button>Create Resume</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Free ATS Resume Scanner
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Get instant feedback on how well your resume will perform with Applicant Tracking Systems. 
            Our AI-powered scanner analyzes your resume and provides actionable recommendations to improve your chances of getting noticed.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">95%</div>
              <div className="text-sm text-gray-600">Accuracy Rate</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">50K+</div>
              <div className="text-sm text-gray-600">Resumes Analyzed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">Free</div>
              <div className="text-sm text-gray-600">No Registration</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">Instant</div>
              <div className="text-sm text-gray-600">Results</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Resume</TabsTrigger>
            <TabsTrigger value="analyze">Analyze & Results</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Upload Your Resume</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Drop your resume here or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Supports: .txt files (copy paste from PDF/Word)
                  </p>
                  <Input
                    type="file"
                    accept=".txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <Label htmlFor="resume-upload">
                    <Button variant="outline" className="cursor-pointer">
                      Choose File
                    </Button>
                  </Label>
                </div>

                {/* Manual Text Input */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="resume-text" className="text-base font-medium">
                      Or paste your resume text here:
                    </Label>
                    <Textarea
                      id="resume-text"
                      placeholder="Paste your complete resume text here..."
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      className="min-h-[200px] mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="job-description" className="text-base font-medium">
                      Job Description (Optional - for better keyword matching):
                    </Label>
                    <Textarea
                      id="job-description"
                      placeholder="Paste the job description you're applying for to get targeted keyword analysis..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="min-h-[120px] mt-2"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={() => setActiveTab('analyze')} 
                    disabled={!resumeText.trim()}
                    size="lg"
                  >
                    Continue to Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analyze" className="space-y-6">
            {!analysis ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Button 
                    onClick={analyzeResume}
                    disabled={!resumeText.trim() || isAnalyzing}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Analyzing Resume...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Analyze My Resume
                      </>
                    )}
                  </Button>
                  {!resumeText.trim() && (
                    <p className="text-sm text-gray-500 mt-2">
                      Please upload or paste your resume text first
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Overall Score */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <Award className="w-5 h-5" />
                        <span>ATS Compatibility Score</span>
                      </span>
                      <Badge className={`${getScoreBadgeColor(analysis.overallScore)} text-white text-lg px-3 py-1`}>
                        {analysis.overallScore}%
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Progress value={analysis.overallScore} className="h-3" />
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${getScoreColor(analysis.keywordMatch)}`}>
                            {analysis.keywordMatch}%
                          </div>
                          <div className="text-sm text-gray-600">Keywords</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${getScoreColor(analysis.formatScore)}`}>
                            {analysis.formatScore}%
                          </div>
                          <div className="text-sm text-gray-600">Format</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${getScoreColor(analysis.contentScore)}`}>
                            {analysis.contentScore}%
                          </div>
                          <div className="text-sm text-gray-600">Content</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${getScoreColor(analysis.readabilityScore)}`}>
                            {analysis.readabilityScore}%
                          </div>
                          <div className="text-sm text-gray-600">Readability</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Issues */}
                {(analysis.issues.critical.length > 0 || analysis.issues.warnings.length > 0) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5" />
                        <span>Issues Found</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {analysis.issues.critical.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-red-600 mb-2 flex items-center">
                            <XCircle className="w-4 h-4 mr-1" />
                            Critical Issues
                          </h4>
                          <ul className="space-y-1">
                            {analysis.issues.critical.map((issue, index) => (
                              <li key={index} className="text-sm text-red-700 bg-red-50 p-2 rounded">
                                {issue}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {analysis.issues.warnings.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-yellow-600 mb-2 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Warnings
                          </h4>
                          <ul className="space-y-1">
                            {analysis.issues.warnings.map((issue, index) => (
                              <li key={index} className="text-sm text-yellow-700 bg-yellow-50 p-2 rounded">
                                {issue}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Keywords Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span>Found Keywords</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {analysis.foundKeywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-red-600">
                        <XCircle className="w-5 h-5" />
                        <span>Missing Keywords</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {analysis.missingKeywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="bg-red-100 text-red-800">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5" />
                      <span>Recommendations</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysis.recommendations.map((rec, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{rec.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                            </div>
                            <div className="ml-4 flex items-center space-x-2">
                              <Badge variant={getImpactColor(rec.impact)}>
                                {rec.impact} impact
                              </Badge>
                              <Badge variant="outline">
                                {rec.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Ready to optimize your resume?
                      </h3>
                      <p className="text-gray-600">
                        Use our professional resume builder to create an ATS-optimized resume that gets results.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/editor">
                          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            Build Optimized Resume
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="lg"
                          onClick={() => {
                            setAnalysis(null);
                            setActiveTab('upload');
                          }}
                        >
                          Analyze Another Resume
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-600">Advanced algorithms analyze your resume just like real ATS systems do.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Targeted Recommendations</h3>
              <p className="text-gray-600">Get specific, actionable advice to improve your ATS compatibility score.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Zap className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Instant Results</h3>
              <p className="text-gray-600">Get your ATS score and detailed feedback in seconds, not days.</p>
            </CardContent>
          </Card>
        </div>

        {/* Privacy Notice */}
        <Alert className="mt-8">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Privacy Guaranteed:</strong> Your resume is analyzed locally and never stored on our servers. 
            We respect your privacy and ensure your personal information remains secure.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
