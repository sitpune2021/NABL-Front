import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { CommonProps } from '@/@types/common'
import { LocationFormSchema } from '@/@types/location'

type LocationFormProps = {
    onFormSubmit: (values: LocationFormSchema) => void
    defaultValues?: LocationFormSchema
    newLocation?: boolean
    readOnly?: boolean
} & CommonProps

const validationSchema = z.object({
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
        message:
            'Prefix must be in format ZZZ-YYY-XXXX (zone prefix + cluster prefix + 1–4 uppercase letters only)',
    }),
})

const LocationForm = (props: LocationFormProps) => {
    const {
        onFormSubmit,
        defaultValues = {},
        readOnly = false,
        children,
    } = props

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
    } = useForm<LocationFormSchema>({
        defaultValues: {
            ...defaultValues,
        },
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(defaultValues)])

    const onSubmit = (values: LocationFormSchema) => {
        onFormSubmit?.(values)
    }

    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="gap-4 flex flex-col flex-auto">
                        <OverviewSection
                            control={control}
                            errors={errors}
                            readOnly={readOnly}
                        />
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default LocationForm
