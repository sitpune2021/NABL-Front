import { Button, Card, FormItem, Input } from '@/components/ui'
import { HiTrash } from 'react-icons/hi'

interface NoteItemProps {
    note: {
        id: number
        content: string
    }
    noteIndex: number
    readOnly: boolean
    onDelete: () => void
    onChange: (value: string) => void
    multiple: boolean
}

const NoteItem: React.FC<NoteItemProps> = ({
    note,
    noteIndex,
    readOnly,
    onDelete,
    onChange,
    multiple,
}) => {
    return (
        <Card className="mb-2">
            <div className="flex justify-between items-start mb-4">
                <h6 className="font-medium">Note {noteIndex + 1}</h6>
                {multiple && (
                    <Button
                        size="sm"
                        type="button"
                        variant="solid"
                        color="red"
                        disabled={readOnly}
                        onClick={onDelete}
                    >
                        <HiTrash className="text-lg" />
                    </Button>
                )}
            </div>
            <FormItem>
                <Input
                    textArea
                    rows={3}
                    placeholder="Write your note..."
                    readOnly={readOnly}
                    value={note.content || ''}
                    onChange={(e) => onChange(e.target.value)}
                />
            </FormItem>
        </Card>
    )
}

export default NoteItem
