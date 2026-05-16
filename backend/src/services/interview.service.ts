import { Interview, IInterviewDocument, InterviewStatus, InterviewType } from '../models/interview.model';
import { AIService } from './ai.service';
import { ApiError } from '../utils/ApiError';

export class InterviewService {
    /**
     * Start a new interview.
     */
    static async startInterview(studentId: string, type: InterviewType, topic: string): Promise<IInterviewDocument> {
        // Close any existing active interviews for this student
        await Interview.updateMany({ studentId, status: 'active' }, { status: 'completed' });

        const firstQuestion = await AIService.generateInterviewResponse(type, topic, [
            { role: 'system', content: `Start the ${type} interview about ${topic}.` }
        ]);

        const interview = await Interview.create({
            studentId,
            type,
            topic,
            status: 'active',
            messages: [
                { role: 'assistant', content: firstQuestion, timestamp: new Date() }
            ]
        });

        return interview;
    }

    /**
     * Process a new message from the student.
     */
    static async sendMessage(interviewId: string, studentId: string, content: string) {
        const interview = await Interview.findOne({ _id: interviewId, studentId });
        if (!interview) {
            throw ApiError.notFound('Interview not found');
        }

        if (interview.status === 'completed') {
            throw ApiError.badRequest('Interview is already completed');
        }

        // Add user message
        interview.messages.push({ role: 'user', content, timestamp: new Date() });

        // Generate AI response
        const aiResponse = await AIService.generateInterviewResponse(
            interview.type,
            interview.topic || 'General',
            interview.messages.map(m => ({ role: m.role, content: m.content }))
        );

        // Add AI response
        interview.messages.push({ role: 'assistant', content: aiResponse, timestamp: new Date() });

        // Check if the interview should conclude (based on AI response keywords or length)
        if (aiResponse.toLowerCase().includes('concluded') || 
            aiResponse.toLowerCase().includes('thank you') || 
            interview.messages.length > 15) {
            interview.status = 'completed';
            
            // In a real app, you'd call another AI method to evaluate the whole transcript
            interview.score = Math.floor(Math.random() * (95 - 65 + 1) + 65); // Mock score
            interview.feedback = "You handled the questions well. Focus more on articulating your thought process clearly and using specific examples from your projects.";
        }

        await interview.save();
        
        return {
            response: aiResponse,
            status: interview.status,
            score: interview.score,
            feedback: interview.feedback
        };
    }

    /**
     * Get student's interview history.
     */
    static async getStudentInterviews(studentId: string) {
        return Interview.find({ studentId }).sort({ createdAt: -1 });
    }

    /**
     * Get single interview details.
     */
    static async getInterviewById(interviewId: string, studentId: string) {
        const interview = await Interview.findOne({ _id: interviewId, studentId });
        if (!interview) {
            throw ApiError.notFound('Interview not found');
        }
        return interview;
    }
}
