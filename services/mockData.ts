import type { User, Appointment, ForumPost, MenstrualLog } from '../types';
import { UserRole } from '../types';

export const mockPatientUser: User = {
    id: 'patient123',
    name: 'Jane Doe',
    email: 'patient@example.com',
    role: UserRole.PATIENT,
};

export const mockDoctorUser: User = {
    id: 'doctor456',
    name: 'Dr. Emily Carter',
    email: 'doctor@example.com',
    role: UserRole.DOCTOR,
};

export const mockDoctors: User[] = [
    mockDoctorUser,
    { id: 'doctor789', name: 'Dr. Ben Adams', email: 'ben@example.com', role: UserRole.DOCTOR },
];

const now = new Date();
export const mockAppointments: Appointment[] = [
    {
        id: 'appt1',
        doctor_name: 'Dr. Emily Carter',
        appointment_date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        reason: 'Annual Checkup',
        status: 'confirmed',
    },
    {
        id: 'appt2',
        doctor_name: 'Dr. Ben Adams',
        appointment_date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        reason: 'Follow-up Consultation',
        status: 'confirmed',
    },
    {
        id: 'appt3',
        doctor_name: 'Dr. Emily Carter',
        appointment_date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        reason: 'Initial Consultation',
        status: 'completed',
    },
];

export const mockDoctorAppointments: Appointment[] = [
     {
        id: 'appt1',
        patient_name: 'Jane Doe',
        appointment_date: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 30).toISOString(),
        reason: 'Annual Checkup',
        status: 'confirmed',
    },
     {
        id: 'appt4',
        patient_name: 'Maria Garcia',
        appointment_date: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0).toISOString(),
        reason: 'Flu Symptoms',
        status: 'confirmed',
    },
];


export const mockForumPosts: ForumPost[] = [
    {
        id: 'post1',
        title: 'Tips for managing PCOS symptoms?',
        content: 'Hi everyone, I was recently diagnosed with PCOS and I\'m looking for some lifestyle tips that have helped others. Specifically around diet and exercise. Thanks in advance!',
        created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'post2',
        title: 'Feeling anxious about upcoming appointment',
        content: 'I have an appointment with a new gynecologist next week and I\'m feeling really nervous. Does anyone have advice on how to prepare and what questions to ask?',
        created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

export const mockMenstrualLogs: MenstrualLog[] = [
    {
        id: 'log1',
        user_id: 'patient123',
        start_date: new Date(now.getFullYear(), now.getMonth() - 1, 5).toISOString().split('T')[0],
        end_date: new Date(now.getFullYear(), now.getMonth() - 1, 9).toISOString().split('T')[0],
    },
     {
        id: 'log2',
        user_id: 'patient123',
        start_date: new Date(now.getFullYear(), now.getMonth() - 2, 7).toISOString().split('T')[0],
        end_date: new Date(now.getFullYear(), now.getMonth() - 2, 11).toISOString().split('T')[0],
    },
];

export const mockPatientDashboard = {
    nextAppointment: mockAppointments[0],
    lastPeriodStart: mockMenstrualLogs[0].start_date,
};

export const mockDoctorDashboard = {
    todaysAppointments: mockDoctorAppointments.filter(a => new Date(a.appointment_date).toDateString() === now.toDateString()),
};

export const mockMusic = {
    'Happy': [
        { title: "Walking on Sunshine", artist: "Katrina & The Waves" },
        { title: "Happy", artist: "Pharrell Williams" },
    ],
    'Sad': [
        { title: "Someone Like You", artist: "Adele" },
        { title: "Fix You", artist: "Coldplay" },
    ],
    'Anxious': [
        { title: "Weightless", artist: "Marconi Union" },
        { title: "Clair de Lune", artist: "Claude Debussy" },
    ],
    'Energetic': [
        { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars" },
        { title: "Shake It Off", artist: "Taylor Swift" },
    ],
    'Calm': [
        { title: "Orinoco Flow", artist: "Enya" },
        { title: "Here Comes The Sun", artist: "The Beatles" },
    ],
};
