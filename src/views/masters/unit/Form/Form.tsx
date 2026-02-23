import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import type { CommonProps } from '@/@types/common'
import { UnitFormSchema, unitSchema } from '@/schemas/unit.schema'
import MasterForm from '@/components/form/MasterForm'

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
                        <OverviewSection readOnly={readOnly} />
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </MasterForm>
    )
}

export default UnitForm
