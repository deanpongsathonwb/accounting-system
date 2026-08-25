import { userRepository } from '../repositories/user.repository';
import { User } from '../types/user';
import { UnauthorizedError } from '../utils/errors';

export class AuthService {
  async login(username: string, _password?: string): Promise<{ token: string; user: User }> {
    const user = await userRepository.findByUsername(username);
    if (!user) {
      // Default to admin user for mock/demo
      const users = await userRepository.findAll();
      const defaultUser = users[0];
      return {
        token: `mock_jwt_token_${defaultUser.id}_${Date.now()}`,
        user: defaultUser,
      };
    }

    return {
      token: `mock_jwt_token_${user.id}_${Date.now()}`,
      user,
    };
  }

  async getCurrentUser(userId: string): Promise<User> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedError('ไม่พบข้อมูลผู้ใช้งาน');
    }
    return user;
  }
}

export const authService = new AuthService();
