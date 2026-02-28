import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import type { CommonProps } from '@/@types/common'
import { CategoryFormSchema, categorySchema } from '@/schemas/category.schema'
import MasterForm from '@/components/form/MasterForm'
import FormSectionLayout from '@/components/layouts/FormSectionLayout'
import TextField from '@/components/form/fields/TextField'

type CategoryFormProps = {
    onFormSubmit: (values: CategoryFormSchema) => void
    defaultValues: CategoryFormSchema
    readOnly: boolean
} & CommonProps

const CategoryForm = ({
    onFormSubmit,
    defaultValues,
    readOnly = false,
    children,
}: CategoryFormProps) => {
    return (
        <MasterForm
            schema={categorySchema}
            defaultValues={defaultValues}
            onSubmit={onFormSubmit}
        >
            <Container>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex flex-col gap-4 flex-auto">
                        <FormSectionLayout title="Category">
                            <TextField
                                name="name"
                                label="Category"
                                placeholder="Enter Category"
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

export default CategoryForm
