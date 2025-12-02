import React from 'react'
import JSZip from 'jszip'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import ListLayout from '@/components/layouts/ListLayout'
import DocumentListTableTools from './components/ListTableTools'
import DocumentListSelected from './components/ListSelected'
import DocumentListTable from './components/ListTable'
import { actionButtons } from './actionButtons'
import { useDocumentListStore } from './store/listStore'
import { Document, DocumentResolved } from '@/@types/document'

function formatDate(dateStr: string, format: string): string {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
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

const DocumentList: React.FC = () => {
    const { selectedDocument } = useDocumentListStore((state) => state)

    const handleDownload = async () => {
        if (!selectedDocument || selectedDocument.length === 0) {
            alert('Please select a document first!')
            return
        }

        const A4_WIDTH_PX = 793
        const zip = new JSZip()

        const pxToMm = (
            px: number,
            canvasWidthPx: number,
            pageWidthMm: number,
        ) => {
            return (px * pageWidthMm) / canvasWidthPx
        }

        for (const doc of selectedDocument as Document[]) {
            try {
                const { header, content, footer } = generateResolvedHtml(doc)
                const css = doc.editor?.document?.css || ''

                const createSection = (html: string) => {
                    const div = document.createElement('div')
                    const overrideCss = `
                        .header-section img{ max-height:60px !important; height:auto !important; width:auto !important; display:inline-block; }
                        .header-section{ min-height:0 !important; height:auto !important; }
                        .footer-section img{ max-height:50px !important; height:auto !important; width:auto !important; }
                        .whiteBackground { padding:0 !important; margin:0 !important; box-sizing:border-box; }
                    `
                    div.innerHTML = `<style>${css}</style><style>${overrideCss}</style>${html}`
                    div.style.position = 'absolute'
                    div.style.left = '-9999px'
                    div.style.top = '0'
                    div.style.width = `${A4_WIDTH_PX}px`
                    div.style.padding = '0'
                    div.style.margin = '0'
                    div.style.background = '#ffffff'
                    div.style.boxSizing = 'border-box'
                    div.style.overflow = 'visible'
                    document.body.appendChild(div)
                    return div
                }

                const headerDiv = createSection(header)
                const footerDiv = createSection(footer)
                const contentDiv = createSection(content)

                await new Promise<void>((resolve) => {
                    const check = () => {
                        const imgs = [
                            ...headerDiv.querySelectorAll('img'),
                            ...footerDiv.querySelectorAll('img'),
                            ...contentDiv.querySelectorAll('img'),
                        ]
                        if (imgs.length === 0) return resolve()
                        const allLoaded = imgs.every(
                            (i) =>
                                (i as HTMLImageElement).complete &&
                                (i as HTMLImageElement).naturalHeight > 0,
                        )
                        if (allLoaded) resolve()
                        else setTimeout(check, 50)
                    }
                    setTimeout(check, 50)
                })

                const canvasOptions: Partial<html2canvas.Options> = {
                    scale: 1,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff',
                    width: A4_WIDTH_PX,
                    scrollX: 0,
                    scrollY: 0,
                    windowWidth: A4_WIDTH_PX,
                }

                const headerHeightPx = headerDiv.offsetHeight
                const footerHeightPx = footerDiv.offsetHeight
                const contentHeightPx = contentDiv.offsetHeight
                const headerCanvas = await html2canvas(headerDiv, {
                    ...canvasOptions,
                    height: headerHeightPx,
                })
                const footerCanvas = await html2canvas(footerDiv, {
                    ...canvasOptions,
                    height: footerHeightPx,
                })

                const contentCanvas = await html2canvas(contentDiv, {
                    ...canvasOptions,
                    height: contentHeightPx,
                })

                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4',
                })
                const pageWidth = pdf.internal.pageSize.getWidth()
                const pageHeight = pdf.internal.pageSize.getHeight()
                const margin = 5
                const headerHeightMM = pxToMm(
                    headerCanvas.height,
                    headerCanvas.width,
                    pageWidth,
                )
                const footerHeightMM = pxToMm(
                    footerCanvas.height,
                    footerCanvas.width,
                    pageWidth,
                )
                const contentCanvasWidthMM = pageWidth - 2 * margin
                const headerHeightToUse = Math.max(
                    6,
                    Math.min(headerHeightMM, pageHeight * 0.4),
                )
                const footerHeightToUse = Math.max(
                    6,
                    Math.min(footerHeightMM, pageHeight * 0.25),
                )

                const availableHeight =
                    pageHeight -
                    headerHeightToUse -
                    footerHeightToUse -
                    2 * margin

                const headerImg = headerCanvas.toDataURL('image/jpeg', 0.98)
                const footerImg = footerCanvas.toDataURL('image/jpeg', 0.98)

                const totalContentHeightMM = pxToMm(
                    contentCanvas.height,
                    contentCanvas.width,
                    contentCanvasWidthMM,
                )
                const totalPages = Math.max(
                    1,
                    Math.ceil(totalContentHeightMM / availableHeight),
                )

                for (let pageNum = 0; pageNum < totalPages; pageNum++) {
                    pdf.addImage(
                        headerImg,
                        'JPEG',
                        margin,
                        margin,
                        contentCanvasWidthMM,
                        headerHeightToUse,
                    )
                    const cropStartPx = Math.round(
                        (pageNum * availableHeight * contentCanvas.width) /
                            contentCanvasWidthMM,
                    )
                    const cropHeightPx = Math.round(
                        (availableHeight * contentCanvas.width) /
                            contentCanvasWidthMM,
                    )
                    const actualCropHeightPx = Math.min(
                        cropHeightPx,
                        contentCanvas.height - cropStartPx,
                    )

                    const croppedCanvas = document.createElement('canvas')
                    croppedCanvas.width = contentCanvas.width
                    croppedCanvas.height = actualCropHeightPx

                    const ctx = croppedCanvas.getContext('2d')
                    ctx?.drawImage(
                        contentCanvas,
                        0,
                        cropStartPx,
                        contentCanvas.width,
                        actualCropHeightPx,
                        0,
                        0,
                        contentCanvas.width,
                        actualCropHeightPx,
                    )

                    const croppedImg = croppedCanvas.toDataURL(
                        'image/jpeg',
                        0.98,
                    )
                    const croppedHeightMM = pxToMm(
                        croppedCanvas.height,
                        contentCanvas.width,
                        contentCanvasWidthMM,
                    )

                    pdf.addImage(
                        croppedImg,
                        'JPEG',
                        margin,
                        margin + headerHeightToUse,
                        contentCanvasWidthMM,
                        croppedHeightMM,
                    )

                    pdf.addImage(
                        footerImg,
                        'JPEG',
                        margin,
                        pageHeight - footerHeightToUse - margin,
                        contentCanvasWidthMM,
                        footerHeightToUse,
                    )

                    pdf.setFontSize(10)
                    pdf.text(
                        `Page ${pageNum + 1} of ${totalPages}`,
                        pageWidth / 2,
                        pageHeight - 2,
                        { align: 'center' },
                    )

                    if (pageNum < totalPages - 1) pdf.addPage()
                }

                const pdfBlob = pdf.output('blob')
                zip.file(`${doc.documentName || 'document'}.pdf`, pdfBlob)

                document.body.removeChild(headerDiv)
                document.body.removeChild(footerDiv)
                document.body.removeChild(contentDiv)
            } catch (err) {
                console.error('Failed to generate PDF', err)
            }
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(zipBlob)
        link.download = 'documents.zip'
        document.body.appendChild(link)
        link.click()
        link.remove()
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
