import { Class, Student, AttendanceRecord } from '../types.ts';

const STORAGE_KEYS = {
  CLASSES: 'myclass_classes',
  STUDENTS: 'myclass_students',
  ATTENDANCE: 'myclass_attendance',
};

export const storage = {
  // Classes
  getClasses: (): Class[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CLASSES);
    return data ? JSON.parse(data) : [];
  },
  saveClass: (cls: Class) => {
    const classes = storage.getClasses();
    classes.push(cls);
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
  },
  
  // Students
  getStudents: (classId?: string): Student[] => {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    const students: Student[] = data ? JSON.parse(data) : [];
    if (classId) {
      return students.filter(s => s.classId === classId);
    }
    return students;
  },
  saveStudent: (student: Student) => {
    const students = storage.getStudents();
    students.push(student);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  // Attendance
  getAttendance: (classId: string): AttendanceRecord[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    const records: AttendanceRecord[] = data ? JSON.parse(data) : [];
    return records.filter(r => r.classId === classId);
  },
  saveAttendance: (record: AttendanceRecord) => {
    const records: AttendanceRecord[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE) || '[]');
    // Check if record for this date already exists
    const index = records.findIndex(r => r.classId === record.classId && r.date === record.date);
    if (index >= 0) {
      records[index] = record;
    } else {
      records.push(record);
    }
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
  }
};
