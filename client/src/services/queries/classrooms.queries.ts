import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../apiClient';
import { Classroom } from '../../types/classroom';
import { API_ENDPOINTS } from '../../constants/api';
import { MOCK_CLASSROOMS } from '../../mocks/classrooms.mock';

export const CLASSROOM_KEYS = {
  all: ['classrooms'] as const,
  lists: () => [...CLASSROOM_KEYS.all, 'list'] as const,
  detail: (id: string) => [...CLASSROOM_KEYS.all, 'detail', id] as const,
};

export async function fetchClassrooms(): Promise<Classroom[]> {
  try {
    const res = await apiClient.get<{ success: boolean; data: Classroom[] }>(API_ENDPOINTS.CLASSROOMS);
    if (res.data && typeof res.data === 'object' && 'data' in res.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    const local = localStorage.getItem('app_cached_classrooms');
    if (local) return JSON.parse(local);
    return MOCK_CLASSROOMS;
  } catch {
    // Fallback to mock data if backend is booting or in dev
    const local = localStorage.getItem('app_cached_classrooms');
    if (local) return JSON.parse(local);
    return MOCK_CLASSROOMS;
  }
}

export function useClassroomsQuery() {
  return useQuery({
    queryKey: CLASSROOM_KEYS.lists(),
    queryFn: fetchClassrooms,
    staleTime: 1000 * 60 * 5, // 5 mins
  });
}

export function useClassroomDetailQuery(id: string) {
  return useQuery({
    queryKey: CLASSROOM_KEYS.detail(id),
    queryFn: async () => {
      try {
        const res = await apiClient.get<{ success: boolean; data: Classroom }>(API_ENDPOINTS.CLASSROOM_BY_ID(id));
        if (res.data && typeof res.data === 'object' && 'data' in res.data && res.data.data) {
          return res.data.data;
        }
        const all = await fetchClassrooms();
        return all.find((c) => c.id === id) || null;
      } catch {
        const all = await fetchClassrooms();
        return all.find((c) => c.id === id) || null;
      }
    },
    enabled: !!id,
  });
}
