import { User, Course, Module, Lesson, Assignment, Department, Device, Certificate, Quiz } from '../types';

export interface DatabaseSchema {
  users: User[];
  departments: Department[];
  devices: Device[];
  courses: Course[];
  modules: Record<string, Module[]>;
  assignments: Assignment[];
  enrollments: any[];
  notifications: any[];
  analytics: Record<string, any>;
  quizzes: Record<string, Quiz>;
  certificates: Certificate[];
}
