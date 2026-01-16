import { z } from 'zod'

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
    identifier: z.string().regex(/^[A-Z]{1,4}-[A-Z]{1,4}-[A-Z]{1,4}$/, {
        message: 'Prefix must follow ZZZ-YYY-XXXX (1–4 uppercase letters)',
    }),
})
export type LocationFormSchema = z.infer<typeof locationSchema>
