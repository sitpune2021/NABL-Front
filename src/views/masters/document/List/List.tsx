import React from 'react'
import JSZip from 'jszip'
import html2pdf from 'html2pdf.js'
import ListLayout from '@/components/layouts/ListLayout'
import DocumentListTableTools from './components/ListTableTools'
import DocumentListSelected from './components/ListSelected'
import DocumentListTable from './components/ListTable'
import { actionButtons } from './actionButtons'
import { useDocumentListStore } from './store/listStore'
import { Document, DocumentResolved } from '@/@types/document'

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
    data: DocumentResolved,
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
                    dateValue = new Date().toISOString()
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
            return ''
    }
}

// Parse HTML and replace placeholders
function generateResolvedHtml(docs: Document) {
    const parsedContent = { header: '', content: '', footer: '' }

    try {
        const parser = new DOMParser()
        const doc = parser.parseFromString(
            docs.editor?.document?.html || '',
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
            const value = resolveFieldValue(field, docs, options)
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

    return parsedContent
}

// --- Main Component ---

const DocumentList: React.FC = () => {
    const { selectedDocument } = useDocumentListStore((state) => state)

    const handleDownload = async () => {
        if (selectedDocument.length === 0) {
            alert('Please select a document first!')
            return
        }

        const zip = new JSZip()

        for (const doc of selectedDocument as Document[]) {
            const updatedCss = extractMediaQueryStyles(
                doc.editor?.document?.css || '',
                'max-width: 210mm',
            )
            const { header, content, footer } = generateResolvedHtml(doc)

            const htmlForPdf = `
        <html>
          <head>
            <style>${updatedCss}</style>
          </head>
          <body style="margin:0; padding:0; background-color:white; width:210mm; height:297mm;">
            ${header}
            ${content}
            ${footer}
          </body>
        </html>
      `

            try {
                const pdfBlob = (await html2pdf()
                    .from(htmlForPdf)
                    .set({
                        html2canvas: { scale: 2 },
                        jsPDF: { format: 'a4' },
                    })
                    .outputPdf('blob')) as Promise<Blob>

                zip.file(`${doc.documentName}.pdf`, pdfBlob)
            } catch (error) {
                console.error(
                    `Failed to generate PDF for ${doc.documentName}`,
                    error,
                )
            }
        }

        try {
            const zipBlob = await zip.generateAsync({ type: 'blob' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(zipBlob)
            link.download = 'selected-documents.zip'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(link.href)
        } catch (error) {
            console.error('Failed to generate ZIP', error)
        }
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
