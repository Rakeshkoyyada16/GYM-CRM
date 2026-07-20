import type {
  Trainer, AssignedMember, PerformanceMetrics, DaySchedule,
} from '../types/trainer.types'

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

// ============================================
// Mock Assigned Members
// ============================================

function makeAssignedMembers(): AssignedMember[] {
  return [
    { id: '1', name: 'Rahul Sharma', plan: 'Premium Annual', joinedAt: '2024-01-15', sessionsCompleted: 45, totalSessions: 120, lastSession: '2026-07-19' },
    { id: '3', name: 'Arjun Reddy', plan: 'VIP Annual', joinedAt: '2024-03-10', sessionsCompleted: 89, totalSessions: 200, lastSession: '2026-07-20' },
    { id: '9', name: 'Deepak Joshi', plan: 'Premium Annual', joinedAt: '2025-03-01', sessionsCompleted: 55, totalSessions: 120, lastSession: '2026-07-20' },
    { id: '11', name: 'Amit Verma', plan: 'VIP Annual', joinedAt: '2025-06-01', sessionsCompleted: 42, totalSessions: 200, lastSession: '2026-07-18' },
  ]
}

function makeYogaMembers(): AssignedMember[] {
  return [
    { id: '2', name: 'Sneha Patel', plan: 'Standard Quarterly', joinedAt: '2024-02-01', sessionsCompleted: 28, totalSessions: 36, lastSession: '2026-07-18' },
    { id: '6', name: 'Ananya Gupta', plan: 'Premium Semi-Annual', joinedAt: '2024-06-01', sessionsCompleted: 60, totalSessions: 72, lastSession: '2026-07-19' },
    { id: '10', name: 'Priya Menon', plan: 'Standard Quarterly', joinedAt: '2025-04-20', sessionsCompleted: 15, totalSessions: 36, lastSession: '2026-07-19' },
  ]
}

// ============================================
// Mock Performance
// ============================================

function makePerformance(seed: number): PerformanceMetrics {
  return {
    clientRetention: 85 + (seed % 10),
    avgClientRating: 4.2 + (seed % 8) * 0.1,
    classesThisMonth: 18 + (seed % 8),
    classesLastMonth: 16 + (seed % 6),
    revenueGenerated: 180000 + seed * 5000,
    attendanceRate: 88 + (seed % 10),
    monthlyTrend: [
      { month: 'Feb', classes: 14 + seed % 3, revenue: 120000 + seed * 2000 },
      { month: 'Mar', classes: 16 + seed % 4, revenue: 135000 + seed * 2500 },
      { month: 'Apr', classes: 15 + seed % 3, revenue: 128000 + seed * 2000 },
      { month: 'May', classes: 18 + seed % 5, revenue: 150000 + seed * 3000 },
      { month: 'Jun', classes: 17 + seed % 4, revenue: 142000 + seed * 2500 },
      { month: 'Jul', classes: 18 + seed % 8, revenue: 180000 + seed * 5000 },
    ],
  }
}

// ============================================
// Mock Schedule
// ============================================

function makeSchedule(hasEvening: boolean): DaySchedule[] {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days.map((day, i) => ({
    dayOfWeek: i,
    dayName: day,
    startTime: i === 0 ? '09:00' : '06:00',
    endTime: i === 0 ? '13:00' : hasEvening ? '20:00' : '14:00',
    isAvailable: i !== 0,
    classes: i === 0 ? [] : [
      { id: `sc-${i}-1`, name: i % 2 === 0 ? 'Morning Session' : 'HIIT Class', startTime: i === 0 ? '09:00' : '06:00', endTime: i === 0 ? '10:00' : '07:00', room: i % 2 === 0 ? 'Studio A' : 'Training Zone', enrolled: 10 + i * 2, capacity: 20 },
      { id: `sc-${i}-2`, name: i % 2 === 0 ? 'Strength Lab' : 'Cardio Blast', startTime: '10:00', endTime: '11:00', room: 'Weight Room', enrolled: 8 + i, capacity: 15 },
      ...(hasEvening && i >= 2 && i <= 5 ? [
        { id: `sc-${i}-3`, name: 'Evening Class', startTime: '18:00', endTime: '19:00', room: 'Studio B', enrolled: 15 + i, capacity: 25 },
      ] : []),
    ],
  }))
}

// ============================================
// Mock Trainers
// ============================================

const MOCK_TRAINERS: Trainer[] = [
  {
    id: '1', trainerId: 'TR-001', firstName: 'Suresh', lastName: 'Kumar',
    email: 'suresh.kumar@gym.com', phone: '+91 98765 11111', gender: 'male',
    dateOfBirth: '1988-03-15', joinDate: '2022-06-01', status: 'active',
    specializations: ['strength', 'crossfit', 'hiit'],
    certifications: ['ACE Certified Personal Trainer', 'CrossFit Level 2', 'NASM CPT'],
    experience: 8, salary: 55000, rating: 4.8, totalClients: 45, totalClasses: 320,
    bio: 'Experienced fitness trainer with 8+ years in strength and conditioning. Former competitive powerlifter. Specializes in building functional strength and athletic performance.',
    availability: makeSchedule(true),
    assignedMembers: makeAssignedMembers(),
    performance: makePerformance(3),
    createdAt: '2022-06-01T10:00:00Z', updatedAt: '2026-07-20T10:00:00Z',
  },
  {
    id: '2', trainerId: 'TR-002', firstName: 'Neha', lastName: 'Agarwal',
    email: 'neha.agarwal@gym.com', phone: '+91 98765 22222', gender: 'female',
    dateOfBirth: '1991-07-22', joinDate: '2023-01-15', status: 'active',
    specializations: ['yoga', 'pilates', 'nutrition'],
    certifications: ['RYT 500 Yoga Alliance', 'Pilates Method Alliance', 'Precision Nutrition L1'],
    experience: 6, salary: 48000, rating: 4.9, totalClients: 38, totalClasses: 280,
    bio: 'Certified yoga instructor specializing in Hatha and Vinyasa yoga. Combines traditional yoga philosophy with modern fitness science for holistic wellness.',
    availability: makeSchedule(false),
    assignedMembers: makeYogaMembers(),
    performance: makePerformance(7),
    createdAt: '2023-01-15T10:00:00Z', updatedAt: '2026-07-20T10:00:00Z',
  },
  {
    id: '3', trainerId: 'TR-003', firstName: 'Raj', lastName: 'Malhotra',
    email: 'raj.malhotra@gym.com', phone: '+91 98765 33333', gender: 'male',
    dateOfBirth: '1993-11-08', joinDate: '2023-06-01', status: 'active',
    specializations: ['hiit', 'zumba', 'cardio'],
    certifications: ['ACSM Certified Exercise Physiologist', 'Zumba Basic 1', 'TRX Suspension Training'],
    experience: 5, salary: 42000, rating: 4.7, totalClients: 52, totalClasses: 260,
    bio: 'High-energy fitness instructor specializing in group classes. Known for motivating sessions that make fitness fun and accessible for everyone.',
    availability: makeSchedule(true),
    assignedMembers: [],
    performance: makePerformance(5),
    createdAt: '2023-06-01T10:00:00Z', updatedAt: '2026-07-20T10:00:00Z',
  },
  {
    id: '4', trainerId: 'TR-004', firstName: 'Divya', lastName: 'Prasad',
    email: 'divya.prasad@gym.com', phone: '+91 98765 44444', gender: 'female',
    dateOfBirth: '1990-05-30', joinDate: '2024-01-10', status: 'active',
    specializations: ['boxing', 'strength', 'rehabilitation'],
    certifications: ['ISSA Certified Fitness Trainer', 'Boxing Trainer Level 3', 'Corrective Exercise Specialist'],
    experience: 7, salary: 50000, rating: 4.6, totalClients: 30, totalClasses: 180,
    bio: 'Professional boxing trainer with a competitive fighting background. Combines martial arts discipline with modern fitness techniques for transformative results.',
    availability: makeSchedule(true),
    assignedMembers: [],
    performance: makePerformance(1),
    createdAt: '2024-01-10T10:00:00Z', updatedAt: '2026-07-20T10:00:00Z',
  },
  {
    id: '5', trainerId: 'TR-005', firstName: 'Arjun', lastName: 'Mehta',
    email: 'arjun.mehta@gym.com', phone: '+91 98765 55555', gender: 'male',
    dateOfBirth: '1995-01-12', joinDate: '2025-03-01', status: 'on_leave',
    specializations: ['spinning', 'cardio', 'hiit'],
    certifications: ['Spinning Elite Instructor', 'AFAA Group Fitness'],
    experience: 3, salary: 35000, rating: 4.4, totalClients: 22, totalClasses: 120,
    bio: 'Energetic spinning instructor who brings outdoor cycling vibes indoors. Currently on medical leave, expected to return in August.',
    availability: makeSchedule(false),
    assignedMembers: [],
    performance: makePerformance(2),
    createdAt: '2025-03-01T10:00:00Z', updatedAt: '2026-07-01T10:00:00Z',
  },
  {
    id: '6', trainerId: 'TR-006', firstName: 'Priya', lastName: 'Nair',
    email: 'priya.nair@gym.com', phone: '+91 98765 66666', gender: 'female',
    dateOfBirth: '1987-09-25', joinDate: '2022-09-15', status: 'inactive',
    specializations: ['pilates', 'yoga', 'rehabilitation'],
    certifications: ['BASI Pilates', 'Yoga Therapy Certification', 'Sports Rehabilitation Diploma'],
    experience: 10, salary: 52000, rating: 4.8, totalClients: 35, totalClasses: 400,
    bio: 'Veteran pilates and yoga instructor with a decade of experience. Specializes in injury rehabilitation and corrective movement patterns.',
    availability: makeSchedule(false),
    assignedMembers: [],
    performance: makePerformance(4),
    createdAt: '2022-09-15T10:00:00Z', updatedAt: '2026-06-01T10:00:00Z',
  },
]

// ============================================
// API Functions
// ============================================

export async function fetchTrainers(): Promise<Trainer[]> {
  await delay(300)
  return [...MOCK_TRAINERS]
}

export async function fetchTrainerById(id: string): Promise<Trainer | undefined> {
  await delay(200)
  return MOCK_TRAINERS.find(t => t.id === id)
}

export async function createTrainer(data: Partial<Trainer>): Promise<Trainer> {
  await delay(400)
  const newTrainer: Trainer = {
    id: String(Date.now()),
    trainerId: `TR-${String(MOCK_TRAINERS.length + 1).padStart(3, '0')}`,
    firstName: data.firstName || '', lastName: data.lastName || '',
    email: data.email || '', phone: data.phone || '', gender: data.gender || 'male',
    dateOfBirth: data.dateOfBirth || '', joinDate: new Date().toISOString().split('T')[0],
    status: 'active', specializations: data.specializations || [],
    certifications: data.certifications || [], experience: data.experience || 0,
    salary: data.salary || 0, rating: 0, totalClients: 0, totalClasses: 0,
    bio: data.bio || '', availability: makeSchedule(false),
    assignedMembers: [], performance: makePerformance(0),
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    ...data,
  }
  MOCK_TRAINERS.unshift(newTrainer)
  return newTrainer
}

export async function updateTrainer(id: string, data: Partial<Trainer>): Promise<Trainer> {
  await delay(300)
  const index = MOCK_TRAINERS.findIndex(t => t.id === id)
  if (index === -1) throw new Error('Trainer not found')
  MOCK_TRAINERS[index] = { ...MOCK_TRAINERS[index], ...data, updatedAt: new Date().toISOString() }
  return MOCK_TRAINERS[index]
}

export async function deleteTrainer(id: string): Promise<void> {
  await delay(250)
  const index = MOCK_TRAINERS.findIndex(t => t.id === id)
  if (index !== -1) MOCK_TRAINERS.splice(index, 1)
}
