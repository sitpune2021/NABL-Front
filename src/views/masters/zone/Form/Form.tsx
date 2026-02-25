import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import type { CommonProps } from '@/@types/common'
import { ZoneFormSchema, zoneSchema } from '@/schemas/zone.schema'
import MasterForm from '@/components/form/MasterForm'

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
                        <OverviewSection readOnly={readOnly} />
                    </div>
                </div>
            </Container>

            <BottomStickyBar>{children}</BottomStickyBar>
        </MasterForm>
    )
}

export default ZoneForm
