import mongoose, { Document, Schema } from 'mongoose';

export type InterviewType = 'technical' | 'hr' | 'behavioral';
export type InterviewStatus = 'active' | 'completed';

export interface IMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}

export interface IInterviewDocument extends Document {
    studentId: mongoose.Types.ObjectId;
    type: InterviewType;
    topic?: string;
    status: InterviewStatus;
    messages: IMessage[];
    feedback?: string;
    score?: number;
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const interviewSchema = new Schema<IInterviewDocument>(
    {
        studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        type: { type: String, enum: ['technical', 'hr', 'behavioral'], default: 'technical' },
        topic: { type: String },
        status: { type: String, enum: ['active', 'completed'], default: 'active' },
        messages: [messageSchema],
        feedback: { type: String },
        score: { type: Number },
    },
    {
        timestamps: true,
        toJSON: {
            transform(_doc, ret: any) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

export const Interview = mongoose.model<IInterviewDocument>('Interview', interviewSchema);
