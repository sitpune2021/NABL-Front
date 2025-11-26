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
        addDynamicFields(editor)

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
            const resolveForElement = (el: Element) => {
                const field = el.getAttribute('data-field')
                if (!field) return
                const options: { [key: string]: string } = {}
                Array.from(el.attributes).forEach((attr) => {
                    console.log(attr.name)

                    if (
                        attr.name !== 'data-field' &&
                        attr.name !== 'data-value' &&
                        attr.name !== 'id'
                    ) {
                        const optionKey = attr.name.replace(/-/g, '')
                        options[optionKey] = attr.value
                    }
                })
                const value = resolveFieldValue(field, documentData, options)
                if (value) {
                    el.textContent = value
                }
            }

            doc.querySelectorAll('[data-field]').forEach(resolveForElement)

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

    function formatDate(dateStr: string, format: string): string {
        const date = new Date(dateStr)
        if (isNaN(date.getTime())) return dateStr // Invalid date, return as-is

        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
        const year = String(date.getFullYear())

        return format
            .replace(/dd/g, day)
            .replace(/MM/g, month)
            .replace(/yyyy/g, year)
    }

    function resolveFieldValue(
        key: string,
        data: any,
        options: { [key: string]: string } = {},
    ): string {
        if (!data) return ''

        switch (key) {
            case 'date': {
                const dateType = options.datetype || 'issueDate'
                let dateValue: string
                switch (dateType) {
                    case 'issueDate':
                        dateValue = data.issueDate || ''
                        break
                    case 'amendmentDate':
                        dateValue = data.amendmentDate || ''
                        break
                    case 'effectiveDate':
                        dateValue = data.effectiveDate || ''
                        break
                    default:
                        dateValue = data.genericDate || ''
                        break
                }
                if (options.format && dateValue) {
                    return formatDate(dateValue, options.format)
                }
                return dateValue
            }
            case 'number': {
                const numberType = options.numbertype || 'documentNo'
                switch (numberType) {
                    case 'documentNo':
                        return data.documentNo || ''
                    case 'issuedNo':
                        return data.issuedNo || ''
                    case 'copyNo':
                        return data.copyNo || ''
                    case 'amendmentNo':
                        return data.amendmentNo || ''
                    default:
                        return ''
                }
            }
            case 'person':
            case 'designation':
            case 'signatory': {
                const personRole =
                    options.personrole ||
                    options.persondesignation ||
                    options.personsignatory ||
                    'preparedBy'

                switch (personRole) {
                    case 'preparedBy':
                        return data.preparedBy || ''
                    case 'approvedBy':
                        return data.approvedBy || ''
                    case 'issuedBy':
                        return data.issuedBy || ''
                    case 'user':
                        return data.user || ''
                    default:
                        return ''
                }
            }
            case 'category': {
                const categoryLevel = options.categorylevel || 'category'
                return categoryLevel === 'subcategory'
                    ? data.subcategory || ''
                    : data.category || ''
            }
            case 'department':
                return Array.isArray(data.department)
                    ? data.department.join(', ')
                    : data.department || ''
            case 'userDetails': {
                const userDetailType = options.userdetailtype || 'name'
                switch (userDetailType) {
                    case 'name':
                        return data.name || ''
                    case 'role':
                        return data.role || ''
                    case 'type':
                        return data.type || ''
                    case 'location':
                        return data.location || ''
                    case 'email':
                        return data.email || ''
                    case 'phone':
                        return data.phone || ''
                    default:
                        return ''
                }
            }
            case 'name': {
                const nameType = options.nametype || 'lab'
                switch (nameType) {
                    case 'lab':
                        return data.labName || ''
                    case 'document':
                        return data.documentName || ''
                    case 'user':
                        return data.userName || ''
                    default:
                        return ''
                }
            }
            default:
                return data[key] || ''
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
