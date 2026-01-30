import { NewsArticle, AcademicInfo, GalleryPhoto, SchoolProfile, SchoolAgenda } from '../types';

const BASE_URL = 'http://localhost:5000/api';
let authToken: string | null = null;

// --- LOGIKA PERSISTENSI PROFIL (LocalStorage) ---

// Fungsi untuk mengambil data awal dari LocalStorage atau pakai Default
const getInitialProfile = (): SchoolProfile => {
    const savedData = localStorage.getItem('school_profile_data');
    if (savedData) {
        try {
            return JSON.parse(savedData);
        } catch (error) {
            console.error("Gagal parsing data profil dari localStorage", error);
        }
    }
    
    // Data Default jika belum ada yang disimpan
    return {
        name: 'SMP Aisyiyah Paccinongang',
        vision: 'Terwujudnya sekolah islami yang unggul...',
        mission: ['Mencerdaskan bangsa', 'Berakhlak mulia'],
        history: 'Sekolah ini berdiri sejak...',
        address: 'Jl. H.M. Yasin Limpo No. 25',
        phone: '(0411) 123-4567',
        email: 'info@smp.sch.id',
    };
};

// Inisialisasi mockProfile dari LocalStorage
let mockProfile: SchoolProfile = getInitialProfile();

// --- API SERVICES ---
export const api = {
    setAuthToken: (token: string | null) => { authToken = token; },

    // 1. LOGIN & RESET
    login: async (username: string, password: string) => {
        const res = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if(!res.ok) throw new Error(data.message);
        if(data.token) authToken = data.token;
        return data;
    },

    resetPassword: async (username: string, newPassword: string, secretKey: string) => {
        const res = await fetch(`${BASE_URL}/reset-password`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username, newPassword, secretKey })
        });
        return res.json();
    },

    // 2. BERITA
    getNews: async (publishedOnly = false) => {
        try {
            const res = await fetch(`${BASE_URL}/berita`);
            const data = await res.json();
            return data.map((item: any) => ({
                id: item.id,
                title: item.judul,
                content: item.isi,
                imageUrl: item.gambar,
                status: 'published',
                createdAt: item.tanggal
            }));
        } catch (e) { return []; }
    },

    addNews: async (data: any) => {
        if (data instanceof FormData) {
            const res = await fetch(`${BASE_URL}/berita`, {
                method: 'POST',
                body: data 
            });
            return res.json();
        } else {
            const res = await fetch(`${BASE_URL}/berita`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ judul: data.title, isi: data.content, gambar: data.imageUrl })
            });
            return res.json();
        }
    },
    
    deleteNews: async (id: number) => {
        await fetch(`${BASE_URL}/berita/${id}`, { method: 'DELETE' });
    },
    
    updateNews: async (article: any) => article, 
    getNewsById: async (id: number) => {
        const all = await api.getNews();
        return all.find((n: any) => n.id === id);
    },

    // 3. AKADEMIK
    getAcademicInfo: async () => {
        try {
            const res = await fetch(`${BASE_URL}/akademik`);
            const data = await res.json();
            return data.map((item: any) => ({
                id: item.id,
                title: item.judul,
                description: item.deskripsi,
                date: item.tanggal,
                type: item.jenis
            }));
        } catch (e) { return []; }
    },

    addAcademicInfo: async (info: any) => {
        const res = await fetch(`${BASE_URL}/akademik`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(info)
        });
        return res.json();
    },

    deleteAcademicInfo: async (id: number) => {
        await fetch(`${BASE_URL}/akademik/${id}`, { method: 'DELETE' });
    },
    
    updateAcademicInfo: async (info: any) => info,

    // 4. GALERI
    getGallery: async () => {
        try {
            const res = await fetch(`${BASE_URL}/galeri`);
            const data = await res.json();
            return data.map((item: any) => ({
                id: item.id,
                title: item.deskripsi,
                imageUrl: item.url_gambar,
                category: item.kategori,
                createdAt: item.tanggal
            }));
        } catch (e) { return []; }
    },
    
    addGalleryPhoto: async (formData: any) => { 
         const res = await fetch(`${BASE_URL}/galeri`, {
            method: 'POST',
            body: formData 
        });
        return res.json();
    },

    deleteGalleryPhoto: async (id: number) => {
        await fetch(`${BASE_URL}/galeri/${id}`, { method: 'DELETE' });
    },

    // 5. AGENDA
    getAgenda: async () => {
        try {
            const res = await fetch(`${BASE_URL}/akademik`);
            const data = await res.json();
            return data.slice(0, 3).map((item: any) => ({
                id: item.id,
                event: item.judul,
                date: item.tanggal
            }));
        } catch (e) { return []; }
    },

    // --- PERBAIKAN PROFIL (Sekarang Menggunakan LocalStorage) ---
    getProfile: () => {
        // Mengembalikan data terbaru yang ada di memori (yang sudah di-sync dengan localstorage)
        return Promise.resolve({ ...mockProfile });
    },

    updateProfile: (p: SchoolProfile) => {
        // Simpan ke variabel lokal (RAM)
        mockProfile = p; 
        
        // Simpan secara permanen ke Browser (LocalStorage)
        localStorage.setItem('school_profile_data', JSON.stringify(p));
        
        return Promise.resolve();
    },
};