import { z } from 'zod';
import { UI } from '../../constants/index.ts';

export const accountSchema = z.object({
  code: z.string().min(1, { message: UI.validation.required }),
  name: z.string().min(1, { message: UI.validation.required }),
  type: z.enum(['asset', 'liability', 'equity', 'revenue', 'expense']),
  normalBalance: z.enum(['debit', 'credit']),
  balance: z.number().nonnegative({ message: UI.validation.invalidNumber })
});

export type AccountFormValues = z.infer<typeof accountSchema>;
