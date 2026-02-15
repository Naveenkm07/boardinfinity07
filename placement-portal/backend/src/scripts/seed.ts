
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/user.model';
import { Course } from '../models/course.model';
import { Session } from '../models/session.model';
import { Assessment } from '../models/assessment.model';
import { Resource } from '../models/resource.model';
import { Competition } from '../models/competition.model';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('❌ MONGO_URI is not defined in .env');
    process.exit(1);
}

const seed = async () => {
    try {
        console.log('🌱 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected.');

        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await Promise.all([
            User.deleteMany({}),
            Course.deleteMany({}),
            Session.deleteMany({}),
            Assessment.deleteMany({}),
            Resource.deleteMany({}),
            Competition.deleteMany({}),
        ]);
        console.log('✅ Data cleared.');

        // 1. Create Users
        console.log('👤 Creating users...');
        // Utilizing explicit strings to avoid TS2693 if UserRole is treated as type-only in some contexts
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin',
            isVerified: true,
            department: 'Administration',
            phone: '9999999999',
        });

        const students = await User.insertMany([
            { name: 'Rahul Sharma', email: 'rahul@example.com', password: 'password123', role: 'student', isVerified: true, department: 'CSE', rollNumber: 'CS101', phone: '9876543210' },
            { name: 'Priya Patel', email: 'priya@example.com', password: 'password123', role: 'student', isVerified: true, department: 'ECE', rollNumber: 'EC102', phone: '9876543211' },
            { name: 'Amit Kumar', email: 'amit@example.com', password: 'password123', role: 'student', isVerified: true, department: 'MECH', rollNumber: 'ME103', phone: '9876543212' },
        ]);
        console.log(`✅ Created 1 Admin and ${students.length} Students.`);

        // 2. Create Courses
        console.log('📚 Creating courses...');
        const courses = await Course.insertMany([
            {
                title: 'Data Structures & Algorithms',
                description: 'Master DSA with this comprehensive course covering arrays, linked lists, trees, graphs, and dynamic programming.',
                instructor: 'Dr. S. Gupta',
                thumbnail: 'https://img.freepik.com/free-vector/programming-concept-illustration_114360-1351.jpg',
                category: 'dsa',
                isPublished: true,
                lessons: [
                    { title: 'Introduction to Arrays', description: 'Basics of array data structure', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: 15, order: 1 },
                    { title: 'Linked Lists Explained', description: 'Singly and Doubly Linked Lists', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: 25, order: 2 },
                    { title: 'Binary Trees', description: 'Traversal and properties', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: 30, order: 3 },
                ],
            },
            {
                title: 'Full Stack Web Development',
                description: 'Learn MERN stack from scratch. Build real-world applications using MongoDB, Express, React, and Node.js.',
                instructor: 'Prof. A. Verma',
                thumbnail: 'https://img.freepik.com/free-vector/web-development-programmer-engineering-coding-website-augmented-reality-interface-screens-developer-project-engineer-programming-software-application-design-cartoon-illustration_107791-3863.jpg',
                category: 'web-dev',
                isPublished: true,
                lessons: [
                    { title: 'React Basics', description: 'Components, Props, and State', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: 20, order: 1 },
                    { title: 'Node.js & Express', description: 'Building REST APIs', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: 35, order: 2 },
                ],
            },
            {
                title: 'System Design Interview Prep',
                description: 'Crack system design interviews with ease. Learn about scalability, load balancing, caching, and database sharding.',
                instructor: 'TechLead John',
                thumbnail: 'https://img.freepik.com/free-vector/cloud-computing-security-abstract-concept-illustration_335657-2105.jpg',
                category: 'system-design',
                isPublished: true,
                lessons: [
                    { title: 'Scalability Basics', description: 'Vertical vs Horizontal Scaling', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: 40, order: 1 },
                ],
            },
        ]);
        console.log(`✅ Created ${courses.length} Courses.`);

        // 3. Create Sessions
        console.log('📅 Creating sessions...');
        const sessions = await Session.insertMany([
            {
                title: 'Resume Building Workshop',
                description: 'Learn how to craft a winning resume that gets you shortlisted.',
                host: 'Placement Cell',
                scheduledAt: new Date(Date.now() + 86400000 * 2), // 2 days from now
                duration: 60,
                meetingLink: 'https://meet.google.com/abc-defg-hij',
                status: 'upcoming',
                maxAttendees: 100,
                attendees: [],
                createdBy: admin._id,
            },
            {
                title: 'Mock Interview: Technical Round',
                description: 'Live mock interview session with industry experts.',
                host: 'Expert Panel',
                scheduledAt: new Date(Date.now() + 86400000 * 5), // 5 days from now
                duration: 90,
                meetingLink: 'https://meet.google.com/xyz-uvw-pqr',
                status: 'upcoming',
                maxAttendees: 50,
                attendees: [],
                createdBy: admin._id,
            },
            {
                title: 'Alumni Talk: Life at Google',
                description: 'Interactive session with our alumni working at Google.',
                host: 'Rohan Das',
                scheduledAt: new Date(Date.now() - 86400000), // Yesterday
                duration: 45,
                status: 'completed',
                maxAttendees: 200,
                createdBy: admin._id,
            },
        ]);
        console.log(`✅ Created ${sessions.length} Sessions.`);

        // 4. Create Assessments
        console.log('📝 Creating assessments...');
        const assessments = await Assessment.insertMany([
            {
                title: 'DSA Quiz 1: Arrays & Strings',
                description: 'Test your knowledge of basic data structures.',
                category: 'DSA',
                duration: 30,
                totalPoints: 20,
                dueDate: new Date(Date.now() + 86400000 * 7),
                status: 'active',
                createdBy: admin._id,
                questions: [
                    { text: 'Time complexity of accessing an element in an array?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 0, points: 5 },
                    { text: 'Which data structure uses LIFO?', options: ['Queue', 'Stack', 'Array', 'Tree'], correctAnswer: 1, points: 5 },
                    { text: 'Best case complexity of Bubble Sort?', options: ['O(n)', 'O(n^2)', 'O(n log n)', 'O(1)'], correctAnswer: 0, points: 5 },
                    { text: 'Indexing in array starts from?', options: ['0', '1', '-1', 'None'], correctAnswer: 0, points: 5 },
                ],
            },
            {
                title: 'React.js Basics Assessment',
                description: 'Fundamentals of React components and hooks.',
                category: 'Web Dev',
                duration: 45,
                totalPoints: 20,
                dueDate: new Date(Date.now() + 86400000 * 10),
                status: 'active',
                createdBy: admin._id,
                questions: [
                    { text: 'Which hook is used for side effects?', options: ['useState', 'useEffect', 'useContext', 'useReducer'], correctAnswer: 1, points: 10 },
                    { text: 'JSX stands for?', options: ['JavaScript XML', 'Java Syntax Extension', 'JSON Xylophone', 'None'], correctAnswer: 0, points: 10 },
                ],
            },
        ]);
        console.log(`✅ Created ${assessments.length} Assessments.`);

        // 5. Create Resources
        console.log('📄 Creating resources...');
        const resources = await Resource.insertMany([
            {
                title: 'Top 50 HR Interview Questions',
                company: 'General',
                type: 'document',
                content: 'Comprehensive list of common HR questions and how to answer them.',
                url: 'https://example.com/hr-questions.pdf',
                tags: ['hr', 'interview', 'prep'],
                isPublished: true,
                createdBy: admin._id,
            },
            {
                title: 'Amazon SDE-1 Interview Experience',
                company: 'Amazon',
                type: 'blog',
                content: 'My experience interviewing for SDE-1 role at Amazon Bangalore...',
                tags: ['amazon', 'sde', 'interview-experience'],
                isPublished: true,
                createdBy: admin._id,
            },
            {
                title: 'System Design: URL Shortener',
                company: 'System Design',
                type: 'video',
                content: 'Video tutorial on designing a scalable URL shortener like bit.ly.',
                url: 'https://youtube.com/watch?v=example',
                tags: ['system-design', 'scaling'],
                isPublished: true,
                createdBy: admin._id,
            },
        ]);
        console.log(`✅ Created ${resources.length} Resources.`);

        // 6. Create Competitions
        console.log('🏆 Creating competitions...');
        const competitions = await Competition.insertMany([
            {
                title: 'Weekly Coding Challenge #42',
                description: 'Solve 3 algorithmic problems in 2 hours.',
                startDate: new Date(Date.now() + 86400000 * 3),
                endDate: new Date(Date.now() + 86400000 * 3 + 7200000), // 2 hours later
                status: 'upcoming',
                difficulty: 'medium',
                maxParticipants: 500,
                prize: 'Amazon Voucher ₹1000',
                rules: 'No plagiarism. Standard input/output.',
                participants: [],
                createdBy: admin._id,
            },
            {
                title: 'HackTheNorth 2026',
                description: '24-hour hackathon to build innovative solutions.',
                startDate: new Date(Date.now() + 86400000 * 14),
                endDate: new Date(Date.now() + 86400000 * 15),
                status: 'upcoming',
                difficulty: 'hard',
                maxParticipants: 200,
                prize: 'Cash Prize ₹50,000',
                rules: 'Team size: 2-4 members.',
                participants: [],
                createdBy: admin._id,
            },
        ]);
        console.log(`✅ Created ${competitions.length} Competitions.`);

        console.log('-----------------------------------');
        console.log('🎉 Database seeding completed successfully!');
        console.log('-----------------------------------');
        console.log('Admin Credentials: admin@example.com / admin123');
        console.log('Student Credentials: rahul@example.com / password123');
        console.log('-----------------------------------');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seed();
