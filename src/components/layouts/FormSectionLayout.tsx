import { ReactNode } from 'react'
import Card from '@/components/ui/Card'

type FormSectionLayoutProps = {
    title: string
    children: ReactNode
}

const FormSectionLayout = ({ title, children }: FormSectionLayoutProps) => {
    return (
        <Card>
            <h4 className="mb-6">{title}</h4>
            <div className="grid md:grid-cols-2 gap-4">{children}</div>
        </Card>
    )
}

export default FormSectionLayout
