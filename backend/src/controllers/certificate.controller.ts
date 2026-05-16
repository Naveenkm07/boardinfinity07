import { Request, Response, NextFunction } from 'express';
import { CertificateService } from '../services/certificate.service';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../types';

export class CertificateController {
    /**
     * GET /api/certificates/generate
     * Generate and download a certificate.
     */
    static async downloadCertificate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as AuthRequest).user!.userId;
            const courseName = (req.query.courseName as string) || 'General Assessment';

            const pdfBuffer = await CertificateService.generateCertificate(userId, courseName);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="Certificate.pdf"`);
            res.send(pdfBuffer);
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/certificates/email
     * Generate and email a certificate.
     */
    static async emailCertificate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as AuthRequest).user!.userId;
            const { courseName } = req.body;

            if (!courseName) {
                res.status(400).json({ success: false, message: 'Course name is required' });
                return;
            }

            await CertificateService.generateAndEmail(userId, courseName);
            ApiResponse.success(res, null, 'Certificate generated and emailed successfully');
        } catch (error) {
            next(error);
        }
    }
}
