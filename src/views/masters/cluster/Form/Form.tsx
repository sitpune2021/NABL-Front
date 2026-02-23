import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import type { CommonProps } from '@/@types/common'
import { ClusterFormSchema, clusterSchema } from '@/schemas/cluster.schema'
import MasterForm from '@/components/form/MasterForm'

type ClusterFormProps = {
    onFormSubmit: (values: ClusterFormSchema) => void
    defaultValues: ClusterFormSchema
    newCluster?: boolean
    readOnly?: boolean
} & CommonProps

const ClusterForm = ({
    onFormSubmit,
    defaultValues,
    readOnly = false,
    children,
}: ClusterFormProps) => {
    return (
        <MasterForm
            schema={clusterSchema}
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

export default ClusterForm
