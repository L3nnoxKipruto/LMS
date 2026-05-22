import { useQuery } from '@tanstack/react-query';
import { courseService } from '../services/api';

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: () => courseService.getCourses(),
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => courseService.getCourseById(id),
    enabled: !!id,
  });
}

export function useCourseModules(courseId: string) {
  return useQuery({
    queryKey: ['course-modules', courseId],
    queryFn: () => courseService.getCourseModules(courseId),
    enabled: !!courseId,
  });
}

export function useMyCourses() {
  return useQuery({
    queryKey: ['my-courses'],
    queryFn: () => courseService.getMyCourses(),
  });
}
