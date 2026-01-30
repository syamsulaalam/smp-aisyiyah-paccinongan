import React, { useEffect, useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { api } from '../services/api';
import { GalleryPhoto } from '../types';

const GalleryPage: React.FC = () => {
    const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('Semua');

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const data = await api.getGallery();
                setPhotos(data);
            } catch (error) {
                console.error("Failed to fetch gallery", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPhotos();
    }, []);

    const categories = useMemo(() => {
        const allCategories = photos.map(p => p.category);
        return ['Semua', ...Array.from(new Set(allCategories))];
    }, [photos]);

    const filteredPhotos = useMemo(() => {
        if (selectedCategory === 'Semua') {
            return photos;
        }
        return photos.filter(p => p.category === selectedCategory);
    }, [photos, selectedCategory]);

    return (
        <Layout>
            <div className="bg-blue-900">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">Galeri Sekolah</h1>
                    <p className="mt-4 text-xl text-blue-100">Momen dan fasilitas yang ada di sekolah kami.</p>
                </div>
            </div>
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Category Filter */}
                    <div className="flex justify-center mb-8">
                        <div className="flex space-x-2 bg-gray-200 p-1 rounded-full">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                                        selectedCategory === category ? 'bg-blue-400 text-white' : 'text-gray-600 hover:bg-gray-300'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <p className="text-center">Loading...</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredPhotos.map((photo) => (
                                <div key={photo.id} className="group relative">
                                    <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
                                        <img
                                            src={photo.imageUrl}
                                            alt={photo.title}
                                            className="w-full h-full object-cover object-center group-hover:opacity-75 transition-opacity"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <h3 className="text-white text-lg font-semibold">{photo.title}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default GalleryPage;