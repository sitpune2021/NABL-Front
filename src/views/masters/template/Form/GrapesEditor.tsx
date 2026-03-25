/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react'
import grapesjs from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import ReactDOMServer from 'react-dom/server'
import HeaderBlock from './HeaderBlock'
import { useParams } from 'react-router'
import { useFormContext, useWatch } from 'react-hook-form'
import footerContent from './FooterBlock'
import { loadEditorPlugins } from '@/configs/editor.config/index.config'
import { TemplateFormSchema } from '@/schemas/template.schema'
import IframeContent from '../../document/List/components/IframeContent'
import { extractMediaQueryStyles } from '@/utils/resolveFieldValue'

interface GrapesEditorProps {
    readOnly: boolean
}

const GrapesEditor = ({ readOnly }: GrapesEditorProps) => {
    const editorRef = useRef<any | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const { type } = useParams<{ type: string }>()

    const { control, setValue } = useFormContext<TemplateFormSchema>()
    const template = useWatch({ control, name: 'template' })

    const parsedContent = { header: '', content: '', footer: '' }

    if (readOnly && template?.html) {
        try {
            const parser = new DOMParser()
            const doc = parser.parseFromString(template.html, 'text/html')

            const headerEl = doc.querySelector('.header-section')
            if (headerEl) {
                parsedContent.header = headerEl.outerHTML
                headerEl.remove()
            }

            const footerEl = doc.querySelector('.footer-section')
            if (footerEl) {
                parsedContent.footer = footerEl.outerHTML
                footerEl.remove()
            }

            parsedContent.content = doc.body.innerHTML.trim()
        } catch (err) {
            console.error('Template parse error', err)
        }
    }

    const updatedCss = extractMediaQueryStyles(
        template?.css || '',
        'max-width: 210mm',
    )

    useEffect(() => {
        if (!containerRef.current || readOnly) return

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

        loadEditorPlugins(editor)

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
        }

        editor.on('change', () => {
            const html = editor.getHtml()
            const css = editor.getCss()
            const json = editor.getComponents()
            setValue('template', { html, css, json })
        })

        editorRef.current = editor

        return () => {
            if (editorRef.current) {
                editorRef.current.destroy()
                editorRef.current = null
            }
        }
    }, [type, readOnly])
    if (readOnly) {
        return (
            <div className="flex justify-center p-4">
                <div
                    style={{
                        width: '220mm',
                        height: '300mm',
                        background: 'white',
                    }}
                >
                    <IframeContent
                        parsedContent={parsedContent}
                        updatedCss={updatedCss}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-[calc(100vh-114px)] w-full overflow-hidden">
            <div
                id="blocks"
                className="flex-none w-[15%] h-full overflow-y-auto bg-gray-100 border-r"
            />

            <div ref={containerRef} id="gjs" className="flex-1 h-full" />
        </div>
    )
}

export default GrapesEditor
