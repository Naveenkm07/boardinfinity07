import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY || '');

/**
 * AI Service for Gemini integrations.
 */
export class AIService {
    /**
     * Compare a resume against a job description and return a match score and analysis.
     */
    static async scoreResume(resumeText: string, jobDescription: string): Promise<any> {
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

            const prompt = `
                You are an expert ATS (Applicant Tracking System) and Technical Recruiter.
                Analyze the following Resume against the Job Description.
                
                RESUME:
                ${resumeText}
                
                JOB DESCRIPTION:
                ${jobDescription}
                
                Provide your analysis in EXACTLY the following JSON format:
                {
                    "score": number (0-100),
                    "matchReason": "string (brief summary of why this score was given)",
                    "missingSkills": ["skill1", "skill2"],
                    "strengths": ["strength1", "strength2"],
                    "suggestions": ["suggestion1", "suggestion2"]
                }
                
                Only return the JSON object. Do not include any other text or markdown formatting.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            const jsonStr = text.replace(/```json|```/g, '').trim();
            return JSON.parse(jsonStr);
        } catch (error) {
            console.error('Gemini Score Error:', error);
            throw new Error('Failed to analyze resume with AI');
        }
    }

    /**
     * Provide a coding hint without giving the full solution.
     */
    static async getCodingHint(problemStatement: string, currentCode: string, language: string): Promise<string> {
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

            const prompt = `
                You are a coding mentor. A student is working on the following problem:
                
                PROBLEM:
                ${problemStatement}
                
                CURRENT CODE (${language}):
                ${currentCode}
                
                Provide a small, helpful hint to guide the student towards the solution.
                - DO NOT give the full solution or large code blocks.
                - Focus on the logic or a specific syntax they might be missing.
                - Keep it encouraging.
                - Keep the hint under 3 sentences.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (error) {
            console.error('Gemini Hint Error:', error);
            throw new Error('Failed to get AI hint');
        }
    }

    /**
     * Generate the next response in an interview session.
     */
    static async generateInterviewResponse(
        type: string,
        topic: string,
        history: { role: string; content: string }[]
    ): Promise<string> {
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

            const systemPrompt = `
                You are an expert technical and HR recruiter at a top tech company.
                Your goal is to conduct a mock ${type} interview with a student on the topic of "${topic}".

                RULES:
                1. Ask one clear and concise question at a time.
                2. If the user provides an answer, acknowledge it briefly and then ask the next follow-up or a new question.
                3. Keep the tone professional, slightly challenging, but encouraging.
                4. Do not provide the answers yourself unless the user specifically asks for feedback.
                5. If you think the interview has covered enough ground (after ~5-7 questions), thank the user and tell them the interview is concluded.
            `;

            const prompt = `
                ${systemPrompt}

                INTERVIEW HISTORY:
                ${history.map(h => `${h.role.toUpperCase()}: ${h.content}`).join('\n')}

                Continue the interview by asking the next question or acknowledging the last answer.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (error) {
            console.error('Gemini Interview Error:', error);
            throw new Error('Failed to generate interview response');
        }
    }

    /**
     * Generate a personalized learning path based on current and missing skills.
     */
    static async generateLearningPath(currentSkills: string[], missingSkills: string[]): Promise<string> {
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

            const prompt = `
                You are a career development coach. 
                
                Current Student Skills: ${currentSkills.join(', ')}
                Required/Missing Skills in the Market: ${missingSkills.slice(0, 10).join(', ')}
                
                Based on this, generate a concise and personalized learning path (max 5 steps).
                - Suggest specific areas to focus on.
                - Recommend the type of projects or certifications that would bridge the gap.
                - Keep it under 200 words.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (error) {
            console.error('Gemini Learning Path Error:', error);
            return "Unable to generate a learning path at this moment. Focus on learning common industry skills like SQL, Cloud, and Advanced Frameworks.";
        }
    }
}
