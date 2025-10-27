import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import { FormSectionBaseProps } from '@/@types/cluster'
import useZoneList from '../../zone/List/hooks/useList'
import { Select } from '@/components/ui'

type OverviewSectionProps = FormSectionBaseProps

const OverviewSection = ({
    control,
    errors,
    readOnly,
}: OverviewSectionProps) => {
    const { zoneList } = useZoneList()

    const options = zoneList.map((zone) => ({
        label: zone.zone_name,
        value: zone.zone_name,
    }))
    return (
        <Card>
            <h4 className="mb-6">Overview</h4>
            <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                    label="Zone"
                    invalid={Boolean(errors.zone_name)}
                    errorMessage={errors.zone_name?.message}
                >
                    <Controller
                        name="zone_name"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder="Select Zone"
                                options={options}
                                value={
                                    options.find(
                                        (o: { value: string; label: string }) =>
                                            o.value === field.value,
                                    ) || null
                                }
                                isDisabled={readOnly}
                                onChange={(
                                    selected: {
                                        value: string
                                        label: string
                                    } | null,
                                ) => {
                                    field.onChange(
                                        selected ? selected.value : '',
                                    )
                                }}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Name"
                    invalid={Boolean(errors.cluster_name)}
                    errorMessage={errors.cluster_name?.message}
                >
                    <Controller
                        name="cluster_name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                readOnly={readOnly}
                                placeholder="First Name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    )
}

export default OverviewSection
