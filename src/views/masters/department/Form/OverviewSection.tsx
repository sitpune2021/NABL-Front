import Card from '@/components/ui/Card'
import TextField from '@/components/form/fields/TextField'

type OverviewSectionProps = {
    readOnly?: boolean
}
const OverviewSection = ({ readOnly }: OverviewSectionProps) => {
    return (
        <Card>
            <h4 className="mb-6">Department</h4>
            <div className="grid md:grid-cols-2 gap-4">
                <TextField
                    name="name"
                    label="Department"
                    placeholder="Enter Department"
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
