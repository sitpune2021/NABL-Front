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

            {/* Dynamic Fields */}
            <div style={{ flex: '1 1 auto', textAlign: 'right' }}>
                <span
                    data-gjs-highlightable="true"
                    data-gjs-type="field-lab"
                    draggable="true"
                    data-field="lab"
                    lab-field="name"
                    data-lab-field="name"
                    style={{ margin: 0, fontSize: '18px', display: 'block' }}
                >
                    {'{{lab}}'}
                </span>
                <span
                    data-gjs-highlightable="true"
                    data-gjs-type="field-labLocation"
                    draggable="true"
                    data-field="labLocation"
                    lab-location-field="labLocation"
                    style={{
                        margin: '2px 0',
                        fontSize: '14px',
                        display: 'block',
                    }}
                >{`{{labLocation}}`}</span>
            </div>
        </header>
    )
}
