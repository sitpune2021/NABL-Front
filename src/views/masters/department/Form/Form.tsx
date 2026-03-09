import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import type { CommonProps } from '@/@types/common'
import {
    DepartmentFormSchema,
    departmentSchema,
} from '@/schemas/department.schema'
import MasterForm from '@/components/form/MasterForm'
import FormSectionLayout from '@/components/layouts/FormSectionLayout'
import TextField from '@/components/form/fields/TextField'

type DepartmentFormProps = {
    onFormSubmit: (values: DepartmentFormSchema) => void
    defaultValues: DepartmentFormSchema
    readOnly: boolean
} & CommonProps

const DepartmentForm = ({
    onFormSubmit,
    defaultValues,
    readOnly = false,
    children,
}: DepartmentFormProps) => {
    return (
        <MasterForm
            schema={departmentSchema}
            defaultValues={defaultValues}
            onSubmit={onFormSubmit}
        >
            <Container>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="gap-4 flex flex-col flex-auto">
                        <FormSectionLayout title="Department">
                            <TextField
                                name="name"
                                label="Department"
                                placeholder="Enter Department"
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

export default DepartmentForm
