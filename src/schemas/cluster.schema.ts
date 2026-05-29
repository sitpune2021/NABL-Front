import { z } from 'zod'
import { validatePrefixRule } from '@/utils/validation/prefixConfigValidation'

export const clusterSchema = z.object({
    zone_id: z.union([
        z.string().min(1, { message: ' Zone required' }),
        z.number(),
    ]),
    name: z.string().min(1, { message: 'Name required' }),
    identifier: z
        .string()
        .min(1, 'Prefix is required')
        .superRefine(async (value, ctx) => {
            const errors = await validatePrefixRule('clusters', value)

            errors.forEach((message) =>
                ctx.addIssue({ code: 'custom', message }),
            )
        }),
})

export type ClusterFormSchema = z.infer<typeof clusterSchema>
