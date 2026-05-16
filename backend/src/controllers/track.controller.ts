import { Request, Response, NextFunction } from 'express';
import { TrackService } from '../services/track.service';
import { ApiResponse } from '../utils/ApiResponse';
import { UserRole } from '../types';

export class TrackController {
    static async createTrack(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const track = await TrackService.createTrack(req.body);
            ApiResponse.success(res, track, 'Track created successfully', 201);
        } catch (error) {
            next(error);
        }
    }

    static async listTracks(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const tracks = await TrackService.listTracks();
            ApiResponse.success(res, { tracks }, 'Tracks retrieved');
        } catch (error) {
            next(error);
        }
    }

    static async getTrackById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const track = await TrackService.getTrackById(req.params.id);
            ApiResponse.success(res, track, 'Track details retrieved');
        } catch (error) {
            next(error);
        }
    }

    static async updateTrack(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const track = await TrackService.updateTrack(req.params.id, req.body);
            ApiResponse.success(res, track, 'Track updated successfully');
        } catch (error) {
            next(error);
        }
    }

    static async deleteTrack(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await TrackService.deleteTrack(req.params.id);
            ApiResponse.success(res, null, 'Track deleted successfully');
        } catch (error) {
            next(error);
        }
    }
}
