import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Layout from '../components/Layout';
import { api } from '../services/api';
import { NewsArticle } from '../types';

const NewsPage: React.FC = () => {
    // Inisialisasi dengan array kosong agar aman
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                // Ambil data dari backend
                const data = await api.getNews(true);
                
                // PENGAMAN 1: Pastikan data yang diterima benar-benar Array
                if (Array.isArray(data)) {
                    setNews(data);
                } else {
                    console.error("Data berita bukan array:", data);
                    setNews([]); 
                }
            } catch (error) {
                console.error("Gagal memuat berita:", error);
                setNews([]); // Jika error, kosongkan list agar tidak crash
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    // PENGAMAN 2: Fungsi format tanggal yang tidak akan bikin error
    const formatDate = (dateString: string) => {
        try {
            if (!dateString) return '';
            return new Date(dateString).toLocaleDateString('id-ID', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch (e) {
            return '-'; // Jika tanggal rusak, tampilkan strip
        }
    };

    // Gambar cadangan jika foto rusak/kosong
    const placeholderImage = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop";

    return (
        <Layout>
            <div className="bg-blue-900 text-white">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl">Berita & Kegiatan</h1>
                    <p className="mt-4 text-xl text-blue-200">Ikuti terus informasi dan kegiatan terbaru dari sekolah kami.</p>
                </div>
            </div>

            <div className="py-16 bg-white min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">Memuat berita...</p>
                        </div>
                    ) : (
                        <>
                            {news.length === 0 ? (
                                <div className="text-center py-20">
                                    <p className="text-gray-500 text-xl">Belum ada berita yang diterbitkan.</p>
                                </div>
                            ) : (
                                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                    {news.map((article) => (
                                        <div key={article.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white hover:shadow-2xl transition-shadow duration-300">
                                            <div className="flex-shrink-0">
                                                {/* Link ke Detail Berita */}
                                                <NavLink to={`/news/${article.id}`}> 
                                                    <img 
                                                        className="h-48 w-full object-cover transform hover:scale-105 transition-transform duration-500" 
                                                        // Gunakan gambar placeholder jika kosong
                                                        src={article.imageUrl || placeholderImage} 
                                                        alt={article.title} 
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = placeholderImage;
                                                        }}
                                                    />
                                                </NavLink>
                                            </div>
                                            <div className="flex-1 p-6 flex flex-col justify-between">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-blue-600">
                                                        Kegiatan Sekolah
                                                    </p>
                                                    <NavLink to={`/news/${article.id}`} className="block mt-2">
                                                        <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-700 transition-colors line-clamp-2">
                                                            {article.title}
                                                        </h3>
                                                        <p className="mt-3 text-base text-gray-500 line-clamp-3">
                                                            {article.content}
                                                        </p>
                                                    </NavLink>
                                                </div>
                                                <div className="mt-6 flex items-center border-t pt-4">
                                                    <div className="flex-shrink-0">
                                                        {/* Ikon Kalender */}
                                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            Admin Sekolah
                                                        </p>
                                                        <div className="flex space-x-1 text-sm text-gray-500">
                                                            <time dateTime={article.createdAt}>
                                                                {formatDate(article.createdAt)}
                                                            </time>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default NewsPage;