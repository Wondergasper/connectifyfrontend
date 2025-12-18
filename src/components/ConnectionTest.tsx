// Frontend Connection Test Component
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export const ConnectionTest = () => {
    const [status, setStatus] = useState({
        backend: 'testing...',
        database: 'testing...',
        timestamp: null
    });

    useEffect(() => {
        const testConnection = async () => {
            try {
                // Test health endpoint (this is the only test endpoint that exists)
                const healthResponse = await fetch('/api/health');
                if (healthResponse.ok) {
                    const healthData = await healthResponse.json();
                    setStatus({
                        backend: '✅ Connected',
                        database: healthData.database === 'connected' ? '✅ Connected' : '❌ Disconnected',
                        timestamp: healthData.timestamp
                    });
                } else {
                    setStatus({
                        backend: '❌ Failed',
                        database: '❌ Cannot check',
                        timestamp: null
                    });
                }
            } catch (error) {
                setStatus({
                    backend: '❌ Cannot reach backend',
                    database: '❌ Cannot check',
                    timestamp: null
                });
                console.error('Connection test failed:', error);
            }
        };

        testConnection();
    }, []);

    return (
        <div className="fixed bottom-4 right-4 bg-card border border-border rounded-lg p-4 shadow-lg z-50">
            <h3 className="font-bold mb-2">Connection Status</h3>
            <div className="space-y-1 text-sm">
                <div>Backend: {status.backend}</div>
                <div>Database: {status.database}</div>
                {status.timestamp && (
                    <div className="text-xs text-muted-foreground">
                        Last: {new Date(status.timestamp).toLocaleTimeString()}
                    </div>
                )}
            </div>
        </div>
    );
};
