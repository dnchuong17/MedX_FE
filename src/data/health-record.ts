import { HealthRecord } from '@/types/health-record';

export const healthRecordsData: HealthRecord[] = [
    {
        id: 1,
        title: "General Check-up",
        date: "05/05/2025",
        doctor: "Thomas Johnson",
        type: "Periodic Check-up",
        location: "Thu Duc Hospital",
        status: "Shared",
    },
    {
        id: 2,
        title: "Blood Test",
        date: "20/04/2025",
        lab: "Medic Lab",
        type: "Test",
        location: "Gia Dinh Hospital",
        status: "Pending Verification",
    },
    {
        id: 3,
        title: "Cardiology Exam",
        date: "05/05/2025",
        doctor: "Thomas Johnson",
        type: "Specialist",
        location: "Gia Dinh Hospital",
        status: "Shared",
    },
];