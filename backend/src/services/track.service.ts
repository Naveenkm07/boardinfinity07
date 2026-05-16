import { Track, ITrackDocument } from '../models/track.model';
import { ApiError } from '../utils/ApiError';

export class TrackService {
    static async createTrack(data: Partial<ITrackDocument>): Promise<ITrackDocument> {
        return Track.create(data);
    }

    static async listTracks(): Promise<ITrackDocument[]> {
        return Track.find().sort({ createdAt: -1 });
    }

    static async getTrackById(id: string): Promise<any> {
        const track = await Track.findById(id).lean();
        if (!track) throw ApiError.notFound('Track not found');

        // Populate items manually for simplicity (different collections)
        const populatedItems = await Promise.all(track.items.map(async (item: any) => {
            let modelName = '';
            switch (item.type) {
                case 'course': modelName = 'Course'; break;
                case 'assessment': modelName = 'Assessment'; break;
                case 'resource': modelName = 'Resource'; break;
                case 'experience': modelName = 'Experience'; break;
            }
            
            const mongoose = require('mongoose');
            const data = await mongoose.model(modelName).findById(item.itemId).select('title description company role');
            return { ...item, data };
        }));

        return { ...track, items: populatedItems };
    }

    static async updateTrack(id: string, data: Partial<ITrackDocument>): Promise<ITrackDocument> {
        const track = await Track.findByIdAndUpdate(id, data, { new: true });
        if (!track) throw ApiError.notFound('Track not found');
        return track;
    }

    static async deleteTrack(id: string): Promise<void> {
        const result = await Track.deleteOne({ _id: id });
        if (result.deletedCount === 0) throw ApiError.notFound('Track not found');
    }
}
