
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const ServerStatusBanner: React.FC = () => {
    const { retryConnection } = useAuth();
    const [isRetrying, setIsRetrying] = useState(false);

    const handleRetry = async () => {
        setIsRetrying(true);
        await retryConnection();
        // The banner will disappear automatically if the connection is successful.
        // If it fails, we re-enable the button after a short delay.
        setTimeout(() => setIsRetrying(false), 1000); 
    };

    return (
        <div className="bg-blue-600 text-white text-center p-3 text-sm font-semibold z-50 shadow-lg">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-2">
                <div>
                    <p className="font-bold text-base">You are in Offline Demo Mode</p>
                    <p className="mt-1">The backend server is not connected. Start it (<code className="bg-blue-800 px-1 rounded">npm start</code> in the <code className="bg-blue-800 px-1 rounded">backend</code> directory) to use live data.</p>
                </div>
                <button
                    onClick={handleRetry}
                    disabled={isRetrying}
                    className="mt-2 md:mt-0 md:ml-4 px-4 py-2 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-100 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                    {isRetrying && (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    {isRetrying ? 'Retrying...' : 'Retry Connection'}
                </button>
            </div>
        </div>
    );
};

export default ServerStatusBanner;