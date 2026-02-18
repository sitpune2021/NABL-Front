import Card from '@/components/ui/Card'
import TextField from '@/components/form/fields/TextField'
import { useCategoryList } from '../../category/List/hooks/useList'
import PrefixSelectField from '@/components/form/fields/PrefixSelectField'
import { useCategoryDetail } from '../../category/List/hooks/useCategoryDetail'

type OverviewSectionProps = {
    readOnly?: boolean
}

const OverviewSection = ({ readOnly }: OverviewSectionProps) => {
    return (
        <Card>
            <h4 className="mb-6">Sub Category</h4>
            <div className="grid md:grid-cols-2 gap-4">
                <PrefixSelectField
                    fieldName="cat_id"
                    identifierField="identifier"
                    label="Category"
                    readOnly={readOnly}
                    useListHook={useCategoryList}
                    useDetailHook={useCategoryDetail}
                    mapOption={(item) => ({
                        value: item.id,
                        label: item.name.toUpperCase(),
                        identifier: item.identifier,
                    })}
                />

                <TextField
                    name="name"
                    label="Sub Category"
                    placeholder="Enter Sub Category"
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
