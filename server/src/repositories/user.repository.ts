import { dbStore } from '../database/inMemoryStore';
import { User } from '../types/user';

export class UserRepository {
  async findAll(): Promise<User[]> {
    return dbStore.getUsers();
  }

  async findById(id: string): Promise<User | undefined> {
    return dbStore.getUserById(id);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return dbStore.getUserByUsername(username);
  }
}

export const userRepository = new UserRepository();
