import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import type { CommonProps } from '@/@types/common'
import {
    DepartmentFormSchema,
    departmentSchema,
} from '@/schemas/department.schema'
import MasterForm from '@/components/form/MasterForm'

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
                        <OverviewSection readOnly={readOnly} />
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </MasterForm>
    )
}

export default DepartmentForm
