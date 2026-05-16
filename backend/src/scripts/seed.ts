
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/user.model';
import { Course } from '../models/course.model';
import { Session } from '../models/session.model';
import { Assessment } from '../models/assessment.model';
import { Resource } from '../models/resource.model';
import { Competition } from '../models/competition.model';
import { Track } from '../models/track.model';

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
            Track.deleteMany({}),
        ]);
        console.log('✅ Data cleared.');

        // 1. Create Users
        console.log('👤 Creating users...');
        const admin = await User.create({
            name: 'Admin User',
            username: 'admin',
            email: 'admin@example.com',
            role: 'admin',
            isVerified: true,
            department: 'Administration',
            phone: '9999999999',
        });

        const students = await User.insertMany([
            { 
                name: 'Naveen Kumar', 
                username: 'naveenkm07', 
                email: 'naveen@example.com', 
                role: 'student', 
                isVerified: true, 
                department: 'CSE', 
                rollNumber: 'CS001', 
                phone: '9876543210',
                summary: 'Passionate developer focusing on Full Stack and AI. Open to collaboration on innovative projects.',
                skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python'],
                socialLinks: {
                    github: 'https://github.com/Naveenkm07/',
                    linkedin: 'https://linkedin.com/in/naveen-kumar-km',
                },
                points: 1250,
            },
            { name: 'Rahul Sharma', username: 'rahul', email: 'rahul@example.com', role: 'student', isVerified: true, department: 'CSE', rollNumber: 'CS101', phone: '9876543210', points: 850 },
            { name: 'Priya Patel', username: 'priya', email: 'priya@example.com', role: 'student', isVerified: true, department: 'ECE', rollNumber: 'EC102', phone: '9876543211', points: 1100 },
            { name: 'Amit Kumar', username: 'amit', email: 'amit@example.com', role: 'student', isVerified: true, department: 'MECH', rollNumber: 'ME103', phone: '9876543212', points: 600 },
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
                createdBy: admin._id,
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
                createdBy: admin._id,
                lessons: [
                    { title: 'React Basics', description: 'Components, Props, and State', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: 20, order: 1 },
                    { title: 'Node.js & Express', description: 'Building REST APIs', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: 35, order: 2 },
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
                scheduledAt: new Date(Date.now() + 86400000 * 2),
                duration: 60,
                meetingLink: 'https://meet.google.com/abc-defg-hij',
                status: 'upcoming',
                maxAttendees: 100,
                attendees: [],
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
        ]);
        console.log(`✅ Created ${resources.length} Resources.`);

        // 6. Create Prep Tracks
        console.log('🛤️ Creating prep tracks...');
        await Track.insertMany([
            {
                title: 'Amazon SDE Ninja',
                companyName: 'Amazon',
                description: 'Curated path to crack Amazon SDE roles. Includes DSA, System Design, and Leadership Principles.',
                icon: '🅰️',
                difficulty: 'advanced',
                tags: ['amazon', 'sde', 'top-tech'],
                items: [
                    { type: 'course', itemId: courses[0]._id, order: 1 },
                    { type: 'assessment', itemId: assessments[0]._id, order: 2 },
                    { type: 'resource', itemId: resources[0]._id, order: 3 },
                ]
            },
            {
                title: 'Google Go-Getter',
                companyName: 'Google',
                description: 'Master the coding interview for Google. Focus on advanced algorithms and clean code.',
                icon: '🔍',
                difficulty: 'advanced',
                tags: ['google', 'algorithms', 'elite'],
                items: [
                    { type: 'course', itemId: courses[0]._id, order: 1 },
                    { type: 'assessment', itemId: assessments[0]._id, order: 2 },
                ]
            },
            {
                title: 'TCS NQT Prep',
                companyName: 'TCS',
                description: 'Comprehensive guide for TCS National Qualifier Test. Covers aptitude and basic coding.',
                icon: '💼',
                difficulty: 'beginner',
                tags: ['tcs', 'nqt', 'mass-recruiter'],
                items: [
                    { type: 'assessment', itemId: assessments[0]._id, order: 1 },
                    { type: 'resource', itemId: resources[0]._id, order: 2 },
                ]
            }
        ]);
        console.log('✅ Created 3 Prep Tracks.');

        console.log('-----------------------------------');
        console.log('🎉 Database seeding completed successfully!');
        console.log('-----------------------------------');
        console.log('Admin Credentials: admin@example.com / OTP');
        console.log('Student Credentials: naveen@example.com / OTP (Username: naveenkm07)');
        console.log('-----------------------------------');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seed();
