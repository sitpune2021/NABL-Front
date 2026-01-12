import { z } from 'zod'

export const userSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    username: z.string().min(1, 'Username is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email'),

    dialCode: z.string().optional(),
    phone: z
        .string()
        .min(1, 'Phone number is required')
        .max(10, 'Phone number must be 10 digits'),
    address: z.string().optional(),
    city: z.string().optional(),
    postcode: z.string().optional(),
    profileImage: z.string().optional(),
    signature: z.string().optional(),
    userRoles: z
        .array(
            z.object({
                zone_id: z.union([z.string(), z.number()]).optional(),
                cluster_id: z.union([z.string(), z.number()]).optional(),
                location_id: z.union([z.string(), z.number()]).optional(),

                department: z
                    .array(
                        z.object({
                            department_id: z
                                .union([z.string(), z.number()])
                                .optional(),

                            roles: z
                                .array(
                                    z.object({
                                        value: z
                                            .union([z.string(), z.number()])
                                            .optional(),
                                        label: z.string().optional(),
                                    }),
                                )
                                .optional(),

                            permissions: z
                                .record(z.string(), z.array(z.string()))
                                .optional(),
                        }),
                    )
                    .optional(),
            }),
        )
        .optional(),
    labAssignments: z
        .record(
            z.string(), // zone / lab id
            z.record(
                z.string(), // location id
                z.object({
                    locationId: z.string(),
                    roleId: z.string().optional(),
                }),
            ),
        )
        .optional(),
})

export type UserSchemaType = z.infer<typeof userSchema>
