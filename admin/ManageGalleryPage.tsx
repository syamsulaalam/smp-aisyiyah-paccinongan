import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { GalleryPhoto } from '../types';

const ManageGalleryPage: React.FC = () => {
    // State Data Galeri
    const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
    const [loading, setLoading] = useState(true);

    // State untuk Modal & Form Upload
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Kegiatan');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    // 1. Ambil Data saat halaman dibuka
    const fetchPhotos = async () => {
        try {
            setLoading(true);
            const data = await api.getGallery();
            setPhotos(data);
        } catch (error) {
            console.error("Gagal ambil data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPhotos();
    }, []);

    // 2. Handle Pilih File
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    // 3. Handle Submit (Upload ke Backend)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedFile) {
            alert('Pilih foto dulu!');
            return;
        }

        setUploading(true);

        try {
            // PENTING: Bungkus data dalam FormData agar bisa kirim file
            const formData = new FormData();
            formData.append('title', title);
            formData.append('category', category);
            formData.append('image', selectedFile); // 'image' harus sama dengan backend

            await api.addGalleryPhoto(formData);

            alert('Foto berhasil diupload!');
            
            // Reset Form & Tutup Modal
            setTitle('');
            setSelectedFile(null);
            setIsModalOpen(false);
            
            // Refresh data agar foto baru muncul
            fetchPhotos();
        } catch (error) {
            console.error(error);
            alert('Gagal upload foto.');
        } finally {
            setUploading(false);
        }
    };

    // 4. Handle Hapus
    const handleDelete = async (id: number) => {
        if (window.confirm("Yakin ingin menghapus foto ini?")) {
            try {
                // Pastikan fungsi ini ada di api.ts, atau pakai fetch manual sementara
                // await api.deleteGalleryPhoto(id); 
                // Jika belum ada di api.ts, pakai fetch langsung:
                await fetch(`http://localhost:5000/api/galeri/${id}`, { method: 'DELETE' });
                
                fetchPhotos(); // Refresh data
            } catch (error) {
                alert("Gagal menghapus foto");
            }
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Manajemen Galeri</h1>
                {/* Tombol Membuka Modal */}
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                    + Upload Foto Baru
                </button>
            </div>

            {loading ? (
                <p className="text-center text-gray-500">Loading data...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {photos.map(photo => (
                        <div key={photo.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                            <img src={photo.imageUrl} alt={photo.title} className="h-48 w-full object-cover"/>
                            <div className="p-4">
                                <span className={`text-xs px-2 py-1 rounded-full ${photo.category === 'Kegiatan' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                                    {photo.category}
                                </span>
                                <h3 className="text-lg font-semibold text-gray-800 truncate mt-2">{photo.title}</h3>
                                
                                <div className="mt-4 flex justify-end space-x-2 border-t pt-2">
                                    <button 
                                        onClick={() => handleDelete(photo.id)}
                                        className="text-sm text-red-600 hover:text-red-900 font-medium"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- MODAL / POPUP UPLOAD --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Upload Foto Baru</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Input Judul */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Foto</label>
                                <input 
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                    placeholder="Contoh: Lomba Futsal"
                                />
                            </div>

                            {/* Input Kategori */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                <select 
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md p-2"
                                >
                                    <option value="Kegiatan">Kegiatan</option>
                                    <option value="Fasilitas">Fasilitas</option>
                                </select>
                            </div>

                            {/* Input File */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Gambar</label>
                                <input 
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    required
                                />
                            </div>

                            {/* Tombol Aksi */}
                            <div className="flex justify-end space-x-3 mt-6">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit"
                                    disabled={uploading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {uploading ? 'Mengupload...' : 'Simpan Foto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageGalleryPage;