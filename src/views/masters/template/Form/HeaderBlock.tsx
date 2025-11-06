// HeaderBlock.tsx
export default function HeaderBlock() {
    return (
        <header
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 20px',
                background: '#f0f0f0',
                borderBottom: '1px solid #ccc',
                width: '100%',
                boxSizing: 'border-box',
            }}
        >
            {/* Logo on left */}
            <div style={{ flex: '0 0 auto' }}>
                <img
                    src="https://iconape.com/wp-content/files/ge/264650/png/NABL_India-logo.png"
                    alt="Logo"
                    style={{
                        width: '120px',
                        height: '60px',
                        objectFit: 'contain',
                    }}
                />
            </div>

            <div style={{ flex: '1 1 auto', textAlign: 'right' }}>
                <h2 style={{ margin: 0, fontSize: '18px' }}>
                    {'{{lab_name}}'}
                </h2>
                <p style={{ margin: '2px 0', fontSize: '14px' }}>
                    {'{{address}}'}
                </p>
            </div>
        </header>
    )
}
