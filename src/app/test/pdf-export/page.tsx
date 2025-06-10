"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, CheckCircle, AlertCircle, TestTube } from 'lucide-react';
import { ColorUtils } from '@/lib/color-utils';
import { toast } from 'sonner';

export default function PDFExportTestPage() {
    const [testResults, setTestResults] = useState<{ [key: string]: boolean }>({});
    const [isTestingPDF, setIsTestingPDF] = useState(false);

    const runColorTests = () => {
        console.log('=== Running Color Conversion Tests ===');
        const results: { [key: string]: boolean } = {};

        // Test 1: OKLCH color conversion
        try {
            const oklchResult = ColorUtils.toHex('oklch(0.5 0.2 180)');
            results['oklch'] = oklchResult.startsWith('#') && oklchResult.length === 7;
            console.log('OKLCH test:', oklchResult, results['oklch']);
        } catch (error) {
            results['oklch'] = false;
            console.error('OKLCH test failed:', error);
        }

        // Test 2: CSS variable handling
        try {
            const varResult = ColorUtils.toHex('var(--primary-color)', '#2563eb');
            results['cssVar'] = varResult === '#2563eb';
            console.log('CSS Variable test:', varResult, results['cssVar']);
        } catch (error) {
            results['cssVar'] = false;
            console.error('CSS Variable test failed:', error);
        }

        // Test 3: Style sanitization
        try {
            const styleResult = ColorUtils.sanitizeStyleColors('color: oklch(0.5 0.2 180); background: linear-gradient(45deg, red, blue);');
            results['styleSanitization'] = !styleResult.includes('oklch') && !styleResult.includes('linear-gradient');
            console.log('Style sanitization test:', styleResult, results['styleSanitization']);
        } catch (error) {
            results['styleSanitization'] = false;
            console.error('Style sanitization test failed:', error);
        }

        // Test 4: PDF-safe CSS generation
        try {
            const pdfCSS = ColorUtils.generatePDFSafeCSS('#2563eb', '#6b7280');
            results['pdfCSS'] = pdfCSS.includes('[data-resume-preview]') && pdfCSS.includes('!important');
            console.log('PDF CSS generation test:', pdfCSS.length > 0, results['pdfCSS']);
        } catch (error) {
            results['pdfCSS'] = false;
            console.error('PDF CSS generation test failed:', error);
        }

        setTestResults(results);

        const passedTests = Object.values(results).filter(Boolean).length;
        const totalTests = Object.keys(results).length;

        if (passedTests === totalTests) {
            toast.success(`All ${totalTests} color conversion tests passed!`, {
                description: 'Color utilities are working correctly for PDF export.'
            });
        } else {
            toast.warning(`${passedTests}/${totalTests} color conversion tests passed`, {
                description: 'Some tests failed. Check console for details.'
            });
        }
    };

    const testPDFExport = async () => {
        setIsTestingPDF(true);
        try {
            const testElement = document.querySelector('[data-test-resume]') as HTMLElement;
            if (!testElement) {
                throw new Error('Test resume element not found');
            }

            // Simulate the PDF export process
            const safePrimaryColor = ColorUtils.toHex('#2563eb');
            const pdfSafeCSS = ColorUtils.generatePDFSafeCSS(safePrimaryColor);

            // Create temporary style
            const tempStyle = document.createElement('style');
            tempStyle.textContent = pdfSafeCSS;
            document.head.appendChild(tempStyle);

            // Test color sanitization on actual elements
            const allElements = testElement.querySelectorAll('*');
            let sanitizedCount = 0;

            allElements.forEach((el) => {
                const htmlEl = el as HTMLElement;
                const style = htmlEl.getAttribute('style');
                if (style) {
                    const sanitizedStyle = ColorUtils.sanitizeStyleColors(style, safePrimaryColor);
                    if (sanitizedStyle !== style) {
                        sanitizedCount++;
                    }
                }
            });

            // Clean up
            document.head.removeChild(tempStyle);

            toast.success('PDF export simulation completed!', {
                description: `Processed ${allElements.length} elements, sanitized ${sanitizedCount} styles.`
            });

        } catch (error) {
            console.error('PDF export test failed:', error);
            toast.error('PDF export test failed', {
                description: error instanceof Error ? error.message : 'Unknown error'
            });
        } finally {
            setIsTestingPDF(false);
        }
    };

    const TestResult = ({ name, passed }: { name: string; passed?: boolean }) => (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">{name}</span>
            {passed !== undefined && (
                <div className="flex items-center gap-2">
                    {passed ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <Badge variant={passed ? "default" : "destructive"}>
                        {passed ? "PASS" : "FAIL"}
                    </Badge>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-gray-900">PDF Export Test Suite</h1>
                    <p className="text-xl text-gray-600">
                        Comprehensive testing for resume PDF export functionality
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Color Conversion Tests */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TestTube className="w-5 h-5" />
                                Color Conversion Tests
                            </CardTitle>
                            <CardDescription>
                                Test the ColorUtils functionality for handling problematic colors
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button onClick={runColorTests} className="w-full">
                                Run Color Tests
                            </Button>

                            <div className="space-y-2">
                                <TestResult name="OKLCH Color Conversion" passed={testResults['oklch']} />
                                <TestResult name="CSS Variable Handling" passed={testResults['cssVar']} />
                                <TestResult name="Style Sanitization" passed={testResults['styleSanitization']} />
                                <TestResult name="PDF-Safe CSS Generation" passed={testResults['pdfCSS']} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* PDF Export Simulation */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Download className="w-5 h-5" />
                                PDF Export Simulation
                            </CardTitle>
                            <CardDescription>
                                Test the complete PDF export process with sample content
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button
                                onClick={testPDFExport}
                                disabled={isTestingPDF}
                                className="w-full"
                            >
                                {isTestingPDF ? 'Testing...' : 'Test PDF Export'}
                            </Button>

                            <div className="text-sm text-gray-600">
                                This will simulate the PDF export process without actually creating a PDF file.
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Test Resume Sample */}
                <Card>
                    <CardHeader>
                        <CardTitle>Test Resume Sample</CardTitle>
                        <CardDescription>
                            Sample resume content with problematic colors for testing
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div
                            data-test-resume
                            className="bg-white p-8 rounded-lg shadow-sm space-y-6"
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white'
                            }}
                        >
                            <div className="space-y-2">
                                <h1
                                    className="text-3xl font-bold"
                                    style={{ color: 'oklch(0.9 0.1 120)' }}
                                >
                                    John Doe
                                </h1>
                                <p
                                    className="text-lg"
                                    style={{ color: 'var(--primary-color, #2563eb)' }}
                                >
                                    Senior Software Engineer
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h2
                                        className="text-xl font-semibold mb-2"
                                        style={{ color: 'oklch(0.8 0.2 240)' }}
                                    >
                                        Experience
                                    </h2>
                                    <div
                                        className="p-4 rounded-lg"
                                        style={{
                                            background: 'var(--card-background, rgba(255, 255, 255, 0.1))',
                                            borderColor: 'oklch(0.7 0.15 180)'
                                        }}
                                    >
                                        <h3 className="font-semibold">Tech Lead - Example Corp</h3>
                                        <p style={{ color: 'hsl(220, 100%, 80%)' }}>
                                            Led a team of 5 developers in building scalable web applications.
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h2
                                        className="text-xl font-semibold mb-2"
                                        style={{ color: 'oklch(0.8 0.2 300)' }}
                                    >
                                        Skills
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge
                                            style={{
                                                background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                                                color: 'white'
                                            }}
                                        >
                                            React
                                        </Badge>
                                        <Badge
                                            style={{
                                                background: 'var(--accent-color, #10b981)',
                                                color: 'oklch(1 0 0)'
                                            }}
                                        >
                                            TypeScript
                                        </Badge>
                                        <Badge
                                            style={{
                                                background: 'hsl(260, 100%, 60%)',
                                                color: 'white'
                                            }}
                                        >
                                            Node.js
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Instructions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Testing Instructions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 text-sm text-gray-600">
                            <div>
                                <strong>1. Color Conversion Tests:</strong> Run these tests to verify that our ColorUtils
                                can properly convert OKLCH colors, handle CSS variables, sanitize styles, and generate PDF-safe CSS.
                            </div>
                            <div>
                                <strong>2. PDF Export Simulation:</strong> This simulates the complete PDF export process
                                on the sample resume content above, which contains various problematic color formats.
                            </div>
                            <div>
                                <strong>3. Expected Results:</strong> All tests should pass, indicating that the PDF export
                                functionality can handle modern CSS color formats and convert them to PDF-compatible formats.
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
