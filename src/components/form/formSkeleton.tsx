import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton/Skeleton'

type FormSkeletonProps = {
    count: number
    title: string
    cols?: number
}

const colMap: Record<number, string> = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
}

const FormSkeleton = ({ count, title, cols = 2 }: FormSkeletonProps) => {
    return (
        <Card>
            <h4 className="mb-6">{title}</h4>
            <div className={`grid gap-4 ${colMap[cols] || 'md:grid-cols-2'}`}>
                {Array.from({ length: count }).map((_, index) => (
                    <div key={index} className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ))}
            </div>
        </Card>
    )
}

export default FormSkeleton
