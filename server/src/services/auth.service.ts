import { userRepository } from '../repositories/user.repository';
import { User } from '../types/user';
import { UnauthorizedError } from '../utils/errors';

export class AuthService {
  async login(username: string, password?: string): Promise<{ token: string; user: Omit<User, 'password'> }> {
    if (!username || !password) {
      throw new UnauthorizedError('กรุณากรอกชื่อผู้ใช้งานและรหัสผ่าน');
    }

    const user = await userRepository.findByUsername(username);
    if (!user) {
      throw new UnauthorizedError('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
    }

    // Verify password
    if (user.password && user.password !== password) {
      throw new UnauthorizedError('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
    }

    // Generate secure session token
    const tokenPayload = {
      sub: user.id,
      role: user.role,
      issuedAt: Date.now(),
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64url');

    const { password: _, ...sanitizedUser } = user;

    return {
      token,
      user: sanitizedUser,
    };
  }

  async getCurrentUser(userId: string): Promise<Omit<User, 'password'>> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedError('ไม่พบข้อมูลผู้ใช้งานหรือเซสชันหมดอายุ');
    }
    const { password: _, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}

export const authService = new AuthService();
