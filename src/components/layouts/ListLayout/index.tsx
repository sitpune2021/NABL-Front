import { ActionButton } from '@/@types/common'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import ListActionTools from '@/components/shared/ListActionTools'

interface ListLayoutProps {
    title: string
    ActionTools?: ActionButton[]
    TableTools?: React.ReactNode
    Table: React.ReactNode
    SelectedComponent?: React.ReactNode
}

const ListLayout = ({
    title,
    ActionTools = [],
    TableTools,
    Table,
    SelectedComponent,
}: ListLayoutProps) => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>{title}</h3>
                            {ActionTools.length > 0 && (
                                <ListActionTools buttons={ActionTools} />
                            )}
                        </div>
                        {TableTools}
                        {Table}
                    </div>
                </AdaptiveCard>
            </Container>
            {SelectedComponent}
        </>
    )
}

export default ListLayout
