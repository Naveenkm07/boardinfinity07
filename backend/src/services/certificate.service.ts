import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { User } from '../models/user.model';
import { Course } from '../models/course.model';
import { ApiError } from '../utils/ApiError';
import { sendEmail } from './email.service';

export class CertificateService {
    /**
     * Generate a completion certificate for a student.
     */
    static async generateCertificate(userId: string, courseName: string, issueDate: Date = new Date()): Promise<Buffer> {
        const user = await User.findById(userId);
        if (!user) {
            throw ApiError.notFound('User not found');
        }

        // Create a new PDFDocument
        const pdfDoc = await PDFDocument.create();
        
        // Add a blank page
        const page = pdfDoc.addPage([800, 600]);
        
        // Get fonts
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

        const { width, height } = page.getSize();

        // Draw a border
        page.drawRectangle({
            x: 20,
            y: 20,
            width: width - 40,
            height: height - 40,
            borderColor: rgb(0.1, 0.2, 0.5),
            borderWidth: 5,
        });

        // Add Certificate Title
        const title = 'CERTIFICATE OF COMPLETION';
        const titleFontSize = 40;
        const titleWidth = timesRomanBoldFont.widthOfTextAtSize(title, titleFontSize);
        page.drawText(title, {
            x: (width - titleWidth) / 2,
            y: height - 120,
            size: titleFontSize,
            font: timesRomanBoldFont,
            color: rgb(0.1, 0.2, 0.5),
        });

        // Add subtitle
        const subtitle = 'This certifies that';
        const subtitleFontSize = 20;
        const subtitleWidth = timesRomanFont.widthOfTextAtSize(subtitle, subtitleFontSize);
        page.drawText(subtitle, {
            x: (width - subtitleWidth) / 2,
            y: height - 200,
            size: subtitleFontSize,
            font: timesRomanFont,
            color: rgb(0.3, 0.3, 0.3),
        });

        // Add Student Name
        const nameFontSize = 35;
        const nameWidth = timesRomanBoldFont.widthOfTextAtSize(user.name, nameFontSize);
        page.drawText(user.name, {
            x: (width - nameWidth) / 2,
            y: height - 280,
            size: nameFontSize,
            font: timesRomanBoldFont,
            color: rgb(0, 0, 0),
        });

        // Add course text
        const courseText = `has successfully completed the course`;
        const courseFontSize = 20;
        const courseWidth = timesRomanFont.widthOfTextAtSize(courseText, courseFontSize);
        page.drawText(courseText, {
            x: (width - courseWidth) / 2,
            y: height - 340,
            size: courseFontSize,
            font: timesRomanFont,
            color: rgb(0.3, 0.3, 0.3),
        });

        // Add Course Name
        const courseNameFontSize = 25;
        const courseNameWidth = timesRomanBoldFont.widthOfTextAtSize(courseName, courseNameFontSize);
        page.drawText(courseName, {
            x: (width - courseNameWidth) / 2,
            y: height - 400,
            size: courseNameFontSize,
            font: timesRomanBoldFont,
            color: rgb(0.1, 0.2, 0.5),
        });

        // Add Date
        const dateText = `Date: ${issueDate.toLocaleDateString()}`;
        const dateFontSize = 15;
        page.drawText(dateText, {
            x: 100,
            y: 100,
            size: dateFontSize,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
        });

        // Add Signature Line
        page.drawLine({
            start: { x: width - 250, y: 120 },
            end: { x: width - 100, y: 120 },
            thickness: 1,
            color: rgb(0, 0, 0),
        });
        page.drawText('Platform Administrator', {
            x: width - 230,
            y: 100,
            size: 12,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
        });

        // Serialize the PDFDocument to bytes (a Uint8Array)
        const pdfBytes = await pdfDoc.save();
        return Buffer.from(pdfBytes);
    }

    /**
     * Generate and email certificate.
     */
    static async generateAndEmail(userId: string, courseName: string): Promise<void> {
        const user = await User.findById(userId);
        if (!user || !user.email) return;

        const pdfBuffer = await this.generateCertificate(userId, courseName);

        const htmlContent = `
            <h2>Congratulations ${user.name}! 🎉</h2>
            <p>You have successfully completed the <strong>${courseName}</strong> course.</p>
            <p>Please find your certificate of completion attached to this email.</p>
            <p>Keep up the great work!</p>
            <br/>
            <p>Best regards,<br/>The Placement Portal Team</p>
        `;

        await sendEmail(
            user.email,
            `Your Certificate of Completion: ${courseName}`,
            htmlContent,
            [{
                filename: `${courseName.replace(/\s+/g, '_')}_Certificate.pdf`,
                content: pdfBuffer
            }]
        );
    }
}
