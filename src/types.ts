export interface Class {
  id: string;
  name: string;
  teacher: string;
  startDate: string;
  endDate: string;
  createdAt: number;
}

export interface Student {
  id: string;
  classId: string;
  name: string;
  rollNumber: string;
  motherName?: string;
  phone?: string;
  gender?: 'Male' | 'Female' | 'Other';
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  date: string;
  records: {
    studentId: string;
    status: 'present' | 'absent';
  }[];
}
