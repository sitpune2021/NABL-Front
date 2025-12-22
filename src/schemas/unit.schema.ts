import { z } from 'zod'

export const unitSchema = z.object({
    name: z.string().min(1, { message: ' Name required' }),
})

export type UnitFormSchema = z.infer<typeof unitSchema>
