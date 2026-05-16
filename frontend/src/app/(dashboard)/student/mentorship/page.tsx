'use client';

import React, { useEffect, useState } from 'react';
import { mentorshipService } from '../../../../services/mentorship.service';
import { useAuth } from '../../../../hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function MentorshipPage() {
    const { user } = useAuth();
    const [alumni, setAlumni] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedAlumni, setSelectedAlumni] = useState<any>(null);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        try {
            const [alumniData, bookingsData] = await Promise.all([
                mentorshipService.getAlumni(),
                mentorshipService.getMyBookings(user?.role === 'admin' ? 'alumni' : 'student'),
            ]);
            setAlumni(alumniData);
            setBookings(bookingsData);
        } catch (err) {
            console.error('Failed to fetch mentorship data:', err);
        } finally {
            setLoading(false);
        }
    }

    async function handleBooking(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const bookingData = {
            alumniId: selectedAlumni.id,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            scheduledAt: formData.get('scheduledAt') as string,
            duration: parseInt(formData.get('duration') as string),
        };

        try {
            await mentorshipService.createBooking(bookingData);
            setIsBookingModalOpen(false);
            setSelectedAlumni(null);
            fetchData();
            alert('Mentorship session booked successfully!');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to book session');
        }
    }

    async function handleUpdateStatus(bookingId: string, status: string) {
        try {
            await mentorshipService.updateBookingStatus(bookingId, status);
            fetchData();
        } catch (err) {
            console.error('Failed to update booking status:', err);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-indigo-900 p-8 md:p-12 text-white shadow-2xl">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-3xl md:text-4xl font-black mb-4">Connect with Alumni</h1>
                    <p className="text-indigo-100 text-lg leading-relaxed">
                        Book 1-on-1 mentorship sessions with seniors who have been placed in top companies. 
                        Get guidance on interview prep, career paths, and more.
                    </p>
                </div>
                <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent skew-x-12" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Available Alumni */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="text-2xl">🎓</span> Featured Mentors
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {alumni.map((a) => (
                            <Card key={a.id} className="p-6 hover:shadow-xl transition-all border-none bg-white/50 backdrop-blur-sm group">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-16 w-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        {a.profileImage ? (
                                            <img src={a.profileImage} alt={a.name} className="h-full w-full object-cover rounded-2xl" />
                                        ) : (
                                            a.name.charAt(0)
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{a.name}</h3>
                                        <p className="text-sm text-gray-500">{a.department}</p>
                                    </div>
                                </div>
                                <div className="mb-6 h-12 overflow-hidden">
                                    <p className="text-sm text-gray-600 line-clamp-2 italic">"{a.summary || 'Ready to help juniors navigate their career paths.'}"</p>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {a.skills?.slice(0, 3).map((s: string) => (
                                        <span key={s} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase tracking-wider">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                                <Button 
                                    onClick={() => { setSelectedAlumni(a); setIsBookingModalOpen(true); }}
                                    className="w-full bg-gray-900 hover:bg-indigo-600"
                                >
                                    Book 1-on-1 Session
                                </Button>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* My Bookings */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="text-2xl">📅</span> Your Sessions
                    </h2>
                    <div className="space-y-4">
                        {bookings.length > 0 ? (
                            bookings.map((b) => (
                                <Card key={b.id} className="p-5 border-l-4 border-l-indigo-500 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-gray-900">{b.title}</h4>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                            b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                            b.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            b.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {b.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                                        <span>with</span>
                                        <span className="font-bold text-indigo-600">
                                            {user?.role === 'admin' || b.alumniId.id === user?.id ? b.studentId.name : b.alumniId.name}
                                        </span>
                                    </p>
                                    <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold uppercase tracking-tighter">
                                        <div className="flex items-center gap-1">
                                            <span>📅</span> {new Date(b.scheduledAt).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span>⏰</span> {new Date(b.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    
                                    {/* Actions for Alumni */}
                                    {(user?.role === 'admin' || b.alumniId.id === user?.id) && b.status === 'pending' && (
                                        <div className="mt-4 flex gap-2">
                                            <button 
                                                onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                                                className="flex-1 py-1.5 rounded-lg bg-green-500 text-white text-[11px] font-bold uppercase hover:bg-green-600 transition"
                                            >
                                                Confirm
                                            </button>
                                            <button 
                                                onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                                                className="flex-1 py-1.5 rounded-lg bg-red-50 text-red-600 text-[11px] font-bold uppercase hover:bg-red-100 transition"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}

                                    {/* Student Cancel */}
                                    {b.studentId.id === user?.id && b.status === 'pending' && (
                                        <button 
                                            onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                                            className="mt-4 w-full py-1.5 rounded-lg border border-red-200 text-red-500 text-[11px] font-bold uppercase hover:bg-red-50 transition"
                                        >
                                            Cancel Booking
                                        </button>
                                    )}
                                </Card>
                            ))
                        ) : (
                            <div className="p-10 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <p className="text-gray-400 text-sm italic">No upcoming sessions.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {isBookingModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black">Book Mentorship</h2>
                            <button onClick={() => setIsBookingModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-2xl mb-8">
                            <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center text-xl font-bold text-white">
                                {selectedAlumni?.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Mentoring with</p>
                                <p className="font-bold text-gray-900">{selectedAlumni?.name}</p>
                            </div>
                        </div>

                        <form onSubmit={handleBooking} className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Session Topic</label>
                                <input 
                                    name="title" 
                                    placeholder="e.g. Mock Interview, Resume Review" 
                                    required 
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</label>
                                    <input 
                                        name="scheduledAt" 
                                        type="datetime-local" 
                                        required 
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Duration (min)</label>
                                    <select 
                                        name="duration" 
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
                                    >
                                        <option value="30">30 Minutes</option>
                                        <option value="45">45 Minutes</option>
                                        <option value="60">60 Minutes</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">What do you want to discuss?</label>
                                <textarea 
                                    name="description" 
                                    rows={3} 
                                    placeholder="Share some context about your needs..." 
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none" 
                                />
                            </div>
                            <div className="pt-4 flex gap-4">
                                <Button type="submit" className="flex-1 py-4 text-md font-bold shadow-lg shadow-indigo-200">
                                    Confirm Booking
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => setIsBookingModalOpen(false)} 
                                    className="flex-1 py-4 text-md font-bold"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}
