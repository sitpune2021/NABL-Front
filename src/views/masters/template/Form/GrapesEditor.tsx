/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react'
import grapesjs from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import { addCustomBlocks, addDynamicFields } from './BlockManager'
import ReactDOMServer from 'react-dom/server'
import HeaderBlock from './HeaderBlock'
import { useParams } from 'react-router'
import { Control, useWatch } from 'react-hook-form'
import { TemplateFormSchema } from '@/@types/template'
import footerContent from './FooterBlock'

interface GrapesEditorProps {
    control: Control<TemplateFormSchema>
    readOnly: boolean
    setValue: (name: keyof TemplateFormSchema, value: any) => void
}

export default function GrapesEditor({
    control,
    readOnly,
    setValue,
}: GrapesEditorProps) {
    const editorRef = useRef<any | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const { type } = useParams<{ type: string }>()
    const template = useWatch({ control, name: 'template' })

    useEffect(() => {
        if (!containerRef.current) return

        if (editorRef.current) {
            if (template?.html && template?.css) {
                editorRef.current.setComponents(template.html)
                editorRef.current.setStyle(template.css)
            }
            return
        }

        const editor = grapesjs.init({
            container: containerRef.current,
            height: '100%',
            width: '100%',
            storageManager: false,
            plugins: ['gjs-blocks-basic'],
            blockManager: { appendTo: '#blocks' },
            canvas: { styles: [], scripts: [] },
            deviceManager: {
                devices: [{ name: 'A4', width: '210mm', height: '297mm' }],
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
                ed.addComponents(footerContent)
            },
        })

        if (template?.html && template?.css) {
            editor.setComponents(template.json)
            editor.setStyle(template.css)
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
            setValue('template', { html, css, json })
        })

        if (readOnly) {
            editor.getWrapper()?.set('editable', false)
            editor.Panels.getPanels()?.reset()
        }

        editorRef.current = editor

        return () => {
            if (editorRef.current) {
                editorRef.current.destroy()
                editorRef.current = null
            }
        }
    }, [type, readOnly])

    return (
        <div className="flex h-full w-full">
            <div
                id="blocks"
                className="flex-none w-[15%] h-full overflow-auto bg-gray-100 border-r"
            />
            <div ref={containerRef} id="gjs" className="flex-1 h-full" />
        </div>
    )
}
