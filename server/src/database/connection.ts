import { dbStore } from './inMemoryStore';
import { logger } from '../utils/logger';

export async function connectDatabase(): Promise<void> {
  try {
    dbStore.init();
    logger.info('Database connection established successfully.');
  } catch (error) {
    logger.error('Failed to initialize database store', error);
    throw error;
  }
}
