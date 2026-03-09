import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import type { CommonProps } from '@/@types/common'
import { UnitFormSchema, unitSchema } from '@/schemas/unit.schema'
import MasterForm from '@/components/form/MasterForm'
import FormSectionLayout from '@/components/layouts/FormSectionLayout'
import TextField from '@/components/form/fields/TextField'

type UnitFormProps = {
    onFormSubmit: (values: UnitFormSchema) => void
    defaultValues: UnitFormSchema
    readOnly: boolean
} & CommonProps

const UnitForm = ({
    onFormSubmit,
    defaultValues,
    readOnly = false,
    children,
}: UnitFormProps) => {
    return (
        <MasterForm
            schema={unitSchema}
            defaultValues={defaultValues}
            onSubmit={onFormSubmit}
        >
            <Container>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="gap-4 flex flex-col flex-auto">
                        <FormSectionLayout title="Unit">
                            <TextField
                                name="name"
                                label="Unit"
                                placeholder="Enter Unit"
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

export default UnitForm
