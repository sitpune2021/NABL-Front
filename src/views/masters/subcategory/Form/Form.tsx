import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import type { CommonProps } from '@/@types/common'
import {
    SubCategoryFormSchema,
    subCategorySchema,
} from '@/schemas/sub_category.schema'
import MasterForm from '@/components/form/MasterForm'

type SubCategoryFormProps = {
    onFormSubmit: (values: SubCategoryFormSchema) => void
    defaultValues: SubCategoryFormSchema
    readOnly?: boolean
} & CommonProps

const SubCategoryForm = ({
    onFormSubmit,
    defaultValues,
    readOnly = false,
    children,
}: SubCategoryFormProps) => {
    return (
        <MasterForm
            schema={subCategorySchema}
            defaultValues={defaultValues}
            onSubmit={onFormSubmit}
        >
            <Container>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="gap-4 flex flex-col flex-auto">
                        <OverviewSection readOnly={readOnly} />
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </MasterForm>
    )
}

export default SubCategoryForm
