
import React from 'react';

import Header from './Header';
import { Outlet } from 'react-router-dom'; // Import Outlet

const Layout: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
            <Header />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <Outlet /> {/* Render Outlet for nested routes */}
            </main>
        </div>
    );
};

export default Layout;
