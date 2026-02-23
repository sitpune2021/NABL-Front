import Card from '@/components/ui/Card'
import TextField from '@/components/form/fields/TextField'

type OverviewSectionProps = {
    readOnly?: boolean
}
const OverviewSection = ({ readOnly }: OverviewSectionProps) => {
    return (
        <Card>
            <h4 className="mb-6">Unit</h4>
            <div className="grid md:grid-cols-2 gap-4">
                <TextField
                    name="name"
                    label="Unit"
                    placeholder="Enter Unit"
                    readOnly={readOnly}
                />
            </div>
        </Card>
    )
}

export default OverviewSection
