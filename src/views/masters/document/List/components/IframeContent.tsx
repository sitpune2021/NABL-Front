import { useRef, useEffect } from 'react'

interface ParsedContent {
    header?: string
    content?: string
    footer?: string
}

interface IframeContentProps {
    parsedContent: ParsedContent
    updatedCss: string
}

const IframeContent = ({ parsedContent, updatedCss }: IframeContentProps) => {
    const iframeRef = useRef<HTMLIFrameElement | null>(null)

    useEffect(() => {
        const doc = iframeRef?.current?.contentDocument
        const html = `
      <html>
        <head>
          <style>
            ${updatedCss}
            body {
                        margin: 0;
                        padding: 0;
                        background:white;
                        display: flex;
                        justify-content: center;
                        align-items: flex-start;
                        min-height: 100vh;
                    }

                    /* A4 Page */
                    .a4-page {
                        width: 210mm;
                        min-height: 297mm;
                        background: white;
                        margin: 20px 0;
                        padding: 16mm;
                        position: relative;
                        overflow: hidden;
                    }

                    /* Sections */
                    .header-section {
                        width: 100%;
                        margin-bottom: 10mm;
                    }

                    .content-section {
                        width: 100%;
                        min-height: 200mm;
                    }

                    .footer-section {
                        width: 100%;
                        margin-top: 10mm;
                    }

                    /* Prevent overflow breaking layout */
                    img, table {
                        max-width: 100%;
                    }
          </style>
        </head>
            <body>
                <div class="a4-page">
                    <div class="header-section">
                        ${parsedContent.header || ''}
                    </div>

                    <div class="content-section">
                        ${parsedContent.content || ''}
                    </div>

                    <div class="footer-section">
                        ${parsedContent.footer || ''}
                    </div>
                </div>
        </body>
      </html>
    `

        doc?.open()
        doc?.write(html)
        doc?.close()
    }, [parsedContent, updatedCss])

    return (
        <iframe
            ref={iframeRef}
            style={{
                width: '100%',
                height: '100%',
                border: 'none',
                background: 'White',
            }}
            title="Content Frame"
        />
    )
}

export default IframeContent
