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
                const footerContent = {
                    tagName: 'footer',
                    style: {
                        textAlign: 'center',
                        padding: '20px',
                        background: '#f0f0f0',
                        borderTop: '1px solid #ccc',
                    },
                    components: [
                        {
                            tagName: 'table',
                            classes: ['solution-table'],
                            type: 'table',
                            traits: [
                                {
                                    type: 'number',
                                    name: 'num_rows',
                                    label: 'Number of Rows',
                                    min: 5,
                                    max: 10,
                                    default: 7, // Default to 7 rows (matching footer)
                                    changeProp: true,
                                },
                                {
                                    type: 'number',
                                    name: 'numCols',
                                    label: 'Number of Columns',
                                    min: 6,
                                    max: 6, // Fixed to 6 columns for footer
                                    default: 6,
                                    changeProp: true,
                                },
                            ],
                            stylable: false,
                            components: function (props: any) {
                                const num_rows = props.num_rows || 7 // Use prop or default to 7
                                const numCols = props.numCols || 6 // Fixed to 6 for footer

                                const footerRows = [
                                    {
                                        cells: [
                                            {
                                                content: 'Document No.',
                                                colSpan: 1,
                                                style: { fontWeight: 'bold' },
                                            },
                                            {
                                                content: '',
                                                colSpan: 1,
                                                editable: true,
                                            },
                                            {
                                                content: 'Document Name',
                                                colSpan: 1,
                                                style: { fontWeight: 'bold' },
                                            },
                                            {
                                                content: '',
                                                colSpan: 3,
                                                editable: true,
                                            },
                                        ],
                                    },
                                    {
                                        cells: [
                                            {
                                                content: 'Prepared By',
                                                colSpan: 1,
                                                style: {
                                                    textAlign: 'left',
                                                    fontWeight: 'bold',
                                                },
                                            },
                                            {
                                                content: 'Name: ',
                                                colSpan: 2,
                                                style: { textAlign: 'left' },
                                                editable: true,
                                            },
                                            {
                                                content: 'Designation: ',
                                                colSpan: 2,
                                                style: { textAlign: 'left' },
                                                editable: true,
                                            },
                                            {
                                                content: 'Sign: ',
                                                colSpan: 1,
                                                style: { textAlign: 'left' },
                                                editable: true,
                                            },
                                        ],
                                    },
                                    {
                                        cells: [
                                            {
                                                content: 'Approved By',
                                                colSpan: 1,
                                                style: {
                                                    textAlign: 'left',
                                                    fontWeight: 'bold',
                                                },
                                            },
                                            {
                                                content: 'Name: ',
                                                colSpan: 2,
                                                style: { textAlign: 'left' },
                                                editable: true,
                                            },
                                            {
                                                content: 'Designation: ',
                                                colSpan: 2,
                                                style: { textAlign: 'left' },
                                                editable: true,
                                            },
                                            {
                                                content: 'Sign: ',
                                                colSpan: 1,
                                                style: { textAlign: 'left' },
                                                editable: true,
                                            },
                                        ],
                                    },
                                    {
                                        cells: [
                                            {
                                                content: 'Issued By',
                                                colSpan: 1,
                                                style: {
                                                    textAlign: 'left',
                                                    fontWeight: 'bold',
                                                },
                                            },
                                            {
                                                content: 'Name: ',
                                                colSpan: 2,
                                                style: { textAlign: 'left' },
                                                editable: true,
                                            },
                                            {
                                                content: 'Designation: ',
                                                colSpan: 2,
                                                style: { textAlign: 'left' },
                                                editable: true,
                                            },
                                            {
                                                content: 'Sign: ',
                                                colSpan: 1,
                                                style: { textAlign: 'left' },
                                                editable: true,
                                            },
                                        ],
                                    },
                                    {
                                        cells: [
                                            {
                                                content: 'Issue No.',
                                                colSpan: 1,
                                            },
                                            {
                                                content: '',
                                                colSpan: 1,
                                                editable: true,
                                            },
                                            {
                                                content: 'Issue Date',
                                                colSpan: 1,
                                            },
                                            {
                                                content: '',
                                                colSpan: 1,
                                                editable: true,
                                            },
                                            { content: 'Status', colSpan: 1 },
                                            {
                                                content: '',
                                                colSpan: 1,
                                                editable: true,
                                            },
                                        ],
                                    },
                                    {
                                        cells: [
                                            {
                                                content: 'Amendment No.',
                                                colSpan: 1,
                                            },
                                            {
                                                content: '',
                                                colSpan: 1,
                                                editable: true,
                                            },
                                            {
                                                content: 'Amendment Date',
                                                colSpan: 1,
                                            },
                                            {
                                                content: '',
                                                colSpan: 1,
                                                editable: true,
                                            },
                                            {
                                                content: 'Effective Date',
                                                colSpan: 1,
                                            },
                                            {
                                                content: '',
                                                colSpan: 1,
                                                editable: true,
                                            },
                                        ],
                                    },
                                    {
                                        cells: [
                                            { content: 'Copy No.', colSpan: 1 },
                                            {
                                                content: '',
                                                colSpan: 1,
                                                editable: true,
                                            },
                                            {
                                                content: 'Copy Location',
                                                colSpan: 1,
                                            },
                                            {
                                                content: '',
                                                colSpan: 1,
                                                editable: true,
                                            },
                                            { content: 'Page No.', colSpan: 1 },
                                            {
                                                content: '',
                                                colSpan: 1,
                                                editable: true,
                                            },
                                        ],
                                    },
                                ]

                                return [
                                    {
                                        tagName: 'tbody',
                                        type: 'tbody',
                                        components: footerRows
                                            .slice(0, num_rows)
                                            .map((row) => ({
                                                tagName: 'tr',
                                                type: 'tr',
                                                components: row.cells.map(
                                                    (cell: any) => ({
                                                        tagName: 'td',
                                                        type: 'td',
                                                        classes: [
                                                            'solution-td',
                                                        ],
                                                        style: cell.style
                                                            ? Object.keys(
                                                                  cell.style,
                                                              )
                                                                  .map(
                                                                      (key) =>
                                                                          `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${cell.style[key]}`,
                                                                  )
                                                                  .join(';')
                                                            : '',
                                                        attributes: {
                                                            colSpan:
                                                                cell.colSpan,
                                                        },
                                                        traits: [
                                                            // Traits with defaults
                                                            {
                                                                type: 'number',
                                                                name: 'colspan',
                                                                label: 'Colspan',
                                                                min: 1,
                                                                max: numCols,
                                                                default:
                                                                    cell.colSpan, // Default to the cell's defined colSpan
                                                            },
                                                            {
                                                                type: 'number',
                                                                name: 'rowspan',
                                                                label: 'Rowspan',
                                                                min: 1,
                                                                max: num_rows,
                                                                default: 1, // Default to 1
                                                            },
                                                        ],
                                                        components: [
                                                            {
                                                                tagName: 'div',
                                                                type: 'text',
                                                                content:
                                                                    cell.content,
                                                                attributes: {
                                                                    contentEditable:
                                                                        cell.editable
                                                                            ? 'true'
                                                                            : 'false',
                                                                },
                                                            },
                                                        ],
                                                    }),
                                                ),
                                            })),
                                    },
                                ]
                            },
                        },
                        {
                            tagName: 'div',
                            type: 'default', // Or 'div' if you have a custom type
                            style: { marginTop: '20px' }, // Optional styling for the div
                            components: [
                                {
                                    tagName: 'p',
                                    style: {
                                        'font-size': '13px',
                                        color: '#333',
                                        'text-align': 'center',
                                    },
                                    components: [
                                        '© ',
                                        {
                                            tagName: 'span',
                                            type: 'field-year',
                                            attributes: {
                                                'data-field': 'year',
                                            },
                                            content: '{{year}}',
                                        },
                                        ' ',
                                        {
                                            tagName: 'span',
                                            type: 'field-name',
                                            attributes: {
                                                'data-field': 'name',
                                            },
                                            content: '{{name}}',
                                        },
                                        ' Pvt Ltd. All rights reserved.',
                                    ],
                                },
                            ],
                        },
                    ],
                }
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
            editor.getWrapper().set('editable', false)
            editor.Panels.getPanels().reset()
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
