import { useState } from 'react';

const DataIntegrations = () => {
    const [activeTab, setActiveTab] = useState<'upload' | 'connectors'>('upload');
    const [dragActive, setDragActive] = useState(false);

    const connectors = [
        { name: 'Salesforce Financial Cloud', status: 'Connected', lastSync: '2 mins ago', icon: '☁️' },
        { name: 'AMFI NAV Master', status: 'Connected', lastSync: '1 hour ago', icon: '📈' },
        { name: 'CAMS Mailback', status: 'Error', lastSync: 'Failed 4h ago', icon: '📧' },
        { name: 'KFintech RTA', status: 'Disconnected', lastSync: '-', icon: '🏢' },
    ];

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleFileUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8000/api/v1/integrations/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                alert(`Success: ${data.message} (${data.rows_ingested} rows)`);
            } else {
                alert('Upload failed.');
            }
        } catch (error) {
            console.error('Upload Error:', error);
            alert('Error during upload.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold">Data & Integrations</h1>
                    <p className="text-terminal-text-muted text-sm">Ingestion Pipeline • MCP Adapters</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-terminal-border">
                <button
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'upload' ? 'text-terminal-accent border-b-2 border-terminal-accent' : 'text-terminal-text-muted hover:text-terminal-text'}`}
                    onClick={() => setActiveTab('upload')}
                >
                    Manual Upload
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'connectors' ? 'text-terminal-accent border-b-2 border-terminal-accent' : 'text-terminal-text-muted hover:text-terminal-text'}`}
                    onClick={() => setActiveTab('connectors')}
                >
                    MCP Connectors
                </button>
            </div>

            {activeTab === 'upload' && (
                <div className="space-y-4">
                    <div className="bg-terminal-surface border border-terminal-border rounded-lg p-6">
                        <h2 className="text-lg font-bold mb-4">Ingest Market Data (CSV/JSON)</h2>
                        <div
                            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg h-64 transition-colors ${dragActive ? 'border-terminal-accent bg-terminal-accent/10' : 'border-terminal-border bg-terminal-bg'}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={(e) => {
                                handleDrag(e);
                                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                    handleFileUpload(e.dataTransfer.files[0]);
                                }
                            }}
                        >
                            <div className="text-4xl mb-4">📄</div>
                            <p className="font-medium">Drag & Drop files here</p>
                            <p className="text-sm text-terminal-text-muted mt-2">Supports .csv, .xlsx</p>
                            <input
                                type="file"
                                id="fileInput"
                                className="hidden"
                                aria-label="Upload CSV or Excel file"
                                onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                            />
                            <button
                                onClick={() => document.getElementById('fileInput')?.click()}
                                className="mt-4 px-4 py-2 bg-terminal-surface border border-terminal-border rounded hover:bg-terminal-border transition-colors text-sm"
                            >
                                Browse Files
                            </button>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-sm font-bold text-terminal-text-muted mb-2">Recent Uploads</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center p-3 bg-terminal-bg rounded border border-terminal-border">
                                    <div className="flex items-center gap-3">
                                        <span className="text-green-500">✓</span>
                                        <span className="text-sm">holdings_march_2025.csv</span>
                                    </div>
                                    <span className="text-xs text-terminal-text-muted">Processed successfully</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-terminal-bg rounded border border-terminal-border">
                                    <div className="flex items-center gap-3">
                                        <span className="text-red-500">⚠</span>
                                        <span className="text-sm">transactions_q1.xlsx</span>
                                    </div>
                                    <span className="text-xs text-terminal-text-muted">Schema mismatch in Col 4</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'connectors' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {connectors.map(c => (
                        <div key={c.name} className="flex items-center justify-between p-4 bg-terminal-surface border border-terminal-border rounded-lg">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{c.icon}</span>
                                <div>
                                    <div className="font-bold text-sm">{c.name}</div>
                                    <div className="text-xs text-terminal-text-muted">Synced: {c.lastSync}</div>
                                </div>
                            </div>
                            <div className={`px-2 py-1 rounded text-xs border ${c.status === 'Connected' ? 'bg-green-900/20 text-green-400 border-green-900/50' :
                                c.status === 'Error' ? 'bg-red-900/20 text-red-400 border-red-900/50' :
                                    'bg-gray-800 text-gray-400 border-gray-700'
                                }`}>
                                {c.status}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DataIntegrations;
