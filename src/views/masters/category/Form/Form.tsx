import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import type { CommonProps } from '@/@types/common'
import { CategoryFormSchema, categorySchema } from '@/schemas/category.schema'
import MasterForm from '@/components/form/MasterForm'

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
                        <OverviewSection readOnly={readOnly} />
                    </div>
                </div>
            </Container>

            <BottomStickyBar>{children}</BottomStickyBar>
        </MasterForm>
    )
}

export default CategoryForm
