import { z } from 'zod'
import { validatePrefixRule } from '@/utils/validation/prefixConfigValidation'

export const locationSchema = z.object({
    name: z.string().min(1, { message: ' name required' }),
    zone_id: z.union([
        z.string().min(1, { message: ' zone required' }),
        z.number(),
    ]),
    cluster_id: z.union([
        z.string().min(1, { message: ' cluster required' }),
        z.number(),
    ]),
    short_name: z.any(),
    identifier: z
        .string()
        .min(1, 'Prefix is required')
        .superRefine(async (value, ctx) => {
            const errors = await validatePrefixRule('locations', value)

            errors.forEach((message) =>
                ctx.addIssue({ code: 'custom', message }),
            )
        }),
})

export type LocationFormSchema = z.infer<typeof locationSchema>
