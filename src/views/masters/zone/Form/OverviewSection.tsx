import { memo } from 'react'
import Card from '@/components/ui/Card'
import TextField from '@/components/form/fields/TextField'

type OverviewSectionProps = {
    readOnly?: boolean
}
const OverviewSection = ({ readOnly }: OverviewSectionProps) => {
    return (
        <Card>
            <h4 className="mb-6">Zone</h4>
            <div className="grid md:grid-cols-2 gap-4">
                <TextField
                    name="name"
                    label="Zone"
                    placeholder="Enter Zone"
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

export default memo(OverviewSection)
