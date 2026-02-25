import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Layout from "../components/Layout";
import { api } from "../services/api";
import { NewsArticle, SchoolAgenda, GalleryPhoto } from "../types";

const placeholderImage = "/images/latarsekolah.jpg";

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
  return (
    <Layout>
      {/* Hero Section - Fully Responsive */}
      {/* Hero Section - Latar Belakang Scroll Normal */}
      <section
        className="relative text-gray-800 h-screen sm:h-[70vh] flex items-center bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/gps-cs-s/AHVAweq130l_rSFS3InB-CQFmtkT-_jibE8FQpQ_-lceYdi84oof65ahk3q1NnL17riViT6WXuRK4UzYTw93us-dEP0CBFzcX76uCDzKFyOFrskVo7McCZ3Bq2uKzsiBBANmgHGKNbdOhQ=s1360-w1360-h1020-rw')",
        }}
      >
        {/* Overlay Gradient agar teks terbaca jelas */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent md:from-white/95 md:via-white/60 md:to-transparent"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <p className="text-base sm:text-lg font-medium text-blue-700">Selamat Datang di Website Resmi</p>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-blue-900 mt-2 leading-tight">
              SMP Aisyiyah <br className="hidden sm:inline" /> Paccinongang
            </h1>
            <p className="mt-4 text-sm sm:text-lg text-gray-600 leading-relaxed max-w-xl">Menerapkan amar ma'ruf nahi mungkar dan mencetak generasi Muslim yang berakhlak mulia, unggul, modern, integratif, dan berkemajuan.</p>
            <NavLink to="/profil" className="mt-8 inline-block bg-blue-900 text-white font-bold py-3 px-8 rounded-md hover:bg-blue-600 transition-colors shadow-lg">
              Profil Sekolah
            </NavLink>
          </div>
        </div>
      </section>

      {/* Main Content - Responsive Padding */}
      <div className="max-w-7xl mx-auto py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Grid Berita & Agenda - Stack on Mobile, Side by Side on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12 mb-12 md:mb-16">
          {/* Latest News - Full width on mobile, 2/3 on desktop */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 md:mb-8 border-l-4 border-blue-600 pl-3 sm:pl-4">Berita Terbaru</h2>
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              {latestNews.length === 0 ? (
                <p className="text-gray-500 text-sm sm:text-base">Belum ada berita.</p>
              ) : (
                latestNews.map((news) => (
                  <div key={news.id} className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6 items-start sm:items-center group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <NavLink to={`/berita/${news.id}`} className="block h-40 sm:h-48 md:h-40 w-full sm:col-span-1 overflow-hidden rounded-lg">
                      <img
                        src={news.imageUrl || placeholderImage}
                        alt={news.title}
                        className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = placeholderImage;
                        }}
                      />
                    </NavLink>
                    <div className="sm:col-span-2 p-3 sm:p-4 md:p-4">
                      <h3 className="text-lg sm:text-xl md:text-lg font-semibold text-gray-800 hover:text-blue-700 transition line-clamp-2">
                        <NavLink to={`/berita/${news.id}`}>{news.title}</NavLink>
                      </h3>
                      <p className="text-gray-500 mt-2 text-xs sm:text-sm">{new Date(news.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                      <p className="text-gray-600 mt-2 sm:mt-3 text-sm line-clamp-2">{news.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-6 sm:mt-8 text-right">
              <NavLink to="/berita" className="text-blue-600 hover:text-blue-800 font-semibold text-sm sm:text-base transition">
                Lihat Semua Berita →
              </NavLink>
            </div>
          </div>

          {/* Agenda - Full width on mobile, 1/3 on desktop */}
          <div className="lg:col-span-1">
            <div className="bg-blue-50 rounded-lg shadow-md p-4 sm:p-6 border border-blue-100 lg:sticky lg:top-24">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-3 sm:mb-4">Info Akademik</h2>
              <ul className="space-y-3 sm:space-y-4">
                {agenda.length === 0 ? (
                  <p className="text-gray-500 text-sm">Tidak ada agenda.</p>
                ) : (
                  agenda.map((item) => (
                    <li key={item.id} className="flex items-start bg-white p-3 rounded-lg shadow-sm gap-2 sm:gap-3">
                      <div className="bg-blue-600 text-white rounded-md text-center w-12 h-12 sm:w-14 sm:h-14 flex flex-col justify-center items-center flex-shrink-0">
                        <span className="text-xs font-bold uppercase">{new Date(item.date).toLocaleDateString("id-ID", { month: "short" })}</span>
                        <span className="text-lg sm:text-xl font-bold">{new Date(item.date).getDate()}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 line-clamp-2 text-sm sm:text-base">{item.event}</p>
                        <p className="text-xs sm:text-sm text-gray-500">{new Date(item.date).toLocaleDateString("id-ID", { weekday: "long" })}</p>
                      </div>
                    </li>
                  ))
                )}
              </ul>
              <div className="mt-4 sm:mt-6 text-center">
                <NavLink to="/akademik" className="text-blue-600 hover:text-blue-800 font-semibold text-xs sm:text-sm transition">
                  Lihat Kalender Akademik
                </NavLink>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Section - Fully Responsive Grid */}
        <div className="mt-10 md:mt-12 lg:mt-16 pt-8 sm:pt-10 md:pt-12 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 border-l-4 border-purple-600 pl-3 sm:pl-4">Galeri Sekolah</h2>
            <NavLink to="/galeri" className="text-blue-900 hover:text-blue-700 font-semibold text-sm sm:text-base transition-colors">
              Lihat Galeri →
            </NavLink>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {latestGallery.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 text-sm sm:text-base">Belum ada foto galeri.</p>
            ) : (
              latestGallery.map((photo) => (
                <div key={photo.id} className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-500 aspect-square md:aspect-video lg:aspect-square bg-gray-100">
                  {/* Image with Zoom Effect */}
                  <img
                    src={photo.imageUrl || placeholderImage}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = placeholderImage;
                    }}
                  />

                  {/* Gradient Overlay - Transparent top to dark bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Content with Slide Up Animation */}
                  <div className="absolute inset-0 flex flex-col items-start justify-end p-2 sm:p-3 md:p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span
                      className={`text-xs px-2 py-1 rounded text-white mb-2 inline-block transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-100 ${
                        photo.category === "Kegiatan" ? "bg-blue-600" : "bg-blue-900"
                      }`}
                    >
                      {photo.category}
                    </span>
                    <p className="text-white font-semibold line-clamp-2 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-150 text-sm md:text-base">{photo.title}</p>
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
