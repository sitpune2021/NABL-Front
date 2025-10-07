/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef } from 'react'
import grapesjs from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import { addCustomBlocks, addDynamicFields } from './BlockManager'
import ReactDOMServer from 'react-dom/server'
import HeaderBlock from './HeaderBlock'
import FooterBlock from './FooterBlock'
import { useParams } from 'react-router'
import { Button, Dialog, FormItem, Input } from '@/components/ui'
import { Controller, UseFormSetValue } from 'react-hook-form'
import { TemplateFormSchema } from '@/@types/template'

interface GrapesEditorProps {
    control: any
    errors: any
    readOnly: boolean
    dialogIsOpen: boolean
    onDialogClose: (e: any) => void
    isSubmiting: boolean
    docData?: any
    isEdit?: any
    setValue: UseFormSetValue<TemplateFormSchema>
}

export default function GrapesEditor({
    control,
    errors,
    readOnly,
    dialogIsOpen,
    onDialogClose,
    isSubmiting,
    isEdit,
    setValue, // ✅ here
    docData,
}: GrapesEditorProps) {
    const editorRef = useRef<any | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const { type } = useParams<{ type: string }>()

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

            if (docData?.template) {
                const { html, css } = docData.template
                editor.setComponents(html || '')
                editor.setStyle(css || '')
            } else if (type) {
                if (type === 'header') editor.runCommand('insert-header')
                else if (type === 'footer') editor.runCommand('insert-footer')
                else if (type === 'template') {
                    editor.runCommand('insert-header')
                    editor.runCommand('insert-footer')
                }
            }

            editor.on('change', () => {
                const html = editor.getHtml()
                const css = editor.getCss()
                const json = editor.getComponents()
                setValue('template', { html, css, json }) // ✅ use the prop
            })

            editorRef.current = editor
        }

        return () => {
            if (editorRef.current) {
                editorRef.current.destroy()
                editorRef.current = null
            }
        }
    }, [type, control])

    return (
        <>
            <div className="flex h-full w-full">
                <div
                    id="blocks"
                    className="flex-none w-[15%] h-full overflow-auto bg-gray-100 border-r"
                />
                <div ref={containerRef} id="gjs" className="flex-1 h-full" />
            </div>

            {/* Hidden type input to save template type */}
            <Controller
                name="type"
                control={control}
                render={({ field }) => (
                    <input type="hidden" {...field} value={type} />
                )}
            />

            <Dialog isOpen={dialogIsOpen} closable={false}>
                <h5 className="mb-4">Template Name</h5>
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
                                placeholder="Template Name"
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
                        {isEdit} {isEdit ? 'Update' : 'Create'}
                    </Button>
                </div>
            </Dialog>
        </>
    )
}
