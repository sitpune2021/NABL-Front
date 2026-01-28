export const wrapWithStyle = (html: string, css: string) => `
<html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; font-size: 14px; }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 8px;
      }
      th, td {
        border: 1px solid #ccc;
        padding: 6px 8px;
        text-align: left;
      }
      thead {
        background: #f5f5f5;
        font-weight: bold;
      }
      tbody tr:nth-child(even) {
        background: #fafafa;
      }
        ${css}
    </style>
  </head>
  <body>
    ${html}
  </body>
</html>
`
