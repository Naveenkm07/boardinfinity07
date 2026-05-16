'use client';

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { editorService } from '../../../../services/editor.service';
import { TestCase, TestResult } from '../../../../types';

const LANGUAGES = ['javascript', 'python', 'java', 'cpp'];
const MONACO_LANGUAGES: Record<string, string> = {
    javascript: 'javascript',
    python: 'python',
    java: 'java',
    cpp: 'cpp',
};

const STARTER_CODE: Record<string, string> = {
    javascript: '// Write your solution here\nfunction solve(input) {\n  console.log(input);\n  return input;\n}\n',
    python: '# Write your solution here\ndef solve(input):\n    print(input)\n    return input\n',
    java: '// Write your solution here\npublic class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello");\n    }\n}\n',
    cpp: '// Write your solution here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello" << endl;\n    return 0;\n}\n',
};

export default function CodingPage() {
    const [code, setCode] = useState(STARTER_CODE.javascript);
    const [language, setLanguage] = useState('javascript');
    const [testCases, setTestCases] = useState<TestCase[]>([
        { input: 'hello', expected: 'hello' },
    ]);
    const [results, setResults] = useState<TestResult[]>([]);
    const [running, setRunning] = useState(false);
    const [saving, setSaving] = useState(false);
    const [hintLoading, setHintLoading] = useState(false);
    const [hint, setHint] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'editor' | 'tests'>('editor');

    async function handleRun() {
        setRunning(true);
        try {
            const data = await editorService.runCode(code, language, testCases);
            setResults(data.results);
            setActiveTab('editor');
        } catch (err) {
            console.error('Execution failed:', err);
        } finally {
            setRunning(false);
        }
    }

    async function handleSave() {
        setSaving(true);
        try {
            await editorService.saveCode(code, language, 'My Solution');
            alert('Code saved successfully!');
        } catch (err) {
            console.error('Save failed:', err);
        } finally {
            setSaving(false);
        }
    }

    async function handleGetHint() {
        setHintLoading(true);
        setHint(null);
        try {
            const aiHint = await editorService.getAiHint(code, language, 'Solve the coding problem efficiently.');
            setHint(aiHint);
        } catch (err) {
            console.error('Hint failed:', err);
            setHint('Could not get hint at this time.');
        } finally {
            setHintLoading(false);
        }
    }

    function addTestCase() {
        setTestCases([...testCases, { input: '', expected: '' }]);
    }

    function updateTestCase(index: number, field: keyof TestCase, value: string) {
        const updated = [...testCases];
        updated[index] = { ...updated[index], [field]: value };
        setTestCases(updated);
    }

    function removeTestCase(index: number) {
        setTestCases(testCases.filter((_, i) => i !== index));
    }

    return (
        <div className="space-y-4 h-[calc(100vh-8rem)]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Coding Practice</h1>
                <div className="flex items-center gap-3">
                    <select
                        value={language}
                        onChange={(e) => {
                            const newLang = e.target.value;
                            setLanguage(newLang);
                            setCode(STARTER_CODE[newLang] || '');
                        }}
                        className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                        {LANGUAGES.map((l) => (
                            <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 disabled:opacity-50 transition text-sm"
                    >
                        {saving ? 'Saving...' : '💾 Save'}
                    </button>
                    <button
                        onClick={handleGetHint}
                        disabled={hintLoading}
                        className="px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 font-medium hover:bg-indigo-200 disabled:opacity-50 transition text-sm flex items-center gap-2"
                    >
                        {hintLoading ? '✨ Thinking...' : '✨ Get Hint'}
                    </button>
                    <button
                        onClick={handleRun}
                        disabled={running}
                        className="px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50 transition text-sm"
                    >
                        {running ? '⏳ Running...' : '▶ Run'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full min-h-[500px]">
                {/* Code Editor */}
                <div className="rounded-xl bg-[#1e1e1e] overflow-hidden shadow-xl flex flex-col border border-gray-800">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-gray-800">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <span className="text-gray-400 text-xs ml-2 font-mono">{language}</span>
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        <Editor
                            height="100%"
                            language={MONACO_LANGUAGES[language]}
                            value={code}
                            theme="vs-dark"
                            onChange={(value) => setCode(value || '')}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                lineNumbers: 'on',
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                tabSize: 2,
                                padding: { top: 10, bottom: 10 },
                            }}
                        />
                    </div>
                </div>

                {/* Test Cases + Results */}
                <div className="rounded-xl bg-white border border-gray-100 shadow-lg overflow-hidden flex flex-col">
                    {hint && (
                        <div className="p-4 bg-indigo-50 border-b border-indigo-100 animate-in fade-in slide-in-from-top duration-300">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xs font-bold text-indigo-700 uppercase flex items-center gap-1">
                                    <span>✨ AI Mentor Hint</span>
                                </h3>
                                <button onClick={() => setHint(null)} className="text-indigo-400 hover:text-indigo-600">✕</button>
                            </div>
                            <p className="text-sm text-indigo-900 leading-relaxed italic">"{hint}"</p>
                        </div>
                    )}
                    <div className="flex border-b border-gray-200 bg-gray-50/50">
                        <button
                            onClick={() => setActiveTab('tests')}
                            className={`flex-1 py-3 text-sm font-medium transition ${activeTab === 'tests' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            Test Cases
                        </button>
                        <button
                            onClick={() => setActiveTab('editor')}
                            className={`flex-1 py-3 text-sm font-medium transition ${activeTab === 'editor' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            Results {results.length > 0 && `(${results.filter((r) => r.passed).length}/${results.length})`}
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        {activeTab === 'tests' ? (
                            <div className="space-y-4">
                                {testCases.map((tc, i) => (
                                    <div key={i} className="p-4 rounded-xl border border-gray-200 bg-white space-y-3 shadow-sm">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Test Case {i + 1}</span>
                                            {testCases.length > 1 && (
                                                <button onClick={() => removeTestCase(i)} className="p-1 text-gray-400 hover:text-red-500 transition">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-gray-700">Input</label>
                                            <input
                                                type="text"
                                                value={tc.input}
                                                onChange={(e) => updateTestCase(i, 'input', e.target.value)}
                                                placeholder="e.g. 1 2"
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-gray-700">Expected Output</label>
                                            <input
                                                type="text"
                                                value={tc.expected}
                                                onChange={(e) => updateTestCase(i, 'expected', e.target.value)}
                                                placeholder="e.g. 3"
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                            />
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={addTestCase}
                                    className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm font-medium text-gray-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all"
                                >
                                    + Add Test Case
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {results.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm">Run your code to see the results here</p>
                                    </div>
                                ) : (
                                    results.map((r, i) => (
                                        <div
                                            key={i}
                                            className={`p-4 rounded-xl border transition ${r.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
                                        >
                                            <div className="flex justify-between items-center mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${r.passed ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                                        {r.passed ? '✓' : '✕'}
                                                    </span>
                                                    <span className="font-semibold text-sm">Test Case {r.testCase}</span>
                                                </div>
                                                <span className="text-xs font-medium text-gray-500 bg-white/50 px-2 py-1 rounded border border-current opacity-60">
                                                    {r.executionTime}ms
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 gap-2 text-xs">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-gray-500 font-medium">Input:</span>
                                                    <code className="bg-white/50 p-2 rounded border border-gray-200">{r.input || '(empty)'}</code>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 mt-1">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-gray-500 font-medium">Expected:</span>
                                                        <code className="bg-white/50 p-2 rounded border border-gray-200">{r.expected}</code>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-gray-500 font-medium">Actual:</span>
                                                        <code className={`p-2 rounded border ${r.passed ? 'bg-green-100/50 border-green-200' : 'bg-red-100/50 border-red-200'}`}>{r.actual}</code>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
