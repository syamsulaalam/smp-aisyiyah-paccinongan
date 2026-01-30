import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminLayout: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/admin-login');
    };

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center px-4 py-2 my-1 rounded-lg transition-colors ${
            isActive ? 'bg-blue-700 text-white' : 'text-gray-200 hover:bg-blue-800 hover:text-white'
        }`;

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="p-4">
                <h1 className="text-white text-2xl font-bold">Admin Panel</h1>
                <p className="text-gray-300 text-sm">SMP Aisyiyah Paccinongang</p>
            </div>
            <nav className="flex-grow px-2">
                <NavLink to="dashboard" className={navLinkClass}>Dashboard</NavLink>
                <NavLink to="berita" className={navLinkClass}>Manajemen Berita</NavLink>
                <NavLink to="akademik" className={navLinkClass}>Info Akademik</NavLink>
                <NavLink to="galeri" className={navLinkClass}>Manajemen Galeri</NavLink>
                <NavLink to="profil" className={navLinkClass}>Profil Sekolah</NavLink>
            </nav>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-30 transition-opacity bg-black opacity-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}></div>
            <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-blue-900 transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
                <SidebarContent />
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:flex lg:flex-shrink-0">
                <div className="flex flex-col w-64 bg-blue-900">
                    <SidebarContent />
                </div>
            </div>

            <div className="flex flex-col flex-1 overflow-hidden">
                <header className="flex items-center justify-between p-4 bg-white border-b">
                     <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                    <div className="flex-1"></div>
                    <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
                        Logout
                    </button>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;