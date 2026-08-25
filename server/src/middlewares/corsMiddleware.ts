import cors from 'cors';
import { corsConfig } from '../config/corsConfig';

export const corsMiddleware = cors(corsConfig);
