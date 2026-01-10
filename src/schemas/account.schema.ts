import { z } from 'zod'

export const profileSchema = z.object({
    name: z.string().min(1, { message: 'Name required' }),
    username: z.string().min(1, { message: 'Username required' }),
    email: z
        .string()
        .min(1, { message: 'Email required' })
        .email({ message: 'Invalid email address' }),

    dialCode: z.string().min(1, { message: 'Please select your country code' }),
    phone: z
        .string()
        .min(1, { message: 'Please input your mobile number' })
        .max(10, { message: 'Mobile number must be 10 digits' }),

    address: z.string().optional().nullable(),
    signature: z.string().optional().nullable(),
    profileImage: z.string().optional().nullable(),
    userRoles: z
        .array(
            z.object({
                location_id: z.number(),
                zone_id: z.number().optional().nullable(),
                cluster_id: z.number().optional().nullable(),
                department: z.array(
                    z.object({
                        department_id: z.number(),
                        roles: z.array(
                            z.object({
                                value: z.number(),
                                label: z.string(),
                            }),
                        ),
                    }),
                ),
            }),
        )
        .optional(),
})

export type ProfileFormSchema = z.infer<typeof profileSchema>
