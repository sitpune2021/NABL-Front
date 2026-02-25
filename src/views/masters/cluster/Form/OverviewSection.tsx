import Card from '@/components/ui/Card'
import { useZoneList } from '../../zone/List/hooks/useList'
import PrefixSelectField from '@/components/form/fields/PrefixSelectField'
import TextField from '@/components/form/fields/TextField'
import { useZoneDetail } from '../../zone/List/hooks/useZoneDetail'

type OverviewSectionProps = {
    readOnly?: boolean
}

const OverviewSection = ({ readOnly }: OverviewSectionProps) => {
    return (
        <Card>
            <h4 className="mb-6">Cluster</h4>

            <div className="grid md:grid-cols-2 gap-4">
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
            </div>
        </Card>
    )
}

export default OverviewSection
