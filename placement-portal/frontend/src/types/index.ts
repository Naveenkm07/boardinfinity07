/**
 * Shared TypeScript types for the frontend.
 * These mirror the backend types to ensure type safety across the stack.
 */

/** User roles */
export enum UserRole {
    STUDENT = 'student',
    ADMIN = 'admin',
}

/** User object returned from the API */
export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    isVerified: boolean;
    department?: string;
    rollNumber?: string;
    phone?: string;
    profileImage?: string;
    createdAt: string;
    updatedAt: string;
}

/** JWT payload decoded from the token */
export interface JwtPayload {
    userId: string;
    email: string;
    role: UserRole;
    iat: number;
    exp: number;
}

/** Standardized API response shape */
export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    errors?: Record<string, string[]>;
}

/** Paginated response */
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    totalPages: number;
}

/** Auth API response types */
export interface LoginResponse {
    token: string;
    user: User;
}

/** Auth context state */
export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

// ─── Course Types ───────────────────────────────────────────

export interface Lesson {
    _id: string;
    title: string;
    description: string;
    videoUrl: string;
    duration: number;
    order: number;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    instructor: string;
    thumbnail: string;
    category: string;
    lessons: Lesson[];
    totalDuration: number;
    enrolledCount: number;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CourseProgress {
    id: string;
    userId: string;
    courseId: string | Course;
    completedLessons: string[];
    lastLessonId: string;
    percentage: number;
    completedAt: string | null;
}

// ─── Session Types ──────────────────────────────────────────

export type SessionStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Session {
    id: string;
    title: string;
    description: string;
    host: string;
    scheduledAt: string;
    duration: number;
    meetingLink: string;
    status: SessionStatus;
    attendees: string[] | User[];
    maxAttendees: number;
    createdAt: string;
}

// ─── Assessment Types ───────────────────────────────────────

export type AssessmentStatus = 'draft' | 'active' | 'expired';

export interface Question {
    _id: string;
    text: string;
    options: string[];
    correctAnswer?: number; // hidden from students
    points: number;
}

export interface Assessment {
    id: string;
    title: string;
    description: string;
    questions: Question[];
    duration: number;
    totalPoints: number;
    dueDate: string;
    status: AssessmentStatus;
    category: string;
    createdAt: string;
}

export interface AssessmentResult {
    id: string;
    userId: string;
    assessmentId: string;
    answers: number[];
    score: number;
    totalPoints: number;
    percentage: number;
    submittedAt: string;
}

// ─── Resource Types ─────────────────────────────────────────

export type ResourceType = 'interview-guide' | 'blog' | 'video' | 'document';

export interface Resource {
    id: string;
    title: string;
    company: string;
    type: ResourceType;
    content: string;
    url: string;
    tags: string[];
    isPublished: boolean;
    createdAt: string;
}

// ─── Competition Types ──────────────────────────────────────

export type CompetitionStatus = 'upcoming' | 'active' | 'ended';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Competition {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    status: CompetitionStatus;
    difficulty: DifficultyLevel;
    participants: string[];
    maxParticipants: number;
    prize: string;
    rules: string;
    createdAt: string;
}

// ─── Dashboard Types ────────────────────────────────────────

export interface DashboardStats {
    enrolledCourses: number;
    completedCourses: number;
    upcomingSessions: number;
    pendingAssessments: number;
}

export interface DashboardUpcoming {
    sessions: Session[];
    assessments: Assessment[];
    courseProgress: CourseProgress[];
}

// ─── Editor Types ───────────────────────────────────────────

export interface TestCase {
    input: string;
    expected: string;
}

export interface TestResult {
    testCase: number;
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
    executionTime: number;
}

export interface CodeExecutionResult {
    language: string;
    results: TestResult[];
    totalPassed: number;
    totalTests: number;
    executionTime: number;
}

// ─── Admin Types ────────────────────────────────────────────

export interface AdminAnalytics {
    totalUsers: number;
    totalStudents: number;
    totalAdmins: number;
    totalCourses: number;
    totalSessions: number;
    totalAssessments: number;
    averageProgress: number;
    recentSignups: User[];
}
