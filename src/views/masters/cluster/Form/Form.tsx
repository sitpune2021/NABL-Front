import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import type { CommonProps } from '@/@types/common'
import { ClusterFormSchema, clusterSchema } from '@/schemas/cluster.schema'
import MasterForm from '@/components/form/MasterForm'
import FormSectionLayout from '@/components/layouts/FormSectionLayout'
import TextField from '@/components/form/fields/TextField'
import PrefixSelectField from '@/components/form/fields/PrefixSelectField'
import useZoneList from '../../zone/List/hooks/useList'
import { useZoneDetail } from '../../zone/List/hooks/useZoneDetail'

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
                        <FormSectionLayout title="Cluster">
                            <PrefixSelectField
                                fieldName="zone_id"
                                identifierField="identifier"
                                label="Zone"
                                readOnly={readOnly}
                                useListHook={useZoneList}
                                useDetailHook={useZoneDetail}
                                mapOption={(item) => ({
                                    value: item.id,
                                    label: item.name.toUpperCase(),
                                    identifier: item.identifier,
                                })}
                            />

                            <TextField
                                name="name"
                                label="Cluster"
                                placeholder="Enter Cluster"
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

export default ClusterForm
