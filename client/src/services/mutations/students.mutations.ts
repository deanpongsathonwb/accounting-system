import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../apiClient';
import { Student, CreateStudentDto, UpdateStudentDto } from '../../types/student';
import { API_ENDPOINTS } from '../../constants/api';
import { STUDENT_KEYS } from '../queries/students.queries';
import { CLASSROOM_KEYS } from '../queries/classrooms.queries';

export function useCreateStudentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: CreateStudentDto): Promise<Student> => {
      try {
        const res = await apiClient.post<{ success: boolean; data: Student }>(API_ENDPOINTS.STUDENTS, dto);
        if (res.data && typeof res.data === 'object' && 'data' in res.data && res.data.data) {
          return res.data.data;
        }
        throw new Error('Fallback local');
      } catch {
        const newStudent: Student = {
          ...dto,
          id: `std-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        const local = localStorage.getItem('app_cached_students');
        const list: Student[] = local ? JSON.parse(local) : [];
        list.push(newStudent);
        localStorage.setItem('app_cached_students', JSON.stringify(list));
        return newStudent;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: CLASSROOM_KEYS.all });
    },
  });
}

export function useUpdateStudentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateStudentDto }): Promise<Student> => {
      try {
        const res = await apiClient.put<{ success: boolean; data: Student }>(API_ENDPOINTS.STUDENT_BY_ID(id), dto);
        if (res.data && typeof res.data === 'object' && 'data' in res.data && res.data.data) {
          return res.data.data;
        }
        throw new Error('Fallback local');
      } catch {
        const local = localStorage.getItem('app_cached_students');
        let list: Student[] = local ? JSON.parse(local) : [];
        list = list.map((s) => (s.id === id ? { ...s, ...dto, updatedAt: new Date().toISOString() } : s));
        localStorage.setItem('app_cached_students', JSON.stringify(list));
        return list.find((s) => s.id === id)!;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.all });
    },
  });
}

export function useDeleteStudentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<boolean> => {
      try {
        await apiClient.delete(API_ENDPOINTS.STUDENT_BY_ID(id));
        return true;
      } catch {
        const local = localStorage.getItem('app_cached_students');
        if (local) {
          const list: Student[] = JSON.parse(local);
          const filtered = list.filter((s) => s.id !== id);
          localStorage.setItem('app_cached_students', JSON.stringify(filtered));
        }
        return true;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: CLASSROOM_KEYS.all });
    },
  });
}
