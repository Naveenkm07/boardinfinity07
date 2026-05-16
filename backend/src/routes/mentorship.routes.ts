import { Router } from 'express';
import { MentorshipController } from '../controllers/mentorship.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/alumni', MentorshipController.listAlumni);
router.post('/bookings', MentorshipController.createBooking);
router.get('/bookings/me', MentorshipController.getMyBookings);
router.patch('/bookings/:id/status', MentorshipController.updateBookingStatus);

export default router;
