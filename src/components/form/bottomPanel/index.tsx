import React from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import { TbArrowNarrowLeft, TbTrash } from 'react-icons/tb'

type BottomPanelProps = {
    isView?: boolean
    isSubmitting?: boolean
    isEdit?: boolean
    isEditor?: boolean
    onPrimaryClick?: () => void
    onDiscard?: () => void
}

const BottomPanel: React.FC<BottomPanelProps> = ({
    isView = false,
    isSubmitting = false,
    isEdit = false,
    isEditor = false,
    onPrimaryClick = () => {},
    onDiscard,
}) => {
    const handleBack = () => {
        history.back()
    }

    return (
        <Container>
            <div className="flex items-center justify-between px-8">
                <Button
                    className="ltr:mr-3 rtl:ml-3"
                    type="button"
                    variant="plain"
                    icon={<TbArrowNarrowLeft />}
                    onClick={handleBack}
                >
                    Back
                </Button>

                {!isView && (
                    <div className="flex items-center">
                        <Button
                            className="ltr:mr-3 rtl:ml-3"
                            type="button"
                            customColorClass={() =>
                                'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                            }
                            icon={<TbTrash />}
                            onClick={onDiscard}
                        >
                            Discard
                        </Button>
                        <Button
                            variant="solid"
                            type="submit"
                            loading={isSubmitting}
                            onClick={onPrimaryClick}
                        >
                            {isEditor
                                ? isEdit
                                    ? 'Update'
                                    : 'Create'
                                : isEdit
                                  ? 'Update'
                                  : 'Create'}
                        </Button>
                    </div>
                )}
            </div>
        </Container>
    )
}

export default BottomPanel
