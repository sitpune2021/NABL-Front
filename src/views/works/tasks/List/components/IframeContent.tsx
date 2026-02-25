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
          </style>
        </head>
        <body style="margin:0; padding:0; background-color:white; width:210mm; height:297mm;">
          ${parsedContent.header || ''}
          ${parsedContent.content || ''}
          ${parsedContent.footer || ''}
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
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Content Frame"
        />
    )
}

export default IframeContent
