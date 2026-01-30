import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import Layout from '../components/Layout';
import { api } from '../services/api';
import { NewsArticle } from '../types';

const NewsDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<NewsArticle | null>(null);
    const [recentNews, setRecentNews] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!id) {
                setError("ID berita tidak valid.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const articleId = parseInt(id, 10);
                const data = await api.getNewsById(articleId);
                setArticle(data);

                const allNews = await api.getNews(true);
                setRecentNews(allNews.filter(n => n.id !== articleId).slice(0, 4));

            } catch (err) {
                setError("Gagal memuat berita.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return <Layout><div className="text-center p-10">Loading...</div></Layout>;
    }

    if (error) {
        return <Layout><div className="text-center p-10 text-red-600">{error}</div></Layout>;
    }

    if (!article) {
        return <Layout><div className="text-center p-10">Berita tidak ditemukan.</div></Layout>;
    }

    return (
        <Layout>
            <div className="bg-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <article>
                                <header className="mb-8">
                                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                                        {article.title}
                                    </h1>
                                    <p className="mt-4 text-gray-500 text-sm">
                                        Dipublikasikan pada {new Date(article.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </header>

                                <figure className="mb-8">
                                    <img 
                                        src={article.imageUrl} 
                                        alt={article.title} 
                                        className="w-full h-auto rounded-lg shadow-lg object-cover" 
                                        style={{maxHeight: '500px'}}
                                    />
                                </figure>

                                <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                                    {article.content.split('\n\n').map((paragraph, index) => (
                                        <p key={index}>{paragraph}</p>
                                    ))}
                                </div>
                            </article>
                        </div>

                        {/* Sidebar with Recent News */}
                        <aside className="lg:col-span-1">
                            <div className="sticky top-24">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-blue-600 pl-4">
                                    Berita Lainnya
                                </h2>
                                <div className="space-y-6">
                                    {recentNews.map(news => (
                                        <div key={news.id} className="flex items-center space-x-4">
                                            <NavLink to={`/berita/${news.id}`} className="flex-shrink-0">
                                                <img src={news.imageUrl} alt={news.title} className="w-24 h-24 rounded-md object-cover" />
                                            </NavLink>
                                            <div>
                                                <h3 className="text-md font-semibold text-gray-800 hover:text-blue-700">
                                                    <NavLink to={`/berita/${news.id}`}>{news.title}</NavLink>
                                                </h3>
                                                <p className="text-xs text-gray-500 mt-1">
                                                     {new Date(news.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default NewsDetailPage;