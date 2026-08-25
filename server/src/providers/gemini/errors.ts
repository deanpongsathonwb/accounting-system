import { AppError } from '../../utils/errors';
import { HTTP_STATUS } from '../../constants/http';

export class GeminiProviderError extends AppError {
  constructor(message: string = 'เกิดข้อผิดพลาดในการประมวลผลด้วย AI') {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
