import { Request, Response, NextFunction } from 'express';
import { ResourceService } from '../services/resource.service';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../types';
import { ResourceType } from '../models/resource.model';

export class ResourceController {
    static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const type = req.query.type as ResourceType | undefined;
            const search = req.query.search as string | undefined;
            const data = await ResourceService.listResources(page, limit, type, search);
            ApiResponse.success(res, data, 'Resources retrieved');
        } catch (error) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const resource = await ResourceService.getResourceById(req.params.id as string);
            ApiResponse.success(res, { resource }, 'Resource retrieved');
        } catch (error) {
            next(error);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const resource = await ResourceService.createResource(
                req.body,
                (req as AuthRequest).user!.userId,
            );
            ApiResponse.created(res, { resource }, 'Resource created');
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const resource = await ResourceService.updateResource(req.params.id as string, req.body);
            ApiResponse.success(res, { resource }, 'Resource updated');
        } catch (error) {
            next(error);
        }
    }

    static async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await ResourceService.deleteResource(req.params.id as string);
            ApiResponse.success(res, null, 'Resource deleted');
        } catch (error) {
            next(error);
        }
    }
}
