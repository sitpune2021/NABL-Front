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
import { DocumentFormSchema } from '@/@types/document'
import { Card } from '@/components/ui'

interface GrapesEditorProps {
    control: Control<any>
    errors: any
    readOnly: boolean
    setValue: UseFormSetValue<any>
    documentData?: DocumentFormSchema | null
    isEdit?: boolean
}

interface TemplatePart {
    html: string | undefined
    json: any | undefined
    css: string | undefined
}

interface Template {
    header: TemplatePart
    footer: TemplatePart
    section?: TemplatePart
}

export default function GrapesEditor({
    control,
    setValue,
    documentData,
    isEdit = false,
    readOnly = false,
}: GrapesEditorProps) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const editorRef = useRef<any | null>(null)
    const [isEditorReady, setIsEditorReady] = useState(false)

    const { getTemplateById } = useTemplateList()

    const [template, setTemplate] = useState<Template>({
        header: { html: '', json: '', css: '' },
        footer: { html: '', json: '', css: '' },
        section: { html: '', json: '', css: '' },
    })

    // 1. Load templates (header/footer and section for edit)
    useEffect(() => {
        const loadTemplates = async () => {
            if (!documentData) return

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
                    header: header?.template || {
                        html: '',
                        json: '',
                        css: '',
                    },
                    footer: footer?.template || {
                        html: '',
                        json: '',
                        css: '',
                    },
                    section: documentData.document || {
                        html: '',
                        json: '',
                        css: '',
                    },
                })
            } catch (err) {
                console.error('Error loading templates:', err)
            }
        }

        loadTemplates()
    }, [documentData])

    // 2. Initialize GrapesJS editor once
    useEffect(() => {
        if (readOnly) return
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
                devices: [{ name: 'A4', width: '210mm', height: '297mm' }],
            },
        })

        editor.DomComponents.addType('non-editable', {
            isComponent: (el) => el.classList?.contains('non-editable'),
            model: {
                defaults: {
                    editable: false,
                    selectable: false,
                    draggable: false,
                    droppable: false,
                    removable: false,
                    highlightable: false,
                    copyable: false,
                    hoverable: false,
                },
            },
        })

        addCustomBlocks(editor)
        addDynamicFields(editor, documentData)

        const handleChange = debounce(() => {
            setValue('document', {
                html: editor.getHtml(),
                css: editor.getCss(),
                json: editor.getComponents(),
            })
        }, 1000)

        editor.on('change', handleChange)

        editorRef.current = editor
        setIsEditorReady(true)

        return () => {
            editor.off('change', handleChange)
            handleChange.cancel?.()
            editor.destroy()
            editorRef.current = null
            setIsEditorReady(false)
        }
    }, [setValue, readOnly])

    // 3. Insert templates after both editor is ready AND templates are loaded
    const lockTree = (component: any) => {
        component.set({
            editable: false,
            selectable: false,
            draggable: false,
            droppable: false,
            removable: false,
            copyable: false,
            hoverable: false,
            highlightable: false,
        })

        component.components().forEach((child: any) => {
            lockTree(child)
        })
    }

    useEffect(() => {
        if (readOnly) return

        const editor = editorRef.current
        if (!editor || !isEditorReady) return
        const { header, footer, section } = template
        const containsHeader = JSON.stringify(section?.json || '').includes(
            'header-section',
        )
        const containsFooter = JSON.stringify(section?.json || '').includes(
            'footer-section',
        )

        const insertJSON = (json: any, className: string, css?: string) => {
            try {
                // Create wrapper
                editor.addComponents(
                    `<div class="${className} non-editable"></div>`,
                )

                const wrapper = editor.getWrapper().find(`.${className}`)[0]
                if (!wrapper) return

                wrapper.append(json)

                // Lock wrapper + children
                lockTree(wrapper)

                if (css) editor.addStyle(css)
            } catch (err) {
                console.error(`Failed parsing JSON for ${className}:`, err)
            }
        }

        if (isEdit) {
            if (section?.json) editor.setComponents(section.json)

            if (section?.css) editor.addStyle(section.css)

            if (!containsHeader && header.json) {
                insertJSON(header.json, 'header-section', header.css)
            }

            if (!containsFooter && footer.json) {
                insertJSON(footer.json, 'footer-section', footer.css)
            }

            return
        }

        if (header.json) insertJSON(header.json, 'header-section', header.css)

        editor.addComponents(`<div class="editable-section"></div>`)

        if (footer.json) insertJSON(footer.json, 'footer-section', footer.css)
    }, [template, isEditorReady, isEdit, readOnly])

    const parsedContent = { header: '', content: '', footer: '' }

    if (readOnly && template.section?.html) {
        try {
            const parser = new DOMParser()
            const doc = parser.parseFromString(
                template.section.html,
                'text/html',
            )

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
            console.error('Failed to parse section HTML', err)
        }
    }

    function extractMediaQueryStyles(css: string, mediaQuery: string) {
        if (!css) return ''

        const regex = new RegExp(
            `@media\\s*\\(${mediaQuery}\\)\\s*{([\\s\\S]*?)}\\s*}`,
            'g',
        )

        let extractedStyles = ''
        let match

        while ((match = regex.exec(css)) !== null) {
            extractedStyles += match[1].trim() + '\n'
        }

        const cleanedCss = css.replace(regex, '').trim()

        return cleanedCss + '\n' + extractedStyles
    }

    const updatedCss = extractMediaQueryStyles(
        template.section?.css || '',
        'max-width: 210mm',
    )

    return (
        <>
            {readOnly ? (
                <Card
                    style={{
                        width: '210mm',
                        height: '297mm',
                        overflow: 'hidden',
                        boxSizing: 'border-box',
                        border: '1px solid #ccc',
                        position: 'relative',
                    }}
                >
                    <style
                        dangerouslySetInnerHTML={{
                            __html:
                                updatedCss +
                                `
                                .editable-section,
                                .header-section,
                                .footer-section {
                                    max-width: 210mm;
                                    word-wrap: break-word;
                                    overflow-wrap: break-word;
                                    box-sizing: border-box;
                                    margin: 0 auto;
                                }
                            `,
                        }}
                    />

                    {/* Header */}
                    {parsedContent.header && (
                        <div
                            className="header-section"
                            dangerouslySetInnerHTML={{
                                __html: parsedContent.header,
                            }}
                        />
                    )}

                    {/* Main content */}
                    {parsedContent.content && (
                        <div
                            className="editable-section"
                            dangerouslySetInnerHTML={{
                                __html: parsedContent.content,
                            }}
                        />
                    )}

                    {/* Footer */}
                    {parsedContent.footer && (
                        <div
                            className="footer-section"
                            dangerouslySetInnerHTML={{
                                __html: parsedContent.footer,
                            }}
                        />
                    )}
                </Card>
            ) : (
                <>
                    <div className="flex h-full w-full">
                        <div
                            id="blocks"
                            className="flex-none w-[15%] h-full overflow-auto bg-gray-100 border-r"
                        />
                        <div
                            ref={containerRef}
                            id="gjs"
                            className="flex-1 h-full"
                        />
                    </div>

                    <Controller
                        name="documentId"
                        control={control}
                        render={({ field }) => (
                            <input type="hidden" {...field} />
                        )}
                    />
                </>
            )}
        </>
    )
}
