import { z } from 'zod';

/**
 * Validation schemas for user endpoints.
 */

const experienceSchema = z.object({
    company: z.string().min(1, 'Company name is required'),
    position: z.string().min(1, 'Position is required'),
    startDate: z.string().transform((val) => new Date(val)),
    endDate: z.string().transform((val) => new Date(val)).optional(),
    current: z.boolean().default(false),
    description: z.string().optional(),
});

const educationSchema = z.object({
    school: z.string().min(1, 'School name is required'),
    degree: z.string().min(1, 'Degree is required'),
    fieldOfStudy: z.string().min(1, 'Field of study is required'),
    startYear: z.number().int().min(1900).max(2100),
    endYear: z.number().int().min(1900).max(2100).optional(),
});

/** PATCH /api/users/profile */
export const updateProfileSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
        department: z.string().optional(),
        rollNumber: z.string().optional(),
        phone: z.string().optional(),
        bio: z.string().max(500).optional(),
        skills: z.array(z.string()).optional(),
        socialLinks: z.object({
            github: z.string().url().optional().or(z.literal('')),
            linkedin: z.string().url().optional().or(z.literal('')),
            twitter: z.string().url().optional().or(z.literal('')),
            portfolio: z.string().url().optional().or(z.literal('')),
        }).optional(),
        experience: z.array(experienceSchema).optional(),
        education: z.array(educationSchema).optional(),
        profileImage: z.string().url().optional().or(z.literal('')),
        resumeUrl: z.string().url().optional().or(z.literal('')),
    }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>['body'];
