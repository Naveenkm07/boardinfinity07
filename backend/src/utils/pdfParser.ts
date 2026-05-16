const pdf = require('pdf-parse');
import fs from 'fs';
import { AIService } from '../services/ai.service';

/**
 * Extract text from a PDF file.
 */
export async function extractTextFromPDF(filePath: string): Promise<string> {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
}

/**
 * Extract skills from text.
 * Uses Gemini AI for high-quality extraction, falls back to keyword matching.
 */
export async function extractSkillsAI(text: string): Promise<string[]> {
    try {
        const result = await AIService.scoreResume(text, "Extract all professional skills from this resume.");
        return result.matchedSkills || [];
    } catch (error) {
        console.warn('AI Skill extraction failed, falling back to keywords:', error);
        return extractSkills(text);
    }
}

/**
 * Extract skills from text using simple keyword matching.
 */
export function extractSkills(text: string): string[] {
    const commonSkills = [
        'javascript', 'typescript', 'react', 'node.js', 'express', 'mongodb', 'sql',
        'python', 'java', 'c++', 'c#', 'aws', 'docker', 'kubernetes', 'html', 'css',
        'tailwind', 'git', 'github', 'agile', 'scrum', 'rest api', 'graphql',
        'machine learning', 'data science', 'deep learning', 'nlp', 'pytorch', 'tensorflow',
        'tableau', 'power bi', 'excel', 'public speaking', 'leadership', 'teamwork'
    ];

    const foundSkills: string[] = [];
    const lowerText = text.toLowerCase();

    commonSkills.forEach(skill => {
        const regex = new RegExp(`\\b${skill.replace('.', '\\.')}\\b`, 'i');
        if (regex.test(lowerText)) {
            foundSkills.push(skill);
        }
    });

    return [...new Set(foundSkills)];
}
