import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import type { CommonProps } from '@/@types/common'
import { LocationFormSchema, locationSchema } from '@/schemas/location.schema'
import MasterForm from '@/components/form/MasterForm'
import FormSectionLayout from '@/components/layouts/FormSectionLayout'
import PrefixSelectField from '@/components/form/fields/PrefixSelectField'
import TextField from '@/components/form/fields/TextField'
import { useClusterDetail } from '../../cluster/List/hooks/useClusterDetail'
import { useZoneDetail } from '../../zone/List/hooks/useZoneDetail'
import useZoneList from '../../zone/List/hooks/useList'
import useClusterList from '../../cluster/List/hooks/useList'

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
                        <FormSectionLayout title="Location">
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

                            <PrefixSelectField
                                fieldName="cluster_id"
                                identifierField="identifier"
                                label="Cluster"
                                readOnly={readOnly}
                                useListHook={useClusterList}
                                useDetailHook={useClusterDetail}
                                mapOption={(item) => ({
                                    value: item.id,
                                    label: item.name.toUpperCase(),
                                    identifier: item.identifier,
                                })}
                            />

                            <TextField
                                name="name"
                                label="Location"
                                placeholder="Enter Location"
                                readOnly={readOnly}
                            />

                            <TextField
                                name="short_name"
                                label="Short Name"
                                placeholder="Enter Short Name"
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

export default LocationForm
