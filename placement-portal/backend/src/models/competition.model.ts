import mongoose, { Document, Schema } from 'mongoose';

export type CompetitionStatus = 'upcoming' | 'active' | 'ended';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface ICompetitionDocument extends Document {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    status: CompetitionStatus;
    difficulty: DifficultyLevel;
    participants: mongoose.Types.ObjectId[];
    maxParticipants: number;
    prize: string;
    rules: string;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const competitionSchema = new Schema<ICompetitionDocument>(
    {
        title: { type: String, required: true, trim: true, maxlength: 200 },
        description: { type: String, default: '', maxlength: 3000 },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        status: { type: String, enum: ['upcoming', 'active', 'ended'], default: 'upcoming' },
        difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
        participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        maxParticipants: { type: Number, default: 500 },
        prize: { type: String, default: '' },
        rules: { type: String, default: '' },
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

competitionSchema.index({ status: 1, startDate: 1 });

export const Competition = mongoose.model<ICompetitionDocument>('Competition', competitionSchema);
