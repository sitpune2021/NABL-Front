export default function FooterBlock() {
    return (
        <footer
            style={{
                textAlign: 'center',
                padding: '20px',
                background: '#f0f0f0',
                borderTop: '1px solid #ccc',
            }}
        >
            {/* Table Section */}
            <table
                style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '14px',
                    marginTop: '20px',
                    tableLayout: 'fixed',
                    textAlign: 'center',
                }}
            >
                <tbody>
                    <tr>
                        <td
                            style={{
                                border: '1px solid #000',
                                padding: '8px',
                                fontWeight: 'bold',
                            }}
                        >
                            Document No.
                        </td>
                        <td
                            style={{ border: '1px solid #000', padding: '8px' }}
                            contentEditable={true}
                        ></td>
                        <td
                            style={{
                                border: '1px solid #000',
                                padding: '8px',
                                fontWeight: 'bold',
                            }}
                        >
                            Document Name
                        </td>
                        <td
                            colSpan={3}
                            style={{ border: '1px solid #000', padding: '8px' }}
                            contentEditable={true}
                        ></td>
                    </tr>

                    <tr>
                        <td
                            style={{
                                border: '1px solid #000',
                                padding: '8px',
                                textAlign: 'left',
                                fontWeight: 'bold',
                            }}
                        >
                            Prepared By
                        </td>
                        <td
                            colSpan={2}
                            style={{
                                border: '1px solid #000',
                                padding: '8px',
                                textAlign: 'left',
                            }}
                            contentEditable={true}
                        >
                            Name:{' '}
                        </td>
                        <td
                            colSpan={2}
                            style={{
                                border: '1px solid #000',
                                padding: '8px',
                                textAlign: 'left',
                            }}
                            contentEditable={true}
                        >
                            Designation:{' '}
                        </td>
                        <td
                            style={{
                                border: '1px solid #000',
                                padding: '8px',
                                textAlign: 'left',
                            }}
                            contentEditable={true}
                        >
                            Sign:{' '}
                        </td>
                    </tr>

                    <tr>
                        <td
                            style={{
                                border: '1px solid #000',
                                padding: '8px',
                                textAlign: 'left',
                                fontWeight: 'bold',
                            }}
                        >
                            Approved By
                        </td>
                        <td
                            colSpan={2}
                            style={{
                                border: '1px solid #000',
                                padding: '8px',
                                textAlign: 'left',
                            }}
                            contentEditable={true}
                        >
                            Name:{' '}
                        </td>
                        <td
                            colSpan={2}
                            style={{
                                border: '1px solid #000',
                                padding: '8px',
                                textAlign: 'left',
                            }}
                            contentEditable={true}
                        >
                            Designation:{' '}
                        </td>
                        <td
                            style={{
                                border: '1px solid #000',
                                padding: '8px',
                                textAlign: 'left',
                            }}
                            contentEditable={true}
                        >
                            Sign:{' '}
                        </td>
                    </tr>

                    <tr>
                        <td
                            style={{
                                border: '1px solid #000',
                                padding: '8px',
                                textAlign: 'left',
                                fontWeight: 'bold',
                            }}
                        >
                            Issued By
                        </td>
                        <td
                            colSpan={2}
                            style={{
                                border: '1px solid #000',
                                padding: '8px',
                                textAlign: 'left',
                            }}
                            contentEditable={true}
                        >
                            Name:{' '}
                        </td>
                        <td
                            colSpan={2}
                            style={{
                                border: '1px solid #000',
                                padding: '8px',
                                textAlign: 'left',
                            }}
                            contentEditable={true}
                        >
                            Designation:{' '}
                        </td>
                        <td
                            style={{
                                border: '1px solid #000',
                                padding: '8px',
                                textAlign: 'left',
                            }}
                            contentEditable={true}
                        >
                            Sign:{' '}
                        </td>
                    </tr>

                    <tr>
                        <td
                            style={{ border: '1px solid #000', padding: '6px' }}
                        >
                            Issue No.
                        </td>
                        <td
                            style={{ border: '1px solid #000', padding: '6px' }}
                            contentEditable={true}
                        ></td>
                        <td
                            style={{ border: '1px solid #000', padding: '6px' }}
                        >
                            Issue Date
                        </td>
                        <td
                            style={{ border: '1px solid #000', padding: '6px' }}
                            contentEditable={true}
                        ></td>
                        <td
                            style={{ border: '1px solid #000', padding: '6px' }}
                        >
                            Status
                        </td>
                        <td
                            style={{ border: '1px solid #000', padding: '6px' }}
                            contentEditable={true}
                        ></td>
                    </tr>

                    <tr>
                        <td
                            style={{ border: '1px solid #000', padding: '6px' }}
                        >
                            Amendment No.
                        </td>
                        <td
                            style={{ border: '1px solid #000', padding: '6px' }}
                            contentEditable={true}
                        ></td>
                        <td
                            style={{ border: '1px solid #000', padding: '6px' }}
                        >
                            Amendment Date
                        </td>
                        <td
                            style={{ border: '1px solid #000', padding: '6px' }}
                            contentEditable={true}
                        ></td>
                        <td
                            style={{ border: '1px solid #000', padding: '6px' }}
                        >
                            Effective Date
                        </td>
                        <td
                            style={{ border: '1px solid #000', padding: '6px' }}
                            contentEditable={true}
                        ></td>
                    </tr>

                    <tr>
                        <td
                            style={{ border: '1px solid #000', padding: '6px' }}
                        >
                            Copy No.
                        </td>
                        <td
                            style={{ border: '1px solid #000', padding: '6px' }}
                            contentEditable={true}
                        ></td>
                        <td
                            style={{ border: '1px solid #000', padding: '6px' }}
                        >
                            Copy Location
                        </td>
                        <td
                            style={{ border: '1px solid #000', padding: '6px' }}
                            contentEditable={true}
                        ></td>
                        <td
                            style={{ border: '1px solid #000', padding: '6px' }}
                        >
                            Page No.
                        </td>
                        <td
                            style={{ border: '1px solid #000', padding: '6px' }}
                            contentEditable={true}
                        ></td>
                    </tr>
                </tbody>
            </table>

            {/* Footer Text */}
            <p style={{ marginTop: '20px', fontSize: '13px', color: '#333' }}>
                © {'{{year}}'} {'{{companyName}}'} Pvt Ltd. All rights
                reserved.
            </p>
        </footer>
    )
}
