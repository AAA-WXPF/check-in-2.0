
export enum Role {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

export interface User {
  id: string;
  name: string;
  role: Role;
  loginId: string; // Employee ID or Student ID
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string; // ISO Date string YYYY-MM-DD
  timestamp: string;
  method: 'QR' | 'PASSCODE' | 'MANUAL';
  status: 'PRESENT' | 'LATE';
}

export interface AttendanceSession {
  isActive: boolean;
  type: 'QR' | 'PASSCODE' | 'BOTH';
  code: string;
  qrValue: string;
  startTime: number;
}

export type ViewState = 
  | 'LOGIN' 
  | 'DASHBOARD' 
  | 'ATTENDANCE_SETTINGS' 
  | 'HISTORY' 
  | 'USER_MANAGEMENT'
  | 'RANDOM_CHECK'
  | 'STUDENT_CHECKIN';
