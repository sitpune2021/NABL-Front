import { z } from 'zod'

export const clusterSchema = z.object({
    zone_id: z.union([
        z.string().min(1, { message: ' Zone required' }),
        z.number(),
    ]),
    name: z.string().min(1, { message: 'Name required' }),
    identifier: z.string().regex(/^[A-Z]{1,4}-[A-Z]{1,4}$/, {
        message:
            'Prefix must be in format ZZZ-XXXX (zone prefix + 1–4 uppercase letters only)',
    }),
})
export type ClusterFormSchema = z.infer<typeof clusterSchema>
