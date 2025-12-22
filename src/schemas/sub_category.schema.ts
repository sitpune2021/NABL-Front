import { z } from 'zod'

export const subCategorySchema = z.object({
    cat_id: z.union([
        z.number(),
        z.string().min(1, { message: 'category required' }),
    ]),
    name: z.string().min(1, { message: ' name required' }),
    identifier: z.string().regex(/^[A-Z]{1,4}-[A-Z]{1,4}$/, {
        message:
            'Prefix must be in format ZZZ-XXXX (zone prefix + 1–4 uppercase letters only)',
    }),
})

export type SubCategoryFormSchema = z.infer<typeof subCategorySchema>
