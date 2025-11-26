/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import ListLayout from '@/components/layouts/ListLayout'
import DocumentListTableTools from './components/ListTableTools'
import DocumentListSelected from './components/ListSelected'
import DocumentListTable from './components/ListTable'
import { actionButtons } from './actionButtons'
import { useDocumentListStore } from './store/listStore'
import endpointConfig from '@/configs/endpoint.config'

const DocumentList = () => {
    const { selectedDocument } = useDocumentListStore((state) => state)

    const handleDownload = () => {
        if (selectedDocument.length === 0) {
            alert('Please select a document first!')
            return
        }

        const doc: any = selectedDocument[0]
        const pdfUrl = endpointConfig.master.document.editorview
            .replace(':docId', String(doc.id))
            .replace(':id', String(doc.editor?.id))

        const link = document.createElement('a')
        link.href = pdfUrl
        link.download = `${doc.documentName || 'document'}.pdf`
        document.body.appendChild(link)

        link.click()

        document.body.removeChild(link)
        window.URL.revokeObjectURL(link.href)
    }

    return (
        <ListLayout
            title="Document"
            ActionTools={actionButtons(handleDownload)}
            TableTools={<DocumentListTableTools />}
            Table={<DocumentListTable />}
            SelectedComponent={<DocumentListSelected />}
        />
    )
}

export default DocumentList
