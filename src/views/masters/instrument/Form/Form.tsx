import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import type { CommonProps } from '@/@types/common'
import {
    InstrumentFormSchema,
    instrumentSchema,
} from '@/schemas/instrument.schema'
import MasterForm from '@/components/form/MasterForm'

type InstrumentFormProps = {
    onFormSubmit: (values: InstrumentFormSchema) => void
    defaultValues: InstrumentFormSchema
    readOnly: boolean
} & CommonProps

const InstrumentForm = ({
    onFormSubmit,
    defaultValues,
    readOnly = false,
    children,
}: InstrumentFormProps) => {
    return (
        <MasterForm
            schema={instrumentSchema}
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

export default InstrumentForm
