import { useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { trim, isEmpty } from 'lodash';
import './popup.css';

function Popup() {
    const [attribute, setAttribute] = useState('data-cy');
    const [scanMissing, setScanMissing] = useState(false);
    const [status, setStatus] = useState<string>('');
    const [isScanning, setIsScanning] = useState(false);

    const sendMessageToContentScript = useCallback(
        function(message:Message):Promise<ScanResponse> {
            return new Promise(function(resolve, reject) {
                chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                    const tab = tabs[0];

                    if (!tab?.id) {
                        reject(new Error('No active tab found'));
                        return;
                    }

                    if (tab.url?.startsWith('chrome://')) {
                        reject(new Error('Cannot scan Chrome internal pages'));
                        return;
                    }

                    chrome.tabs.sendMessage(tab.id, message, function(response:ScanResponse) {
                        if (chrome.runtime.lastError) {
                            reject(new Error(chrome.runtime.lastError.message));
                        } else {
                            resolve(response);
                        }
                    });
                });
            });
        },
        []
    );

    const handleScan = useCallback(async function() {
        const trimmedAttr = trim(attribute);

        if (isEmpty(trimmedAttr)) {
            setStatus('⚠️ Please enter an attribute name');
            return;
        }

        setIsScanning(true);
        setStatus('Scanning...');

        try {
            const response = await sendMessageToContentScript({
                action   : 'scan',
                attribute: trimmedAttr,
                mode     : scanMissing ? 'missing' : 'with'
            });

            if (response.success) {
                const modeText = scanMissing ? 'missing' : 'with';

                setStatus(`✅ Found ${response.count} elements ${modeText} [${trimmedAttr}]`);
            } else {
                setStatus(`❌ ${response.error || 'Scan failed'}`);
            }
        } catch (error) {
            setStatus(`❌ ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsScanning(false);
        }
    }, [attribute, scanMissing, sendMessageToContentScript]);

    const handleClear = useCallback(async function() {
        try {
            await sendMessageToContentScript({ action: 'clear' });
            setStatus('🧹 Highlights cleared');
        } catch (error) {
            setStatus(`❌ ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }, [sendMessageToContentScript]);

    return (
        <div className="popup-container">
            <h1 className="popup-title">🔍 Attribute Scanner</h1>

            <div className="input-group">
                <label htmlFor="attribute-input">Attribute Name:</label>
                <input
                    id="attribute-input"
                    type="text"
                    value={attribute}
                    onChange={
                        function(event) {
                            setAttribute(event.target.value);
                        }}
                    placeholder="e.g., data-cy, data-testid"
                    className="attribute-input"
                />
            </div>

            <div className="checkbox-group">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={scanMissing}
                        onChange={
                            function(event) {
                                setScanMissing(event.target.checked);
                            }}
                    />
                    <span>Scan for MISSING attribute</span>
                </label>
                <p className="checkbox-hint">
                    {scanMissing ? '🔴 Will highlight elements WITHOUT the attribute' : '🟢 Will highlight elements WITH the attribute'}
                </p>
            </div>

            <div className="button-group">
                <button className="scan-button" onClick={handleScan} disabled={isScanning}>
                    {isScanning ? 'Scanning...' : 'Scan Page'}
                </button>
                <button className="clear-button" onClick={handleClear}>Clear Highlights</button>
            </div>

            {status && <div className="status-message">{status}</div>}
        </div>
    );
}

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);

    root.render(<Popup />);
}
