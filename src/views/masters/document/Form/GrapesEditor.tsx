/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from 'react'
import grapesjs from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import { Controller, UseFormSetValue, Control } from 'react-hook-form'
import debounce from 'lodash/debounce'

import {
    addCustomBlocks,
    addDynamicFields,
} from '../../template/Form/BlockManager'
import useTemplateList from '../../template/List/hooks/useList'

interface GrapesEditorProps {
    control: Control<any>
    errors: any
    readOnly: boolean
    setValue: UseFormSetValue<any>
    documentData?: DocumentData
}

interface DocumentData {
    header?: string
    footer?: string
}

interface TemplatePart {
    html: string
    css: string
}

interface Template {
    header: TemplatePart
    footer: TemplatePart
}

export default function GrapesEditor({
    control,
    setValue,
    documentData,
}: GrapesEditorProps) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const editorRef = useRef<any | null>(null)
    const hasInsertedTemplates = useRef(false)

    const { getTemplateById } = useTemplateList()

    const [template, setTemplate] = useState<Template>({
        header: { html: '', css: '' },
        footer: { html: '', css: '' },
    })

    // 1. Load header and footer templates
    useEffect(() => {
        const loadTemplates = async () => {
            if (!documentData?.header && !documentData?.footer) return

            try {
                const [header, footer] = await Promise.all([
                    documentData.header
                        ? getTemplateById(documentData.header)
                        : null,
                    documentData.footer
                        ? getTemplateById(documentData.footer)
                        : null,
                ])

                setTemplate({
                    header: {
                        html: header?.template?.html || '',
                        css: header?.template?.css || '',
                    },
                    footer: {
                        html: footer?.template?.html || '',
                        css: footer?.template?.css || '',
                    },
                })
            } catch (error) {
                console.error('Error loading templates:', error)
            }
        }

        loadTemplates()
    }, [documentData?.header, documentData?.footer])

    // 2. Initialize GrapesJS editor once
    useEffect(() => {
        if (!containerRef.current || editorRef.current) return

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

        // Debounced form sync
        const handleChange = debounce(() => {
            const html = editor.getHtml()
            const css = editor.getCss()
            const json = editor.getComponents()
            setValue('document', { html, css, json })
        }, 1000)

        editor.on('change', handleChange)

        editorRef.current = editor

        return () => {
            editor.off('change', handleChange)
            handleChange.cancel?.()
            editor.destroy()
            editorRef.current = null
        }
    }, [setValue])

    // 3. Add commands and insert header/footer only once
    useEffect(() => {
        const editor = editorRef.current
        if (!editor || hasInsertedTemplates.current) return

        const hasHeader = template.header.html.trim().length > 0
        const hasFooter = template.footer.html.trim().length > 0

        // Add commands
        editor.Commands.add('insert-header', {
            run(ed: any) {
                ed.addComponents(template.header.html)
                if (template.header.css) ed.addStyle(template.header.css)
            },
        })

        editor.Commands.add('insert-footer', {
            run(ed: any) {
                ed.addComponents(template.footer.html)
                if (template.footer.css) ed.addStyle(template.footer.css)
            },
        })

        // Insert header/footer
        if (hasHeader) editor.runCommand('insert-header')
        if (hasFooter) editor.runCommand('insert-footer')

        if (hasHeader || hasFooter) {
            hasInsertedTemplates.current = true
        }
    }, [template])

    return (
        <>
            <div className="flex h-full w-full">
                <div
                    id="blocks"
                    className="flex-none w-[15%] h-full overflow-auto bg-gray-100 border-r"
                />
                <div ref={containerRef} id="gjs" className="flex-1 h-full" />
            </div>

            <Controller
                name="documentId"
                control={control}
                render={({ field }) => <input type="hidden" {...field} />}
            />
        </>
    )
}
