import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export class AuthController {
  async login(req: Request, res: Response) {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    return sendSuccess(res, result, 'เข้าสู่ระบบสำเร็จ');
  }

  async me(req: AuthenticatedRequest, res: Response) {
    if (!req.user?.id) {
      return sendSuccess(res, null, 'ไม่ได้เข้าสู่ระบบ');
    }
    const user = await authService.getCurrentUser(req.user.id);
    return sendSuccess(res, user, 'ดึงข้อมูลโปรไฟล์สำเร็จ');
  }

  async logout(_req: Request, res: Response) {
    return sendSuccess(res, null, 'ออกจากระบบสำเร็จ');
  }
}

export const authController = new AuthController();
