import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import type { CommonProps } from '@/@types/common'
import { LocationFormSchema, locationSchema } from '@/schemas/location.schema'
import MasterForm from '@/components/form/MasterForm'

type LocationFormProps = {
    onFormSubmit: (values: LocationFormSchema) => void
    defaultValues: LocationFormSchema
    readOnly?: boolean
} & CommonProps

const LocationForm = ({
    onFormSubmit,
    defaultValues,
    readOnly = false,
    children,
}: LocationFormProps) => {
    return (
        <MasterForm
            schema={locationSchema}
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

export default LocationForm
