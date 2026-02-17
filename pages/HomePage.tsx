import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Layout from "../components/Layout";
import { api } from "../services/api";
import { NewsArticle, SchoolAgenda, GalleryPhoto } from "../types";

const HomePage: React.FC = () => {
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
  const [agenda, setAgenda] = useState<SchoolAgenda[]>([]);
  const [latestGallery, setLatestGallery] = useState<GalleryPhoto[]>([]);

  // --- 1. FETCH DATA UTAMA (BERITA, AGENDA, GALERI) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch News
        const news = await api.getNews(true);
        if (Array.isArray(news)) {
          setLatestNews(news.slice(0, 3));
        }

        // Fetch Agenda
        const schoolAgenda = await api.getAgenda();
        if (Array.isArray(schoolAgenda)) {
          setAgenda(schoolAgenda);
        }

        // Fetch Gallery
        const galleryData = await api.getGallery();
        if (Array.isArray(galleryData)) {
          setLatestGallery(galleryData.slice(0, 4));
        }
      } catch (error) {
        console.error("Gagal memuat data:", error);
      }
    };
    fetchData();
  }, []);

  // --- 2. HITUNG PENGUNJUNG (PENTING AGAR DASHBOARD BERTAMBAH) ---
  useEffect(() => {
    // Kirim request POST ke backend saat halaman dibuka
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const visitUrl = `${apiUrl}/api/visit`;

    console.log("📍 HomePage loaded - Recording visitor...");
    console.log("🔗 Visit URL:", visitUrl);

    fetch(visitUrl, { method: "POST" })
      .then((res) => {
        console.log("✅ Visit response status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("✅ Visit recorded successfully:", data);
      })
      .catch((err) => {
        console.error("❌ Gagal mencatat pengunjung:", err);
      });
  }, []);

  const placeholderImage = "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSy8vlHhwWBc07794YaTqSJHfa9qaDAIF2AYpiq2h5UfHTjwAZG40Kr3biWPbidzTLP8zzSXVvakQriSAiZ8voq88r735KYDCqZFXOMFjAkUTFs0Z24sKM3t9vMkxZ4xTRg4cBcq_g=s1360-w1360-h1020-rw";

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative text-gray-800 h-[70vh] flex items-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/gps-cs-s/AHVAweqiHZNoHScmUhY4L5JQTP8cBdfDPL3-6OMw2HlyJaa4xpeQlHsacSfL0gAgFbqwkGIerObRchm6wm9V_qqZMPMzFu6_Y8PPmvVh7hbNhf6PCS0hHkJjWoTUZqV8yC8ydnfCG6YQxg=s1360-w1360-h1020-rw')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl">
            <p className="text-lg font-medium text-blue-700">Selamat Datang di Website Resmi</p>
            <h1 className="text-4xl md:text-6xl font-extrabold text-blue-900 mt-2">SMP Aisyiyah Paccinongang</h1>
            <p className="mt-4 text-lg md:text-xl text-gray-600">Menerapkan amar ma’ruf nahi mungkar dan mencetak generasi Muslim yang berakhlak mulia, unggul, modern, integratif, dan berkemajuan.</p>
            <NavLink to="/profil" className="mt-8 inline-block bg-blue-900 text-white font-bold py-3 px-8 rounded-md hover:bg-blue-600 transition-colors shadow-lg">
              Profil Sekolah
            </NavLink>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Grid Berita & Agenda */}
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          {/* Latest News */}
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-l-4 border-blue-600 pl-4">Berita Terbaru</h2>
            <div className="space-y-8">
              {latestNews.length === 0 ? (
                <p className="text-gray-500">Belum ada berita.</p>
              ) : (
                latestNews.map((news) => (
                  <div key={news.id} className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <NavLink to={`/berita/${news.id}`} className="block h-40 w-full sm:col-span-1 overflow-hidden">
                      <img
                        src={news.imageUrl || placeholderImage}
                        alt={news.title}
                        className="h-full w-full object-cover transform group-hover:scale-110 transition duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = placeholderImage;
                        }}
                      />
                    </NavLink>
                    <div className="sm:col-span-2 p-4">
                      <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-700 transition">
                        <NavLink to={`/berita/${news.id}`}>{news.title}</NavLink>
                      </h3>
                      <p className="text-gray-500 mt-2 text-sm">{new Date(news.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                      <p className="text-gray-600 mt-3 line-clamp-2">{news.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-8 text-right">
              <NavLink to="/berita" className="text-blue-600 hover:text-blue-800 font-semibold">
                Lihat Semua Berita →
              </NavLink>
            </div>
          </div>

          {/* Agenda */}
          <div className="md:col-span-1">
            <div className="bg-blue-50 rounded-lg shadow-md p-6 sticky top-24 border border-blue-100">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">Info Akademik</h2>
              <ul className="space-y-4">
                {agenda.length === 0 ? (
                  <p className="text-gray-500">Tidak ada agenda.</p>
                ) : (
                  agenda.map((item) => (
                    <li key={item.id} className="flex items-start bg-white p-3 rounded-lg shadow-sm">
                      <div className="bg-blue-600 text-white rounded-md text-center w-14 h-14 flex flex-col justify-center items-center flex-shrink-0 mr-4">
                        <span className="text-xs font-bold uppercase">{new Date(item.date).toLocaleDateString("id-ID", { month: "short" })}</span>
                        <span className="text-xl font-bold">{new Date(item.date).getDate()}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 line-clamp-2">{item.event}</p>
                        <p className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString("id-ID", { weekday: "long" })}</p>
                      </div>
                    </li>
                  ))
                )}
              </ul>
              <div className="mt-6 text-center">
                <NavLink to="/akademik" className="text-blue-600 hover:text-blue-800 font-semibold text-sm">
                  Lihat Kalender Akademik
                </NavLink>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="mt-12 pt-12 border-t border-gray-200">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 border-l-4 border-purple-600 pl-4">Galeri Sekolah</h2>
            <NavLink to="/galeri" className="text-blue-900 hover:text-blue-700 font-semibold transition-colors">
              Lihat Galeri →
            </NavLink>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {latestGallery.length === 0 ? (
              <p className="col-span-4 text-center text-gray-500">Belum ada foto galeri.</p>
            ) : (
              latestGallery.map((photo) => (
                <div key={photo.id} className="group relative overflow-hidden rounded-lg shadow-lg h-64 bg-gray-100">
                  <img
                    src={photo.imageUrl || placeholderImage}
                    alt={photo.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = placeholderImage;
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div>
                      <span className={`text-xs px-2 py-1 rounded text-white mb-2 inline-block ${photo.category === "Kegiatan" ? "bg-blue-600" : "bg-blue-900"}`}>{photo.category}</span>
                      <p className="text-white font-semibold line-clamp-2">{photo.title}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
