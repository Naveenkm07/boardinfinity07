import { Router } from 'express';
import { CertificateController } from '../controllers/certificate.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/download', CertificateController.downloadCertificate);
router.post('/email', CertificateController.emailCertificate);

export default router;
