import { dbStore } from '../database/inMemoryStore';
import { Classroom } from '../types/classroom';

export class ClassroomsRepository {
  async findAll(): Promise<Classroom[]> {
    return dbStore.getClassrooms();
  }

  async findById(id: string): Promise<Classroom | undefined> {
    return dbStore.getClassroomById(id);
  }

  async create(classroom: Classroom): Promise<Classroom> {
    return dbStore.createClassroom(classroom);
  }

  async update(id: string, updates: Partial<Classroom>): Promise<Classroom | undefined> {
    return dbStore.updateClassroom(id, updates);
  }

  async delete(id: string): Promise<boolean> {
    return dbStore.deleteClassroom(id);
  }
}

export const classroomsRepository = new ClassroomsRepository();
