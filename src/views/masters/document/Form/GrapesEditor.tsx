/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react'
import grapesjs from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import { Controller, useWatch } from 'react-hook-form'
import debounce from 'lodash/debounce'

import {
    addCustomBlocks,
    addDynamicFields,
} from '../../template/Form/BlockManager'
import { GrapesEditorProps, Template } from '@/@types/document'
import IframeContent from './IframeContent'
import {
    extractMediaQueryStyles,
    lockTree,
    resolveFieldValue,
} from '@/utils/resolveFieldValue'

export default function GrapesEditor({
    control,
    setValue,
    isEdit = false,
    readOnly = false,
    getTemplateById,
}: GrapesEditorProps) {
    const documentData = useWatch({ control }) || {}

    const containerRef = useRef<HTMLDivElement | null>(null)
    const editorRef = useRef<any | null>(null)
    const [isEditorReady, setIsEditorReady] = useState(false)

    const [template, setTemplate] = useState<Template>({
        header: { html: '', json: '', css: '' },
        footer: { html: '', json: '', css: '' },
        section: { html: '', json: '', css: '' },
    })

    // Load templates (header/footer/section)
    const prevTemplateIdsRef = useRef<{ header?: number; footer?: number }>({})

    useEffect(() => {
        const loadTemplates = async () => {
            if (!documentData) return
            const headerId = documentData.header?.template_id
            const footerId = documentData.footer?.template_id

            if (
                prevTemplateIdsRef.current.header === headerId &&
                prevTemplateIdsRef.current.footer === footerId
            ) {
                return
            }

            prevTemplateIdsRef.current = { header: headerId, footer: footerId }

            try {
                const [header, footer] = await Promise.all([
                    headerId
                        ? getTemplateById(headerId)
                        : Promise.resolve(null),
                    footerId
                        ? getTemplateById(footerId)
                        : Promise.resolve(null),
                ])

                setTemplate({
                    header: header?.template || { html: '', json: '', css: '' },
                    footer: footer?.template || { html: '', json: '', css: '' },
                    section: documentData.editor_schema || {
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
    }, [documentData, getTemplateById])

    // Initialize GrapesJS editor once
    useEffect(() => {
        // Do not initialize in readOnly mode or if already initialized
        if (readOnly || editorRef.current || !containerRef.current) return

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

        // Non-editable component type
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
        addDynamicFields(editor)

        const handleChange = debounce(() => {
            setValue('editor_schema', {
                html: editor.getHtml(),
                css: editor.getCss(),
                json: editor.getComponents(),
            })
        }, 500)

        editor.on('change', handleChange)

        editorRef.current = editor
        setIsEditorReady(true)

        // Cleanup only once
        return () => {
            editor.off('change', handleChange)
            handleChange.cancel?.()
            editor.destroy()
            editorRef.current = null
            setIsEditorReady(false)
        }
    }, [readOnly, setValue])

    // Insert templates into editor
    useEffect(() => {
        if (readOnly) return

        const editor = editorRef.current
        if (!editor || !isEditorReady) return

        const { header, footer, section } = template

        const wrapper = editor.getWrapper()

        // Only add editable-section if it doesn't exist
        if (!wrapper.find('.editable-section').length) {
            editor.addComponents(`<div class="editable-section"></div>`)
        }

        const insertJSON = (json: any, className: string, css?: string) => {
            if (wrapper.find(`.${className}`).length) return // already exists
            try {
                // Create wrapper
                editor.addComponents(
                    `<div class="${className} non-editable"></div>`,
                )

                const container = wrapper.find(`.${className}`)[0]
                if (!container) return

                container.append(json)
                lockTree(container)

                if (css) editor.addStyle(css)
            } catch (err) {
                console.error(`Failed parsing JSON for ${className}:`, err)
            }
        }

        if (isEdit) {
            if (section?.json) editor.setComponents(section.json)
            if (section?.css) editor.addStyle(section.css)

            if (header.json)
                insertJSON(header.json, 'header-section', header.css)
            if (footer.json)
                insertJSON(footer.json, 'footer-section', footer.css)

            return
        }

        if (header.json) insertJSON(header.json, 'header-section', header.css)
        if (footer.json) insertJSON(footer.json, 'footer-section', footer.css)
    }, [template, isEditorReady, isEdit, readOnly])

    // Parse content for read-only
    const parsedContent = { header: '', content: '', footer: '' }

    if (readOnly && template.section?.html) {
        try {
            const parser = new DOMParser()
            const doc = parser.parseFromString(
                template.section.html,
                'text/html',
            )

            doc.querySelectorAll('[data-field]').forEach((el) => {
                const field = el.getAttribute('data-field')
                if (!field) return
                const options: Record<string, string> = {}
                Array.from(el.attributes).forEach((attr) => {
                    if (
                        !['data-field', 'data-value', 'id'].includes(attr.name)
                    ) {
                        options[attr.name.replace(/-/g, '')] = attr.value
                    }
                })
                const value = resolveFieldValue(field, documentData, options)
                if (value) el.textContent = value
            })

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

    const updatedCss = extractMediaQueryStyles(
        template.section?.css || '',
        'max-width: 210mm',
    )

    return (
        <>
            {readOnly ? (
                <div style={{ width: '220mm', height: '300mm' }}>
                    <IframeContent
                        parsedContent={parsedContent}
                        updatedCss={updatedCss}
                    />
                </div>
            ) : (
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
                    <Controller
                        name="documentId"
                        control={control}
                        render={({ field }) => (
                            <input
                                type="hidden"
                                {...field}
                                value={Number(field.value) || 0}
                            />
                        )}
                    />
                </div>
            )}
        </>
    )
}
