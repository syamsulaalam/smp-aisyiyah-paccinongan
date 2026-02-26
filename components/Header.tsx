import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const SchoolLogo = () => {
  // URL Logo tetap sama
  const urlLogo =
    "data:image/png;base64,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";

  return <img src={urlLogo} alt="Logo Sekolah" width="40" height="40" style={{ objectFit: "contain" }} />;
};

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-blue-700 font-bold px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm transition-colors block"
      : "text-gray-600 hover:text-blue-700 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors block hover:bg-blue-50";

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0">
            <NavLink to="/" className="flex items-center space-x-2 sm:space-x-3 transition-opacity hover:opacity-80">
              <SchoolLogo />
              <span className="text-base sm:text-lg md:text-xl font-bold text-blue-800 hidden sm:inline-block whitespace-nowrap">SMP AP</span>
            </NavLink>
          </div>

          {/* Desktop Navigation - Hidden on Mobile/Tablet Below md */}
          <div className="hidden md:flex md:items-center md:space-x-1 lg:space-x-2">
            <NavLink to="/" className={({ isActive }) => `${isActive ? "text-blue-700 font-bold" : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"} px-3 lg:px-4 py-2 rounded-md text-sm transition-colors`}>
              Beranda
            </NavLink>
            <NavLink to="/profil" className={({ isActive }) => `${isActive ? "text-blue-700 font-bold" : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"} px-3 lg:px-4 py-2 rounded-md text-sm transition-colors`}>
              Profil
            </NavLink>
            <NavLink to="/berita" className={({ isActive }) => `${isActive ? "text-blue-700 font-bold" : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"} px-3 lg:px-4 py-2 rounded-md text-sm transition-colors`}>
              Berita
            </NavLink>
            <NavLink to="/akademik" className={({ isActive }) => `${isActive ? "text-blue-700 font-bold" : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"} px-3 lg:px-4 py-2 rounded-md text-sm transition-colors`}>
              Akademik
            </NavLink>
            <NavLink to="/galeri" className={({ isActive }) => `${isActive ? "text-blue-700 font-bold" : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"} px-3 lg:px-4 py-2 rounded-md text-sm transition-colors`}>
              Galeri
            </NavLink>
            <NavLink to="/kontak" className={({ isActive }) => `${isActive ? "text-blue-700 font-bold" : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"} px-3 lg:px-4 py-2 rounded-md text-sm transition-colors`}>
              Kontak
            </NavLink>
          </div>

          {/* Mobile Menu Button - Visible only on Mobile/Tablet Below md */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="h-5 w-5 sm:h-6 sm:w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="h-5 w-5 sm:h-6 sm:w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Slide Down Animation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink to="/" className={getNavLinkClass} onClick={() => setIsOpen(false)}>
              Beranda
            </NavLink>
            <NavLink to="/profil" className={getNavLinkClass} onClick={() => setIsOpen(false)}>
              Profil
            </NavLink>
            <NavLink to="/berita" className={getNavLinkClass} onClick={() => setIsOpen(false)}>
              Berita
            </NavLink>
            <NavLink to="/akademik" className={getNavLinkClass} onClick={() => setIsOpen(false)}>
              Akademik
            </NavLink>
            <NavLink to="/galeri" className={getNavLinkClass} onClick={() => setIsOpen(false)}>
              Galeri
            </NavLink>
            <NavLink to="/kontak" className={getNavLinkClass} onClick={() => setIsOpen(false)}>
              Kontak
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
