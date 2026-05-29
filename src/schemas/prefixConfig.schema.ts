import { z } from 'zod'

const segmentRuleSchema = z
    .object({
        type: z.enum(['any', 'letters', 'numbers', 'alphanumeric']),
        case: z.enum(['any', 'upper', 'lower', 'title']),
        min_length: z.coerce.number().int().min(1).max(255),
        max_length: z.coerce.number().int().min(1).max(255),
        starts_with: z.enum(['any', 'letter', 'number']),
    })
    .refine((value) => value.max_length >= value.min_length, {
        message: 'Max must be greater than or equal to min',
        path: ['max_length'],
    })

export const prefixConfigSchema = z.object({
    master_key: z.string().min(1, 'Master is required'),
    master_name: z.string().optional(),
    separator: z.string().min(1, 'Separator is required').max(5),
    segment_count: z.coerce.number().int().min(1).max(20),
    value_min_length: z.coerce.number().int().min(1).max(255),
    value_max_length: z.coerce.number().int().min(1).max(255),
    characters_min_length: z.coerce.number().int().min(1).max(255),
    characters_max_length: z.coerce.number().int().min(1).max(255),
    segments: z
        .array(segmentRuleSchema)
        .min(1, 'At least one segment is required'),
    is_active: z.boolean().optional(),
})

export type PrefixConfigFormSchema = z.infer<typeof prefixConfigSchema>
