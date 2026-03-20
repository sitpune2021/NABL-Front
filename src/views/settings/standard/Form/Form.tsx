import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import type { CommonProps } from '@/@types/common'
import StandardRecursiveSection from './StandardRecursiveSection'
import { StandardFormSchema, standardSchema } from '@/schemas/standard.schema'
import MasterForm from '@/components/form/MasterForm'
import FormSectionLayout from '@/components/layouts/FormSectionLayout'
import TextField from '@/components/form/fields/TextField'

type StandardFormProps = {
    onFormSubmit: (values: StandardFormSchema) => void
    defaultValues?: StandardFormSchema
    readOnly?: boolean
} & CommonProps

const StandardForm = ({
    onFormSubmit,
    defaultValues,
    readOnly = false,
    children,
}: StandardFormProps) => {
    return (
        <MasterForm
            schema={standardSchema}
            defaultValues={defaultValues}
            onSubmit={onFormSubmit}
        >
            <Container>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex flex-col flex-auto gap-6">
                        <FormSectionLayout title="Standard">
                            <TextField
                                name="name"
                                label="Name"
                                placeholder="Enter name"
                                readOnly={readOnly}
                            />

                            <TextField
                                name="uuid"
                                label="Unique Id"
                                placeholder="Enter Unique Id"
                                readOnly={true}
                            />
                        </FormSectionLayout>
                        <StandardRecursiveSection
                            isRoot
                            name="clauses"
                            readOnly={readOnly}
                            depth={0}
                        />
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </MasterForm>
    )
}

export default StandardForm
