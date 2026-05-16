import { Request, Response, NextFunction } from 'express';
import { MentorshipService } from '../services/mentorship.service';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../types';

export class MentorshipController {
    /**
     * GET /api/mentorship/alumni
     * List all available alumni.
     */
    static async listAlumni(req: Request, res: Response, next: NextFunction) {
        try {
            const alumni = await MentorshipService.listAlumni();
            ApiResponse.success(res, { alumni }, 'Alumni retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/mentorship/bookings
     * Create a new booking.
     */
    static async createBooking(req: Request, res: Response, next: NextFunction) {
        try {
            const studentId = (req as AuthRequest).user!.userId;
            const booking = await MentorshipService.createBooking({
                ...req.body,
                studentId,
            });
            ApiResponse.success(res, booking, 'Booking created successfully', 201);
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/mentorship/bookings/me
     * Get bookings for the authenticated user.
     */
    static async getMyBookings(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as AuthRequest).user!.userId;
            const { role } = req.query; // alumni or student
            const bookings = await MentorshipService.getUserBookings(userId, (role as any) || 'student');
            ApiResponse.success(res, { bookings }, 'Bookings retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * PATCH /api/mentorship/bookings/:id/status
     * Update booking status.
     */
    static async updateBookingStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as AuthRequest).user!.userId;
            const { status } = req.body;
            const booking = await MentorshipService.updateBookingStatus(req.params.id, userId, status);
            ApiResponse.success(res, booking, 'Booking status updated successfully');
        } catch (error) {
            next(error);
        }
    }
}
