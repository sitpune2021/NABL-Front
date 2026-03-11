import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import type { CommonProps } from '@/@types/common'
import { ZoneFormSchema, zoneSchema } from '@/schemas/zone.schema'
import MasterForm from '@/components/form/MasterForm'
import FormSectionLayout from '@/components/layouts/FormSectionLayout'
import TextField from '@/components/form/fields/TextField'

type ZoneFormProps = {
    onFormSubmit: (values: ZoneFormSchema) => void
    defaultValues: ZoneFormSchema
    readOnly: boolean
} & CommonProps

const ZoneForm = ({
    onFormSubmit,
    defaultValues,
    readOnly = false,
    children,
}: ZoneFormProps) => {
    return (
        <MasterForm
            schema={zoneSchema}
            defaultValues={defaultValues}
            onSubmit={onFormSubmit}
        >
            <Container>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex flex-col gap-4 flex-auto">
                        <FormSectionLayout title="Zone">
                            <TextField
                                name="name"
                                label="Zone"
                                placeholder="Enter Zone"
                                readOnly={readOnly}
                            />

                            <TextField
                                name="identifier"
                                label="Prefix"
                                placeholder="Enter Prefix"
                                readOnly={readOnly}
                            />
                        </FormSectionLayout>
                    </div>
                </div>
            </Container>

            <BottomStickyBar>{children}</BottomStickyBar>
        </MasterForm>
    )
}

export default ZoneForm
