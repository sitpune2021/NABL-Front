type IsCurrentBadgeProps = {
    isCurrent: boolean
    onMakeCurrent?: () => void
}

const IsCurrentBadge = ({ isCurrent, onMakeCurrent }: IsCurrentBadgeProps) => {
    return (
        <div
            className={`cursor-pointer rounded px-2 py-1 text-center select-none
                ${
                    isCurrent
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 hover:bg-yellow-100'
                }`}
            onDoubleClick={() => {
                if (!isCurrent && onMakeCurrent) {
                    onMakeCurrent()
                }
            }}
        >
            {isCurrent ? 'true' : 'false'}
        </div>
    )
}

export default IsCurrentBadge
