import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton/Skeleton'

const FormSkeleton = ({ count, title }: { count: number; title: string }) => {
    return (
        <Card>
            <h4 className="mb-6">{title}</h4>
            <div className="grid md:grid-cols-2 gap-4">
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
