import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../apiClient';
import { Student } from '../../types/student';
import { API_ENDPOINTS } from '../../constants/api';

export const STUDENT_KEYS = {
  all: ['students'] as const,
  byClass: (classroomId?: string) => [...STUDENT_KEYS.all, 'byClass', classroomId] as const,
  detail: (id: string) => [...STUDENT_KEYS.all, 'detail', id] as const,
};

export async function fetchStudents(classroomId?: string): Promise<Student[]> {
  try {
    const url = classroomId ? `${API_ENDPOINTS.STUDENTS}?classroomId=${classroomId}` : API_ENDPOINTS.STUDENTS;
    const res = await apiClient.get<{ success: boolean; data: Student[] }>(url);
    if (res.data && typeof res.data === 'object' && 'data' in res.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return [];
  } catch {
    return [];
  }
}

export function useStudentsQuery(classroomId?: string) {
  return useQuery({
    queryKey: STUDENT_KEYS.byClass(classroomId),
    queryFn: () => fetchStudents(classroomId),
    staleTime: 1000 * 60 * 3,
  });
}

export function useStudentDetailQuery(id: string) {
  return useQuery({
    queryKey: STUDENT_KEYS.detail(id),
    queryFn: async () => {
      try {
        const res = await apiClient.get<{ success: boolean; data: Student }>(API_ENDPOINTS.STUDENT_BY_ID(id));
        if (res.data && typeof res.data === 'object' && 'data' in res.data && res.data.data) {
          return res.data.data;
        }
        return null;
      } catch {
        return null;
      }
    },
    enabled: !!id,
  });
}
