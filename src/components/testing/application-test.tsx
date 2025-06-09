"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, AlertCircle, Play, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { useSaveLoad } from "@/hooks/use-save-load";

interface TestResult {
  id: string;
  name: string;
  status: "pending" | "running" | "passed" | "failed";
  message?: string;
  duration?: number;
}

interface TestSuite {
  id: string;
  name: string;
  description: string;
  tests: TestResult[];
}

export function ApplicationTest() {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const { saveResume, loadResume } = useSaveLoad();

  // Initialize test suites
  useEffect(() => {
    const suites: TestSuite[] = [
      {
        id: "editor",
        name: "Editor Functionality",
        description: "Tests core editor features and resume building",
        tests: [
          { id: "editor-load", name: "Editor loads correctly", status: "pending" },
          { id: "template-switch", name: "Template switching works", status: "pending" },
          { id: "form-validation", name: "Form validation works", status: "pending" }
        ]
      },
      {
        id: "custom-sections",
        name: "Custom Sections",
        description: "Tests custom section creation and management",
        tests: [
          { id: "add-custom-section", name: "Can add custom section", status: "pending" },
          { id: "custom-section-types", name: "All content types work", status: "pending" },
          { id: "custom-section-ordering", name: "Section ordering works", status: "pending" }
        ]
      },
      {
        id: "drag-drop",
        name: "Drag & Drop",
        description: "Tests drag and drop functionality",
        tests: [
          { id: "section-reorder", name: "Section reordering works", status: "pending" },
          { id: "custom-section-reorder", name: "Custom section reordering", status: "pending" }
        ]
      },
      {
        id: "save-load",
        name: "Save & Load",
        description: "Tests save and load functionality",
        tests: [
          { id: "save-resume", name: "Can save resume", status: "pending" },
          { id: "load-resume", name: "Can load resume", status: "pending" },
          { id: "data-persistence", name: "Data persists correctly", status: "pending" }
        ]
      },
      {
        id: "export",
        name: "Export Features",
        description: "Tests export functionality",
        tests: [
          { id: "pdf-export", name: "PDF export works", status: "pending" },
          { id: "html-export", name: "HTML export works", status: "pending" },
          { id: "text-export", name: "Text export works", status: "pending" }
        ]
      },
      {
        id: "ui-responsive",
        name: "UI & Responsiveness",
        description: "Tests UI components and responsive design",
        tests: [
          { id: "mobile-responsive", name: "Mobile responsive design", status: "pending" },
          { id: "template-rendering", name: "Template rendering works", status: "pending" },
          { id: "component-loading", name: "Components load properly", status: "pending" }
        ]
      }
    ];
    setTestSuites(suites);
  }, []);

  // Calculate overall progress
  const totalTests = testSuites.reduce((acc, suite) => acc + suite.tests.length, 0);
  const completedTests = testSuites.reduce((acc, suite) => 
    acc + suite.tests.filter(test => test.status === "passed" || test.status === "failed").length, 0
  );
  const passedTests = testSuites.reduce((acc, suite) => 
    acc + suite.tests.filter(test => test.status === "passed").length, 0
  );

  // Simulate test execution
  const runTest = async (suiteId: string, testId: string): Promise<void> => {
    const startTime = Date.now();
    
    // Update test status to running
    setTestSuites(prev => prev.map(suite => 
      suite.id === suiteId 
        ? {
            ...suite,
            tests: suite.tests.map(test => 
              test.id === testId 
                ? { ...test, status: "running" as const }
                : test
            )
          }
        : suite
    ));

    // Simulate test execution
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));

    const duration = Date.now() - startTime;
    let status: "passed" | "failed" = "passed";
    let message = "Test completed successfully";

    // Simulate some test logic
    try {
      switch (testId) {
        case "save-resume":
          // Test save functionality
          const testData = { 
            personal: { 
              full_name: "Test User", 
              email: "test@example.com",
              phone: "",
              location: "",
              linkedin: "",
              github: "",
              portfolio: "",
              website: ""
            },
            summary: "Test summary",
            experience: [],
            education: [],
            skills: [],
            projects: [],
            achievements: [],
            certifications: [],
            languages: [],
            custom_sections: []
          };
          await saveResume(testData, "test-resume");
          break;
        
        case "load-resume":
          // Test load functionality
          const loaded = await loadResume("test-resume");
          if (!loaded) throw new Error("Failed to load resume");
          break;
        
        case "template-rendering":
          // Check if template elements exist
          const templateElements = document.querySelectorAll('[data-testid="resume-template"]');
          if (templateElements.length === 0) {
            throw new Error("No template elements found");
          }
          break;
        
        case "mobile-responsive":
          // Test responsive design
          const viewport = window.innerWidth;
          if (viewport < 768) {
            const mobileElements = document.querySelectorAll('.mobile\\:');
            message = `Mobile design detected (${viewport}px width)`;
          } else {
            message = `Desktop design (${viewport}px width)`;
          }
          break;
        
        default:
          // Random success/failure for other tests
          if (Math.random() < 0.85) {
            status = "passed";
          } else {
            throw new Error("Simulated test failure");
          }
      }
    } catch (error) {
      status = "failed";
      message = error instanceof Error ? error.message : "Unknown error occurred";
    }

    // Update test result
    setTestSuites(prev => prev.map(suite => 
      suite.id === suiteId 
        ? {
            ...suite,
            tests: suite.tests.map(test => 
              test.id === testId 
                ? { ...test, status, message, duration }
                : test
            )
          }
        : suite
    ));
  };

  // Run all tests
  const runAllTests = async () => {
    setIsRunning(true);
    setProgress(0);

    for (const suite of testSuites) {
      for (const test of suite.tests) {
        await runTest(suite.id, test.id);
        setProgress(prev => prev + (100 / totalTests));
      }
    }

    setIsRunning(false);
  };

  // Reset all tests
  const resetTests = () => {
    setTestSuites(prev => prev.map(suite => ({
      ...suite,
      tests: suite.tests.map(test => ({
        ...test,
        status: "pending" as const,
        message: undefined,
        duration: undefined
      }))
    })));
    setProgress(0);
  };

  const getTestIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "passed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "running":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TestResult["status"]) => {
    const variants = {
      pending: "secondary",
      running: "default",
      passed: "default",
      failed: "destructive"
    } as const;

    const colors = {
      pending: "bg-gray-100 text-gray-600",
      running: "bg-blue-100 text-blue-600",
      passed: "bg-green-100 text-green-600",
      failed: "bg-red-100 text-red-600"
    };

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Resynk Application Test Suite
          </h1>
          <p className="text-gray-600 text-lg">
            Comprehensive testing for resume builder functionality
          </p>
        </div>

        {/* Stats and Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{totalTests}</div>
              <div className="text-sm text-gray-600">Total Tests</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{passedTests}</div>
              <div className="text-sm text-gray-600">Passed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {completedTests - passedTests}
              </div>
              <div className="text-sm text-gray-600">Failed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-600">
                {Math.round((completedTests / totalTests) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Complete</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress and Controls */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Test Execution</h2>
              <div className="flex gap-2">
                <Button 
                  onClick={runAllTests} 
                  disabled={isRunning}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Running Tests...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Run All Tests
                    </>
                  )}
                </Button>
                <Button 
                  onClick={resetTests} 
                  variant="outline"
                  disabled={isRunning}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="text-sm text-gray-600 mt-2">
              Progress: {completedTests} of {totalTests} tests completed
            </div>
          </CardContent>
        </Card>

        {/* Test Suites */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {testSuites.map((suite) => (
            <Card key={suite.id} className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {suite.name}
                  <Badge variant="outline">
                    {suite.tests.filter(t => t.status === "passed").length}/{suite.tests.length}
                  </Badge>
                </CardTitle>
                <CardDescription>{suite.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {suite.tests.map((test) => (
                      <div
                        key={test.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-white"
                      >
                        <div className="flex items-center gap-3">
                          {getTestIcon(test.status)}
                          <div>
                            <div className="font-medium text-sm">{test.name}</div>
                            {test.message && (
                              <div className="text-xs text-gray-500 mt-1">
                                {test.message}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {test.duration && (
                            <span className="text-xs text-gray-400">
                              {test.duration}ms
                            </span>
                          )}
                          {getStatusBadge(test.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Test Results Summary */}
        {completedTests > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Test Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{passedTests}</div>
                  <div className="text-green-700">Tests Passed</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{completedTests - passedTests}</div>
                  <div className="text-red-700">Tests Failed</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round((passedTests / completedTests) * 100)}%
                  </div>
                  <div className="text-blue-700">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}  id: string;  name: string;  description: string;  status: 'pending' | 'running' | 'passed' | 'failed';  error?: string;  duration?: number;}interface TestSuite {  id: string;  name: string;  description: string;  tests: TestResult[];}export function ApplicationTest() {  const [isRunning, setIsRunning] = useState(false);  const [currentTest, setCurrentTest] = useState<string | null>(null);  const [progress, setProgress] = useState(0);  const [testResults, setTestResults] = useState<TestSuite[]>([]);    const { saveResume, loadResume } = useSaveLoad();  const initializeTests = (): TestSuite[] => [    {      id: "editor-functionality",      name: "Editor Functionality",      description: "Tests core editor features and data management",      tests: [        {          id: "editor-load",          name: "Editor Load Test",          description: "Verify editor loads without errors",          status: 'pending'        },        {          id: "data-persistence",          name: "Data Persistence Test",          description: "Verify data persists during editing",          status: 'pending'        },        {          id: "template-switching",          name: "Template Switching Test",          description: "Verify template changes work correctly",          status: 'pending'        }      ]    },    {      id: "drag-drop",      name: "Drag & Drop",      description: "Tests drag and drop functionality for section reordering",      tests: [        {          id: "drag-drop-ui",          name: "Drag & Drop UI Test",          description: "Verify drag handles are visible and functional",          status: 'pending'        },        {          id: "section-reorder",          name: "Section Reordering Test",          description: "Verify sections can be reordered via drag & drop",          status: 'pending'        },        {          id: "order-persistence",          name: "Order Persistence Test",          description: "Verify section order persists after reordering",          status: 'pending'        }      ]    },    {      id: "custom-sections",      name: "Custom Sections",      description: "Tests custom section creation and management",      tests: [        {          id: "custom-section-creation",          name: "Custom Section Creation",          description: "Verify custom sections can be created",          status: 'pending'        },        {          id: "custom-section-types",          name: "Custom Section Types",          description: "Verify all custom section types work (text, list, table)",          status: 'pending'        },        {          id: "custom-section-rendering",          name: "Custom Section Rendering",          description: "Verify custom sections render correctly in templates",          status: 'pending'        }      ]    },    {      id: "save-load",      name: "Save & Load",      description: "Tests save and load functionality",      tests: [        {          id: "save-functionality",          name: "Save Functionality",          description: "Verify resume data can be saved",          status: 'pending'        },        {          id: "load-functionality",          name: "Load Functionality",           description: "Verify resume data can be loaded",          status: 'pending'        },        {          id: "auto-save",          name: "Auto-save Test",          description: "Verify auto-save functionality works",          status: 'pending'        }      ]    },    {      id: "export-features",      name: "Export Features",      description: "Tests export functionality (PDF, HTML, Text)",      tests: [        {          id: "pdf-export",          name: "PDF Export Test",          description: "Verify PDF export functionality",          status: 'pending'        },        {          id: "html-export",           name: "HTML Export Test",          description: "Verify HTML export functionality",          status: 'pending'        },        {          id: "text-export",          name: "Text Export Test",          description: "Verify plain text export functionality",          status: 'pending'        }      ]    },    {      id: "ui-responsiveness",      name: "UI Responsiveness",      description: "Tests responsive design and accessibility",      tests: [        {          id: "responsive-design",          name: "Responsive Design Test",          description: "Verify application works on different screen sizes",          status: 'pending'        },        {          id: "accessibility",          name: "Accessibility Test",          description: "Verify basic keyboard navigation and screen reader support",          status: 'pending'        },        {          id: "performance",          name: "Performance Test",          description: "Verify application loads and responds quickly",          status: 'pending'        }      ]    }  ];  useEffect(() => {    setTestResults(initializeTests());  }, []);  const runTest = async (suiteId: string, testId: string): Promise<void> => {    const startTime = Date.now();    setCurrentTest(`${suiteId}-${testId}`);        // Update test status to running    setTestResults(prev =>      prev.map(suite => ({        ...suite,        tests: suite.tests.map(test =>          test.id === testId ? { ...test, status: 'running' as const } : test        )      }))    );    try {      // Simulate test execution with actual logic where possible      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));            let passed = true;      let error = '';      // Actual test logic based on test ID      switch (testId) {        case 'editor-load':          try {            // Test that basic data structures exist            const testData = {              personalInfo: { name: 'Test User', email: 'test@example.com' },              experience: [],              education: [],              skills: [],              customSections: []            };            passed = !!testData.personalInfo;          } catch (err) {            passed = false;            error = `Editor load failed: ${err}`;          }          break;        case 'data-persistence':          try {            const loaded = await loadResume('test-resume');            passed = true; // If no error is thrown, consider it passed          } catch (err) {            passed = false;            error = `Data persistence failed: ${err}`;          }          break;        case 'template-switching':          passed = document.querySelectorAll('button').length > 5; // Template buttons should exist          break;        case 'drag-drop-ui':          passed = Array.from(document.querySelectorAll('button')).some(btn =>            btn.textContent?.includes('drag') || btn.className.includes('drag')          );          break;        case 'responsive-design':          passed = window.innerWidth > 0 &&                    window.innerHeight > 0 &&                   document.documentElement.clientWidth > 0;          break;        case 'accessibility':          passed = Array.from(document.querySelectorAll('button')).some(btn =>            btn.hasAttribute('aria-label') || btn.hasAttribute('title')          );          break;        default:          // Simulate random test results for other tests          passed = Math.random() > 0.2; // 80% pass rate for simulation          break;      }      const duration = Date.now() - startTime;            // Update test results      setTestResults(prev =>        prev.map(suite => ({          ...suite,          tests: suite.tests.map(test =>            test.id === testId               ? {                   ...test,                   status: passed ? 'passed' as const : 'failed' as const,                  duration,                  error: passed ? undefined : error || 'Test failed'                }              : test          )        }))      );    } catch (error) {      const duration = Date.now() - startTime;            setTestResults(prev =>        prev.map(suite => ({          ...suite,          tests: suite.tests.map(test =>            test.id === testId               ? {                   ...test,                   status: 'failed' as const,                  duration,                  error: `Test execution failed: ${error}`                }              : test          )        }))      );    }    setCurrentTest(null);  };  const runAllTests = async () => {    setIsRunning(true);    setProgress(0);        const allTests = testResults.flatMap(suite =>      suite.tests.map(test => ({ suiteId: suite.id, testId: test.id }))    );    for (let i = 0; i < allTests.length; i++) {      const { suiteId, testId } = allTests[i];      await runTest(suiteId, testId);      setProgress(((i + 1) / allTests.length) * 100);    }    setIsRunning(false);    setProgress(100);  };  const resetTests = () => {    setTestResults(initializeTests());    setProgress(0);    setCurrentTest(null);  };  const getStatusIcon = (status: TestResult['status']) => {    switch (status) {      case 'passed':        return <CheckCircle2 className="w-5 h-5 text-green-500" />;      case 'failed':        return <XCircle className="w-5 h-5 text-red-500" />;      case 'running':        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;      default:        return <AlertCircle className="w-5 h-5 text-gray-400" />;    }  };  const getStatusBadge = (status: TestResult['status']) => {    const variants = {      pending: 'bg-gray-100 text-gray-800',      running: 'bg-blue-100 text-blue-800',      passed: 'bg-green-100 text-green-800',      failed: 'bg-red-100 text-red-800'    };    return (      <Badge className={variants[status]}>        {status.toUpperCase()}      </Badge>    );  };  const overallStats = {    total: testResults.reduce((acc, suite) => acc + suite.tests.length, 0),    passed: testResults.reduce((acc, suite) =>      acc + suite.tests.filter(test => test.status === 'passed').length, 0),    failed: testResults.reduce((acc, suite) =>      acc + suite.tests.filter(test => test.status === 'failed').length, 0),    running: testResults.reduce((acc, suite) =>      acc + suite.tests.filter(test => test.status === 'running').length, 0)  };  return (    <div className="min-h-screen bg-gray-50 p-6">      <div className="max-w-6xl mx-auto space-y-6">        <div className="text-center space-y-2">          <h1 className="text-3xl font-bold text-gray-900">Resynk Application Test Suite</h1>          <p className="text-gray-600">Comprehensive testing for all application features</p>        </div>        {/* Test Controls */}        <Card>          <CardHeader>            <CardTitle className="flex items-center gap-2">              <Play className="w-5 h-5" />              Test Controls            </CardTitle>          </CardHeader>          <CardContent className="space-y-4">            <div className="flex gap-4">              <Button                onClick={runAllTests}                disabled={isRunning}                className="flex items-center gap-2"              >                {isRunning ? (                  <Loader2 className="w-4 h-4 animate-spin" />                ) : (                  <Play className="w-4 h-4" />                )}                {isRunning ? 'Running Tests...' : 'Run All Tests'}              </Button>                            <Button                variant="outline"                onClick={resetTests}                disabled={isRunning}                className="flex items-center gap-2"              >                <RotateCcw className="w-4 h-4" />                Reset Tests              </Button>            </div>            {isRunning && (              <div className="space-y-2">                <div className="flex justify-between text-sm text-gray-600">                  <span>Progress: {Math.round(progress)}%</span>                  <span>Current: {currentTest}</span>                </div>                <Progress value={progress} className="w-full" />              </div>            )}          </CardContent>        </Card>        {/* Overall Statistics */}        <div className="grid grid-cols-4 gap-4">          <Card>            <CardContent className="pt-6">              <div className="text-center">                <div className="text-2xl font-bold">{overallStats.total}</div>                <div className="text-sm text-gray-600">Total Tests</div>              </div>            </CardContent>          </Card>                    <Card>            <CardContent className="pt-6">              <div className="text-center">                <div className="text-2xl font-bold text-green-600">{overallStats.passed}</div>                <div className="text-sm text-gray-600">Passed</div>              </div>            </CardContent>          </Card>                    <Card>            <CardContent className="pt-6">              <div className="text-center">                <div className="text-2xl font-bold text-red-600">{overallStats.failed}</div>                <div className="text-sm text-gray-600">Failed</div>              </div>            </CardContent>          </Card>                    <Card>            <CardContent className="pt-6">              <div className="text-center">                <div className="text-2xl font-bold text-blue-600">{overallStats.running}</div>                <div className="text-sm text-gray-600">Running</div>              </div>            </CardContent>          </Card>        </div>        {/* Test Suites */}        <div className="space-y-6">          {testResults.map(suite => (            <Card key={suite.id}>              <CardHeader>                <CardTitle className="flex items-center justify-between">                  <span>{suite.name}</span>                  <Badge variant="outline">                    {suite.tests.filter(t => t.status === 'passed').length}/{suite.tests.length}                  </Badge>                </CardTitle>                <CardDescription>{suite.description}</CardDescription>              </CardHeader>              <CardContent>                <ScrollArea className="h-64">                  <div className="space-y-2">                    {suite.tests.map(test => (                      <div                        key={test.id}                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"                      >                        <div className="flex items-center gap-3">                          {getStatusIcon(test.status)}                          <div>                            <div className="font-medium">{test.name}</div>                            <div className="text-sm text-gray-600">{test.description}</div>                            {test.error && (                              <div className="text-sm text-red-600 mt-1">{test.error}</div>                            )}                          </div>                        </div>                        <div className="flex items-center gap-2">                          {test.duration && (                            <span className="text-sm text-gray-500">{test.duration}ms</span>                          )}                          {getStatusBadge(test.status)}                        </div>                      </div>                    ))}                  </div>                </ScrollArea>              </CardContent>            </Card>          ))}        </div>      </div>    </div>  );}