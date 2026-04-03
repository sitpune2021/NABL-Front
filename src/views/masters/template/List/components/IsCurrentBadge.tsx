type IsCurrentBadgeProps = {
    isCurrent: boolean
    onMakeCurrent?: () => void
    disabled?: boolean
}

const IsCurrentBadge = ({
    isCurrent,
    onMakeCurrent,
    disabled = false,
}: IsCurrentBadgeProps) => {
    const isClickable = !isCurrent && onMakeCurrent && !disabled

    return (
        <div
            className={`rounded px-2 py-1 text-center select-none
                ${isCurrent ? 'bg-green-100 text-green-700' : 'bg-gray-100'}
                ${
                    isClickable
                        ? 'cursor-pointer hover:bg-yellow-100'
                        : 'cursor-not-allowed opacity-60'
                }
            `}
            onDoubleClick={() => {
                if (isClickable) {
                    onMakeCurrent()
                }
            }}
        >
            {isCurrent ? 'true' : 'false'}
        </div>
    )
}

export default IsCurrentBadge
