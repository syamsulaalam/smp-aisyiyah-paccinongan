import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import Layout from '../components/Layout';
import { api } from '../services/api';
import { NewsArticle } from '../types';
import { getInstagramEmbedUrl, isInstagramContentUrl } from '../utils/instagram';

const instagramUrlPattern = /https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel|tv)\/[A-Za-z0-9_-]+\/?(?:\?[^\s]*)?/gi;
const placeholderImage = "/images/latarsekolah.webp";

const extractInstagramUrls = (text: string) => text.match(instagramUrlPattern) || [];

const removeInstagramUrls = (text: string) =>
    text
        .replace(instagramUrlPattern, "")
        .replace(/\n+/g, " ")
        .replace(/\s{2,}/g, " ")
        .trim();

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

    const contentBlocks = article.content.split('\n\n').map((paragraph) => {
        const instagramUrls = extractInstagramUrls(paragraph);
        const cleanedText = removeInstagramUrls(paragraph);

        return {
            cleanedText,
            instagramUrls,
        };
    });
    const articleInstagramEmbedUrl = getInstagramEmbedUrl(article.imageUrl);

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

                                <figure className="mb-8 overflow-hidden rounded-lg shadow-lg">
                                    {isInstagramContentUrl(article.imageUrl) && articleInstagramEmbedUrl ? (
                                        <iframe
                                            src={articleInstagramEmbedUrl}
                                            title={article.title}
                                            className="h-[760px] w-full bg-white"
                                            scrolling="no"
                                            allowTransparency={true}
                                        />
                                    ) : (
                                        <img
                                            src={article.imageUrl || placeholderImage}
                                            alt={article.title}
                                            className="w-full h-auto object-cover"
                                            style={{maxHeight: '500px'}}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = placeholderImage;
                                            }}
                                        />
                                    )}
                                </figure>

                                <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                                    {contentBlocks.map((block, index) => (
                                        <div key={index} className="space-y-4">
                                            {block.cleanedText && <p className="text-justify">{block.cleanedText}</p>}

                                            {block.instagramUrls.map((instagramUrl, embedIndex) => {
                                                const embedUrl = getInstagramEmbedUrl(instagramUrl);

                                                if (!embedUrl) {
                                                    return (
                                                        <p key={`${index}-link-${embedIndex}`}>
                                                            <a
                                                                href={instagramUrl}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="text-blue-600 hover:text-blue-800"
                                                            >
                                                                Lihat konten Instagram
                                                            </a>
                                                        </p>
                                                    );
                                                }

                                                return (
                                                    <div key={`${index}-embed-${embedIndex}`} className="not-prose overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                                                        <iframe
                                                            src={embedUrl}
                                                            title={`Instagram embed ${embedIndex + 1}`}
                                                            className="h-[760px] w-full"
                                                            allowTransparency={true}
                                                            scrolling="no"
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
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
                                                <img
                                                    src={isInstagramContentUrl(news.imageUrl) ? placeholderImage : (news.imageUrl || placeholderImage)}
                                                    alt={news.title}
                                                    className="w-24 h-24 rounded-md object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = placeholderImage;
                                                    }}
                                                />
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