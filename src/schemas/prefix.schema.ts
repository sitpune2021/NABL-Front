import { z } from 'zod'

export const prefixSchema = z
    .object({
        prefix_master: z.string().min(1, 'Prefix master is required'),

        type: z.string().min(1, 'Type is required'),

        min_length: z.coerce
            .number()
            .min(1, 'Minimum length must be at least 1')
            .max(10, 'Minimum length cannot exceed 10'),

        max_length: z.coerce
            .number()
            .min(1, 'Maximum length must be at least 1')
            .max(10, 'Maximum length cannot exceed 10'),
    })
    .refine((data) => data.max_length >= data.min_length, {
        message: 'Max length must be greater than or equal to min length',
        path: ['max_length'],
    })

export type PrefixFormSchema = z.infer<typeof prefixSchema>
