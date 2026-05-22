import { Assignment } from '../types';
import { dbGetAssignments, dbSubmitAssignment } from '../mock-db/db';

const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

const getCurrentUserId = (): string => {
  const userJson = localStorage.getItem('jh_user');
  if (!userJson) return '';
  try {
    return JSON.parse(userJson).id;
  } catch {
    return '';
  }
};

export const assignmentService = {
  getAssignments: async (): Promise<Assignment[]> => {
    await delay(200);
    const userId = getCurrentUserId();
    const userRole = localStorage.getItem('jh_user') ? JSON.parse(localStorage.getItem('jh_user')!).role : '';
    
    const allAssignments = dbGetAssignments();
    if (userRole === 'lecturer' || userRole === 'admin') {
      return allAssignments;
    }
    
    // Filter assignments for student (using mock db logic)
    const enrollments = JSON.parse(localStorage.getItem('jh_db_enrollments') || '[]');
    const studentEnrollments = enrollments.filter((e: any) => e.studentId === userId);
    const enrolledCourseIds = studentEnrollments.map((e: any) => e.courseId);
    return allAssignments.filter(a => enrolledCourseIds.includes(a.courseId));
  },
  submitAssignment: async (id: string, textContent: string): Promise<any> => {
    await delay(300);
    const userId = getCurrentUserId();
    if (!userId) throw new Error('Unauthorized');
    dbSubmitAssignment(userId, id, textContent);
    return { success: true };
  }
};
