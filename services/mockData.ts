
import { User, Role, AttendanceRecord } from '../types';

const USERS_KEY = 'smartattend_users';
const RECORDS_KEY = 'smartattend_records';
const LAST_LOGIN_KEY = 'smartattend_last_login';

// Initial Seed Data
const INITIAL_USERS: User[] = [
  { id: '1', name: '王老师', role: Role.TEACHER, loginId: 'T1001' },
  { id: '2', name: '李同学', role: Role.STUDENT, loginId: 'S2023001' },
  { id: '3', name: '张同学', role: Role.STUDENT, loginId: 'S2023002' },
  { id: '4', name: '陈同学', role: Role.STUDENT, loginId: 'S2023003' },
  { id: '5', name: '刘同学', role: Role.STUDENT, loginId: 'S2023004' },
];

export const getUsers = (): User[] => {
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) {
    localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  return JSON.parse(stored);
};

export const saveUser = (user: User) => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const deleteUser = (id: string) => {
  const users = getUsers().filter(u => u.id !== id);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getRecords = (): AttendanceRecord[] => {
  const stored = localStorage.getItem(RECORDS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveRecord = (record: AttendanceRecord) => {
  const records = getRecords();
  // Prevent duplicate check-ins for same day
  const exists = records.find(r => r.studentId === record.studentId && r.date === record.date);
  if (exists) return; // Already checked in
  
  records.push(record);
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
};

export const checkAlreadySignedIn = (studentId: string): boolean => {
  const records = getRecords();
  const today = new Date().toISOString().split('T')[0];
  return records.some(r => r.studentId === studentId && r.date === today);
};

// --- Last Login Features ---

export const saveLastLogin = (user: User) => {
  localStorage.setItem(LAST_LOGIN_KEY, JSON.stringify(user));
};

export const getLastLogin = (): User | null => {
  const stored = localStorage.getItem(LAST_LOGIN_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const clearLastLogin = () => {
  localStorage.removeItem(LAST_LOGIN_KEY);
};
