import Tooltip from '@/components/ui/Tooltip'
import type { ReactNode } from 'react'

interface ActionButton {
    icon: ReactNode
    tooltip: string
    onClick: () => void
    show?: boolean
}

interface ActionColumnProps {
    buttons: ActionButton[]
}

const ActionColumn = ({ buttons = [] }: ActionColumnProps) => {
    return (
        <div className="flex items-center gap-3">
            {buttons.map(
                (btn, idx) =>
                    btn.show !== false && (
                        <Tooltip key={idx} title={btn.tooltip}>
                            <div
                                className="text-xl cursor-pointer select-none font-semibold"
                                role="button"
                                onClick={btn.onClick}
                            >
                                {btn.icon}
                            </div>
                        </Tooltip>
                    ),
            )}
        </div>
    )
}

export default ActionColumn
