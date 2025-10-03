/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef } from 'react'
import grapesjs from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import ReactDOMServer from 'react-dom/server'
import { useLocation } from 'react-router'
import { Button, Dialog, FormItem, Input } from '@/components/ui'
import { Controller } from 'react-hook-form'
import {
    addCustomBlocks,
    addDynamicFields,
} from '../../template/Form/BlockManager'
import HeaderBlock from '../../template/Form/HeaderBlock'
import FooterBlock from '../../template/Form/FooterBlock'

interface GrapesEditorProps {
    control: any
    errors: any
    readOnly: boolean
    dialogIsOpen: boolean
    onDialogClose: (e: any) => void
    isSubmiting: boolean
    docData?: any
    isEdit?: any
}

export default function GrapesEditor({
    control,
    errors,
    readOnly,
    dialogIsOpen,
    onDialogClose,
    isSubmiting,
    isEdit,
}: GrapesEditorProps) {
    const editorRef = useRef<any | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const location = useLocation()
    // const { documentList } = useDocumentList()

    useEffect(() => {
        if (!editorRef.current && containerRef.current) {
            const editor = grapesjs.init({
                container: containerRef.current,
                height: '100%',
                width: '100%',
                storageManager: false,
                plugins: ['gjs-blocks-basic'],
                blockManager: { appendTo: '#blocks' },
                canvas: { styles: [], scripts: [] },
                deviceManager: {
                    devices: [
                        {
                            name: 'A4',
                            width: '210mm',
                            height: '297mm',
                        },
                    ],
                },
            })

            addCustomBlocks(editor)
            addDynamicFields(editor)

            editor.Commands.add('insert-header', {
                run(ed) {
                    const html = ReactDOMServer.renderToStaticMarkup(
                        <HeaderBlock />,
                    )
                    ed.addComponents(html)
                },
            })

            editor.Commands.add('insert-footer', {
                run(ed) {
                    const html = ReactDOMServer.renderToStaticMarkup(
                        <FooterBlock />,
                    )
                    ed.addComponents(html)
                },
            })

            // Auto insert blocks based on location state
            const autoInsert = location?.state?.auto
            if (autoInsert) {
                if (autoInsert === 'header') editor.runCommand('insert-header')
                else if (autoInsert === 'footer')
                    editor.runCommand('insert-footer')
                else if (autoInsert === 'header-footer') {
                    editor.runCommand('insert-header')
                    editor.runCommand('insert-footer')
                }
            }

            editorRef.current = editor
            // onInit(editor);
        }

        return () => {
            if (editorRef.current) {
                editorRef.current.destroy()
                editorRef.current = null
            }
        }
    }, [location?.state])

    return (
        <>
            <div className="flex h-full w-full">
                <div
                    id="blocks"
                    className="flex-none w-[15%] h-full overflow-auto bg-gray-100 border-r"
                />
                <div ref={containerRef} id="gjs" className="flex-1 h-full" />
            </div>
            <Dialog isOpen={dialogIsOpen} closable={false}>
                <h5 className="mb-4">Dialog Title</h5>
                <FormItem
                    label="Name"
                    invalid={Boolean(errors.name)}
                    errorMessage={errors.name?.message}
                >
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                readOnly={readOnly}
                                placeholder="First Name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={onDialogClose}
                    >
                        Cancel
                    </Button>
                    <Button variant="solid" type="submit" loading={isSubmiting}>
                        {isEdit ? 'Update' : 'Create'}
                    </Button>
                </div>
            </Dialog>
        </>
    )
}
