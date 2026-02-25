import React, { useEffect, useState, useMemo } from "react";
import Layout from "../components/Layout";
import { api } from "../services/api";
import { GalleryPhoto } from "../types";

const GalleryPage: React.FC = () => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Semua");

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
    const allCategories = photos.map((p) => p.category);
    return ["Semua", ...Array.from(new Set(allCategories))];
  }, [photos]);

  const filteredPhotos = useMemo(() => {
    if (selectedCategory === "Semua") {
      return photos;
    }
    return photos.filter((p) => p.category === selectedCategory);
  }, [photos, selectedCategory]);

  return (
    <Layout>
      <div className="bg-blue-900">
        <div className="max-w-7xl mx-auto py-8 px-3 sm:py-16 md:py-20 lg:py-24 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight">Galeri Sekolah</h1>
          <p className="mt-2 sm:mt-3 md:mt-4 text-base sm:text-lg md:text-xl text-blue-100">Momen dan fasilitas yang ada di sekolah kami.</p>
        </div>
      </div>
      <div className="py-8 sm:py-12 md:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Category Filter - Responsive */}
          <div className="flex justify-center mb-6 sm:mb-8 md:mb-10">
            <div className="flex flex-wrap justify-center gap-1 sm:gap-2 bg-gray-200 p-1 sm:p-2 rounded-full">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-semibold rounded-full transition-colors whitespace-nowrap ${selectedCategory === category ? "bg-blue-400 text-white" : "text-gray-600 hover:bg-gray-300"}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {filteredPhotos.map((photo) => (
                <div key={photo.id} className="group relative overflow-hidden rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="w-full aspect-square sm:h-56 md:h-64 bg-gray-200 overflow-hidden">
                    <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover object-center group-hover:scale-125 transition-transform duration-700 ease-out" referrerPolicy="no-referrer" loading="lazy" />
                  </div>
                  {/* Gradient Overlay - Transparent top to dark bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  {/* Text with Slide Up Animation */}
                  <div className="absolute inset-0 flex items-end p-2 sm:p-3 md:p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-white text-sm sm:text-base md:text-lg font-semibold drop-shadow-md line-clamp-2 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-500">{photo.title}</h3>
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
