import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../apiClient';
import { Classroom, CreateClassroomDto, UpdateClassroomDto } from '../../types/classroom';
import { API_ENDPOINTS } from '../../constants/api';
import { CLASSROOM_KEYS } from '../queries/classrooms.queries';

export function useCreateClassroomMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: CreateClassroomDto): Promise<Classroom> => {
      try {
        const res = await apiClient.post<{ success: boolean; data: Classroom }>(API_ENDPOINTS.CLASSROOMS, dto);
        if (res.data && typeof res.data === 'object' && 'data' in res.data && res.data.data) {
          return res.data.data;
        }
        throw new Error('Fallback local');
      } catch {
        const newClassroom: Classroom = {
          ...dto,
          id: `cls-${Date.now()}`,
          totalStudents: 0,
          createdAt: new Date().toISOString(),
        };
        const local = localStorage.getItem('app_cached_classrooms');
        const list: Classroom[] = local ? JSON.parse(local) : [];
        list.push(newClassroom);
        localStorage.setItem('app_cached_classrooms', JSON.stringify(list));
        return newClassroom;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASSROOM_KEYS.all });
    },
  });
}

export function useUpdateClassroomMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateClassroomDto }): Promise<Classroom> => {
      try {
        const res = await apiClient.put<{ success: boolean; data: Classroom }>(API_ENDPOINTS.CLASSROOM_BY_ID(id), dto);
        if (res.data && typeof res.data === 'object' && 'data' in res.data && res.data.data) {
          return res.data.data;
        }
        throw new Error('Fallback local');
      } catch {
        const local = localStorage.getItem('app_cached_classrooms');
        let list: Classroom[] = local ? JSON.parse(local) : [];
        list = list.map((c) => (c.id === id ? { ...c, ...dto, updatedAt: new Date().toISOString() } : c));
        localStorage.setItem('app_cached_classrooms', JSON.stringify(list));
        return list.find((c) => c.id === id)!;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASSROOM_KEYS.all });
    },
  });
}

export function useDeleteClassroomMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<boolean> => {
      try {
        await apiClient.delete(API_ENDPOINTS.CLASSROOM_BY_ID(id));
        return true;
      } catch {
        const local = localStorage.getItem('app_cached_classrooms');
        if (local) {
          const list: Classroom[] = JSON.parse(local);
          const filtered = list.filter((c) => c.id !== id);
          localStorage.setItem('app_cached_classrooms', JSON.stringify(filtered));
        }
        return true;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASSROOM_KEYS.all });
    },
  });
}
