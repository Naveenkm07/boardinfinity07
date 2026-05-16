'use client';

import React, { useState } from 'react';
import { editorService } from '../../../../services/editor.service';
import { TestCase, TestResult } from '../../../../types';

const LANGUAGES = ['javascript', 'python', 'java', 'cpp'];

const STARTER_CODE: Record<string, string> = {
    javascript: '// Write your solution here\nfunction solve(input) {\n  return input;\n}\n',
    python: '# Write your solution here\ndef solve(input):\n    return input\n',
    java: '// Write your solution here\npublic class Solution {\n    public static String solve(String input) {\n        return input;\n    }\n}\n',
    cpp: '// Write your solution here\n#include <iostream>\nusing namespace std;\n\nstring solve(string input) {\n    return input;\n}\n',
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
    const [activeTab, setActiveTab] = useState<'editor' | 'tests'>('editor');

    async function handleRun() {
        setRunning(true);
        try {
            const data = await editorService.runCode(code, language, testCases);
            setResults(data.results);
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
                            setLanguage(e.target.value);
                            setCode(STARTER_CODE[e.target.value] || '');
                        }}
                        className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                        onClick={handleRun}
                        disabled={running}
                        className="px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50 transition text-sm"
                    >
                        {running ? '⏳ Running...' : '▶ Run'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
                {/* Code Editor */}
                <div className="rounded-xl bg-gray-900 overflow-hidden shadow-xl flex flex-col">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-800">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <span className="text-gray-400 text-xs ml-2">{language}</span>
                    </div>
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-1 bg-gray-900 text-green-400 font-mono text-sm p-4 resize-none focus:outline-none min-h-[400px]"
                        spellCheck={false}
                        placeholder="Write your code here..."
                    />
                </div>

                {/* Test Cases + Results */}
                <div className="rounded-xl bg-white border border-gray-100 shadow-lg overflow-hidden flex flex-col">
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('tests')}
                            className={`flex-1 py-3 text-sm font-medium transition ${activeTab === 'tests' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'
                                }`}
                        >
                            Test Cases
                        </button>
                        <button
                            onClick={() => setActiveTab('editor')}
                            className={`flex-1 py-3 text-sm font-medium transition ${activeTab === 'editor' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'
                                }`}
                        >
                            Results {results.length > 0 && `(${results.filter((r) => r.passed).length}/${results.length})`}
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        {activeTab === 'tests' ? (
                            <div className="space-y-3">
                                {testCases.map((tc, i) => (
                                    <div key={i} className="p-3 rounded-lg bg-gray-50 space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium text-gray-500">Test Case {i + 1}</span>
                                            {testCases.length > 1 && (
                                                <button onClick={() => removeTestCase(i)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            value={tc.input}
                                            onChange={(e) => updateTestCase(i, 'input', e.target.value)}
                                            placeholder="Input"
                                            className="w-full px-3 py-1.5 rounded border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        />
                                        <input
                                            type="text"
                                            value={tc.expected}
                                            onChange={(e) => updateTestCase(i, 'expected', e.target.value)}
                                            placeholder="Expected output"
                                            className="w-full px-3 py-1.5 rounded border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        />
                                    </div>
                                ))}
                                <button
                                    onClick={addTestCase}
                                    className="w-full py-2 rounded-lg border-2 border-dashed border-gray-200 text-sm text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition"
                                >
                                    + Add Test Case
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {results.length === 0 ? (
                                    <p className="text-center py-10 text-gray-400 text-sm">Run your code to see results.</p>
                                ) : (
                                    results.map((r, i) => (
                                        <div
                                            key={i}
                                            className={`p-3 rounded-lg border ${r.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
                                        >
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium">{r.passed ? '✅' : '❌'} Test {r.testCase}</span>
                                                <span className="text-gray-400">{r.executionTime}ms</span>
                                            </div>
                                            <div className="mt-1 text-xs text-gray-500">
                                                <p>Input: {r.input}</p>
                                                <p>Expected: {r.expected}</p>
                                                <p>Got: {r.actual}</p>
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
