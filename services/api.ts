import axios from 'axios';
import { NewsArticle, AcademicInfo, GalleryPhoto, SchoolProfile, SchoolAgenda } from '../types';

// --- 1. KONFIGURASI URL (OTOMATIS) ---
// Ini akan membaca settingan dari Vercel. Jika kosong, pakai localhost.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Buat instance axios agar codingan lebih rapi
const apiInstance = axios.create({
    baseURL: API_URL, // Hapus '/api' disini karena route kita sudah pakai /api/...
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- 2. INTERCEPTOR (Jaga-jaga Token) ---
apiInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Asumsi token disimpan dengan nama 'token'
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const api = {
    // A. LOGIN & AUTH
    login: async (username: string, password: string) => {
        // Otomatis ke: https://backend-kamu.vercel.app/api/login
        const response = await apiInstance.post('/api/login', { username, password });
        return response.data;
    },

    // B. BERITA (NEWS)
    getNews: async (publishedOnly = false) => {
        try {
            const response = await apiInstance.get('/api/berita');
            // Mapping Data: Backend (Indo) -> Frontend (Inggris)
            return response.data.map((item: any) => ({
                id: item.id,
                title: item.judul,
                content: item.isi,
                imageUrl: item.gambar, // URL Cloudinary sudah beres dari backend
                status: 'published',
                createdAt: item.tanggal
            }));
        } catch (error) {
            console.error("Gagal ambil berita", error);
            return [];
        }
    },

    addNews: async (data: any) => {
        // Cek apakah data berupa FormData (Upload Gambar)
        if (data instanceof FormData) {
            const response = await apiInstance.post('/api/berita', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } else {
            // Jika cuma teks
            const response = await apiInstance.post('/api/berita', {
                judul: data.title,
                isi: data.content,
                gambar: data.imageUrl
            });
            return response.data;
        }
    },

    deleteNews: async (id: number) => {
        await apiInstance.delete(`/api/berita/${id}`);
    },
    
    // Fungsi dummy untuk kompatibilitas
    getNewsById: async (id: number) => {
        const all = await api.getNews();
        return all.find((n: any) => n.id === id);
    },
    updateNews: async (article: any) => article,


    // C. AKADEMIK (AGENDA)
    getAcademicInfo: async () => {
        try {
            const response = await apiInstance.get('/api/akademik');
            return response.data.map((item: any) => ({
                id: item.id,
                title: item.judul,
                description: item.deskripsi,
                date: item.tanggal,
                type: item.jenis
            }));
        } catch (error) { return []; }
    },

    getAgenda: async () => {
        try {
            const response = await apiInstance.get('/api/akademik');
            // Ambil 3 data terbaru untuk dashboard
            return response.data.slice(0, 3).map((item: any) => ({
                id: item.id,
                event: item.judul,
                date: item.tanggal
            }));
        } catch (error) { return []; }
    },

    addAcademicInfo: async (info: any) => {
        const response = await apiInstance.post('/api/akademik', info);
        return response.data;
    },

    deleteAcademicInfo: async (id: number) => {
        await apiInstance.delete(`/api/akademik/${id}`);
    },


    // D. GALERI
    getGallery: async () => {
        try {
            const response = await apiInstance.get('/api/galeri');
            return response.data.map((item: any) => ({
                id: item.id,
                title: item.deskripsi,
                imageUrl: item.url_gambar,
                category: item.kategori,
                createdAt: item.tanggal
            }));
        } catch (error) { return []; }
    },

    addGalleryPhoto: async (formData: any) => {
        const response = await apiInstance.post('/api/galeri', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    deleteGalleryPhoto: async (id: number) => {
        await apiInstance.delete(`/api/galeri/${id}`);
    },


    // E. PROFIL SEKOLAH (Database - BUKAN LocalStorage lagi)
    getProfile: async () => {
        try {
            const response = await apiInstance.get('/api/profil');
            const data = response.data;
            
            // Backend sudah mengirim data yang rapi (cek backend index.js)
            // Tapi kita pastikan mappingnya aman
            return {
                name: data.nama_sekolah || data.name,
                vision: data.visi || data.vision,
                mission: data.misi || data.mission, // Array string
                // Data tambahan yang mungkin belum ada di tabel tapi ada di tipe
                history: data.sejarah || 'Sejarah belum diisi',
                address: data.alamat || 'Alamat belum diisi',
                phone: data.telepon || '-',
                email: data.email || '-',
                npsn: data.npsn,
                status: data.status_sekolah || data.status,
                accreditation: data.akreditasi || data.accreditation,
                province: data.provinsi || data.province,
                city: data.kota || data.city,
                postalCode: data.kode_pos || data.postalCode
            };
        } catch (error) {
            console.error("Gagal ambil profil", error);
            // Fallback data agar tidak crash
            return {
                name: 'SMP Aisyiyah Paccinongang',
                vision: '',
                mission: []
            };
        }
    },

    updateProfile: async (data: any) => {
        // Kirim ke database
        const response = await apiInstance.post('/api/profil', data);
        return response.data;
    },

    // F. STATISTIK
    getDashboardStats: async () => {
        try {
            const response = await apiInstance.get('/api/dashboard-stats');
            return response.data;
        } catch (error) {
            return { berita: 0, akademik: 0, galeri: 0, pengunjung: 0 };
        }
    }
};