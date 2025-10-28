/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormItem, Input } from '@/components/ui'
import { HiTrash } from 'react-icons/hi'

const NoteItem = ({
    note,
    noteIndex,
    readOnly,
    onDelete,
    onChange,
    multiple,
}: any) => (
    <div className="border rounded-lg p-4 mb-4 bg-gray-50">
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
    </div>
)

export default NoteItem
