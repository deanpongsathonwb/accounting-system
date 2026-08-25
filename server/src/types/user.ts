import { AuthRole } from '../constants/auth';

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  email: string;
  role: AuthRole;
  avatarUrl?: string;
  assignedClassrooms?: string[];
  createdAt: string;
  updatedAt: string;
}
