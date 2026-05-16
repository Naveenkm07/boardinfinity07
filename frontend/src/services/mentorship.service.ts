import api from './api';
import { ApiResponse } from '@/types';

export const mentorshipService = {
    /**
     * Get list of available alumni.
     */
    async getAlumni(): Promise<any[]> {
        const { data } = await api.get('/mentorship/alumni');
        return data.data.alumni;
    },

    /**
     * Create a new booking.
     */
    async createBooking(bookingData: {
        alumniId: string;
        title: string;
        description?: string;
        scheduledAt: string | Date;
        duration?: number;
    }) {
        const { data } = await api.post('/mentorship/bookings', bookingData);
        return data.data;
    },

    /**
     * Get current user's bookings.
     * @param role 'student' or 'alumni'
     */
    async getMyBookings(role: 'student' | 'alumni' = 'student') {
        const { data } = await api.get('/mentorship/bookings/me', { params: { role } });
        return data.data.bookings;
    },

    /**
     * Update booking status.
     */
    async updateBookingStatus(bookingId: string, status: string) {
        const { data } = await api.patch(`/mentorship/bookings/${bookingId}/status`, { status });
        return data.data;
    },
};
