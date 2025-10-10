/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef } from 'react'
import grapesjs from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import ReactDOMServer from 'react-dom/server'
import { useParams } from 'react-router'
import { Controller, UseFormSetValue } from 'react-hook-form'
import {
    addCustomBlocks,
    addDynamicFields,
} from '../../template/Form/BlockManager'
import HeaderBlock from '../../template/Form/HeaderBlock'
import FooterBlock from '../../template/Form/FooterBlock'
// import useTemplateList from '../../template/List/hooks/useList'
// import useDocumentList from '../List/hooks/useList'

interface GrapesEditorProps {
    control: any
    errors: any
    readOnly: boolean
    setValue: UseFormSetValue<any>
}

export default function GrapesEditor({
    control,
    // errors,
    // readOnly,
    setValue,
}: GrapesEditorProps) {
    const editorRef = useRef<any | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const { id: documentId } = useParams()
    // const { templateList } = useTemplateList()
    // const { documentList } = useDocumentList()

    // const selectedDocument = useMemo(() => {
    //     return documentList?.find(doc => doc.id === documentId) || null
    // }, [documentList, documentId])

    // const availableHeaders = useMemo(() => {
    //     return templateList?.filter(t => t.type === 'header').map(t => ({
    //         value: t.id,
    //         label: t.name || t.id,
    //         html: t.template?.html || '',
    //         css: t.template?.css || '',
    //     })) || []
    // }, [templateList])

    // // ✅ Compute availableFooters (all footers)
    // const availableFooters = useMemo(() => {
    //     return templateList?.filter(t => t.type === 'footer').map(t => ({
    //         value: t.id,
    //         label: t.name || t.id,
    //         html: t.template?.html || '',
    //         css: t.template?.css || '',
    //     })) || []
    // }, [templateList])

    // const selectedHeader = useMemo(() => {
    //     return availableHeaders.find(h => h.value === selectedDocument?.header) || null
    // }, [availableHeaders, selectedDocument])

    // const selectedFooter = useMemo(() => {
    //     return availableFooters.find(f => f.value === selectedDocument?.footer) || null
    // }, [availableFooters, selectedDocument])
    // console.log(selectedDocument);

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

            editor.runCommand('insert-header')
            editor.runCommand('insert-footer')
            editor.on('change', () => {
                const html = editor.getHtml()
                const css = editor.getCss()
                const json = editor.getComponents()
                setValue('document', { html, css, json }) // ✅ use the prop
            })

            editorRef.current = editor
            // onInit(editor);
        }

        return () => {
            if (editorRef.current) {
                editorRef.current.destroy()
                editorRef.current = null
            }
        }
    }, [documentId])

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
