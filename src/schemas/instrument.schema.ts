import { z } from 'zod'
import { validatePrefixRule } from '@/utils/validation/prefixConfigValidation'

export const instrumentSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    short_name: z.string().min(1, { message: 'Short Name is required' }),
    manufacturer: z.string().min(1, { message: 'Manufacturer is required' }),
    serial_no: z.string().min(1, { message: 'Serial Number is required' }),
    vendor_name: z.string().min(1, { message: 'Vendor Name is required' }),
    identifier: z
        .string()
        .min(1, { message: 'Prefix is required' })
        .superRefine(async (value, ctx) => {
            const errors = await validatePrefixRule('instruments', value)

            errors.forEach((message) =>
                ctx.addIssue({ code: 'custom', message }),
            )
        }),
})

export type InstrumentFormSchema = z.infer<typeof instrumentSchema>
