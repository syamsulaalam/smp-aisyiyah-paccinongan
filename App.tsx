import React from "react";
import "./index.css";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import NewsPage from "./pages/NewsPage";
import NewsDetailPage from "./pages/NewsDetailPage";
import AcademicPage from "./pages/AcademicPage";
import GalleryPage from "./pages/GalleryPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import AdminLayout from "./admin/AdminLayout";
import DashboardPage from "./admin/DashboardPage";
import ManageNewsPage from "./admin/ManageNewsPage";
import ManageAcademicPage from "./admin/ManageAcademicPage";
import ManageGalleryPage from "./admin/ManageGalleryPage";
import ManageProfilePage from "./admin/ManageProfilePage";
import { AuthProvider, useAuth } from "./hooks/useAuth";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profil" element={<ProfilePage />} />

          {/* --- KEMBALI KE /berita AGAR TIDAK LAYAR PUTIH --- */}
          <Route path="/berita" element={<NewsPage />} />
          <Route path="/berita/:id" element={<NewsDetailPage />} />
          {/* ----------------------------------------------- */}

          <Route path="/akademik" element={<AcademicPage />} />
          <Route path="/galeri" element={<GalleryPage />} />
          <Route path="/kontak" element={<ContactPage />} />
          <Route path="/admin-login" element={<LoginPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="berita" element={<ManageNewsPage />} />
            <Route path="akademik" element={<ManageAcademicPage />} />
            <Route path="galeri" element={<ManageGalleryPage />} />
            <Route path="profil" element={<ManageProfilePage />} />
            <Route index element={<Navigate to="dashboard" />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/admin-login" />;
  }
  return children;
};

export default App;
