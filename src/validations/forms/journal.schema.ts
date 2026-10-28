import { z } from 'zod';
import { UI } from '../../constants/index.ts';

export const journalLineSchema = z.object({
  accountId: z.string().min(1, { message: UI.validation.required }),
  accountCode: z.string(),
  accountName: z.string(),
  debit: z.number().nonnegative(),
  credit: z.number().nonnegative()
});

export const journalSchema = z.object({
  date: z.string().min(1, { message: UI.validation.required }),
  memo: z.string().min(1, { message: UI.validation.required }),
  lines: z.array(journalLineSchema).min(2, { message: UI.validation.minOneLine })
});

export type JournalFormValues = z.infer<typeof journalSchema>;
