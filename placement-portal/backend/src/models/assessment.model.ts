import mongoose, { Document, Schema } from 'mongoose';

/**
 * Question sub-document.
 */
export interface IQuestion {
    _id?: string;
    text: string;
    options: string[];
    correctAnswer: number; // index in options[]
    points: number;
}

const questionSchema = new Schema<IQuestion>({
    text: { type: String, required: true },
    options: { type: [String], required: true, validate: [(v: string[]) => v.length >= 2, 'At least 2 options'] },
    correctAnswer: { type: Number, required: true, min: 0 },
    points: { type: Number, default: 1 },
});

/**
 * Assessment document.
 */
export type AssessmentStatus = 'draft' | 'active' | 'expired';

export interface IAssessmentDocument extends Document {
    title: string;
    description: string;
    questions: IQuestion[];
    duration: number; // minutes
    totalPoints: number;
    dueDate: Date;
    status: AssessmentStatus;
    category: string;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const assessmentSchema = new Schema<IAssessmentDocument>(
    {
        title: { type: String, required: true, trim: true, maxlength: 200 },
        description: { type: String, default: '', maxlength: 2000 },
        questions: [questionSchema],
        duration: { type: Number, required: true, min: 5 },
        totalPoints: { type: Number, default: 0 },
        dueDate: { type: Date, required: true },
        status: { type: String, enum: ['draft', 'active', 'expired'], default: 'active' },
        category: { type: String, default: 'general' },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    {
        timestamps: true,
        toJSON: {
            transform(_doc, ret) {
                ret.id = ret._id;
                delete (ret as any)._id;
                delete (ret as any).__v;
                return ret;
            },
        },
    },
);

assessmentSchema.index({ status: 1, dueDate: 1 });

export const Assessment = mongoose.model<IAssessmentDocument>('Assessment', assessmentSchema);

/**
 * Assessment Result — stores a student's submission.
 */
export interface IAssessmentResultDocument extends Document {
    userId: mongoose.Types.ObjectId;
    assessmentId: mongoose.Types.ObjectId;
    answers: number[]; // selected option index per question
    score: number;
    totalPoints: number;
    percentage: number;
    submittedAt: Date;
}

const resultSchema = new Schema<IAssessmentResultDocument>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        assessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true },
        answers: [{ type: Number }],
        score: { type: Number, required: true },
        totalPoints: { type: Number, required: true },
        percentage: { type: Number, required: true },
        submittedAt: { type: Date, default: Date.now },
    },
    {
        toJSON: {
            transform(_doc, ret) {
                ret.id = ret._id;
                delete (ret as any)._id;
                delete (ret as any).__v;
                return ret;
            },
        },
    },
);

resultSchema.index({ userId: 1, assessmentId: 1 }, { unique: true });

export const AssessmentResult = mongoose.model<IAssessmentResultDocument>('AssessmentResult', resultSchema);
