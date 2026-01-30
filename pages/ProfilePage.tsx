import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../services/api';

const ProfilePage: React.FC = () => {
    // Gunakan 'any' agar tidak error TypeScript saat mapping data
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Tambahkan ': any' di sini untuk mematikan error merah TypeScript
                const data: any = await api.getProfile();
                
                // LOGIKA MISI (PENTING):
                // Database menyimpan misi sebagai String JSON: '["Misi A", "Misi B"]'
                // Kita harus ubah menjadi Array sungguhan agar bisa di-Looping (.map)
                let missionArray = [];
                try {
                    if (Array.isArray(data.misi)) {
                        missionArray = data.misi;
                    } else if (typeof data.misi === 'string') {
                        // Coba parse JSON (jika formatnya ["..", ".."])
                        if (data.misi.startsWith('[')) {
                            missionArray = JSON.parse(data.misi);
                        } else {
                            // Jika string biasa dipisah enter, kita split
                            missionArray = data.misi.split('\n').filter((item: string) => item.trim() !== '');
                        }
                    } else if (Array.isArray(data.mission)) {
                        missionArray = data.mission;
                    }
                } catch (e) {
                    console.error("Gagal parsing misi", e);
                    missionArray = [];
                }

                // MAPPING DATA (Backend Indo -> Frontend Tampilan)
                const cleanData = {
                    name: data.nama_sekolah || data.name || 'Nama Sekolah Belum Diisi',
                    status: data.status_sekolah || data.status || '-',
                    npsn: data.npsn || '-',
                    accreditation: data.akreditasi || data.accreditation || '-',
                    province: data.provinsi || data.province || '-',
                    city: data.kota || data.city || '-',
                    postalCode: data.kode_pos || data.postalCode || '-',
                    vision: data.visi || data.vision || 'Belum ada visi.',
                    mission: missionArray // Pastikan ini Array!
                };

                setProfile(cleanData);
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return <Layout><div className="text-center p-20 text-gray-500">Memuat Profil...</div></Layout>;
    }

    if (!profile) {
        return <Layout><div className="text-center p-20 text-red-500">Gagal memuat profil sekolah.</div></Layout>;
    }

    return (
        <Layout>
            <div className="bg-gray-100 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto space-y-6">
                    
                    {/* Header Card */}
                    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4 border-l-4 border-blue-600">
                        <div className="bg-blue-600 p-3 rounded-lg">
                             <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Profil Sekolah</h1>
                        </div>
                    </div>

                    {/* Main Data Card */}
                    <div className="bg-white rounded-xl shadow-sm p-8">
                         <div className="flex items-center space-x-2 mb-6">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            <h2 className="text-xl font-bold text-gray-800">Data Sekolah</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                            {/* Left Column */}
                            <div className="space-y-6">
                                <div className="border-l-4 border-blue-600 pl-3">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nama</p>
                                    <p className="text-gray-800 font-medium">{profile.name}</p>
                                </div>
                                 <div className="border-l-4 border-blue-600 pl-3">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</p>
                                    <p className="text-gray-800 font-medium">{profile.status}</p>
                                </div>
                                 <div className="border-l-4 border-blue-600 pl-3">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Provinsi</p>
                                    <p className="text-gray-800 font-medium">{profile.province}</p>
                                </div>
                               <div className="border-l-4 border-blue-600 pl-3">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kode Pos</p>
                                    <p className="text-gray-800 font-medium">{profile.postalCode}</p>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                <div className="border-l-4 border-blue-600 pl-3">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">NPSN</p>
                                    <p className="text-gray-800 font-medium">{profile.npsn}</p>
                                </div>
                                <div className="border-l-4 border-blue-600 pl-3">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Akreditasi</p>
                                    <p className="text-gray-800 font-medium">{profile.accreditation}</p>
                                </div>
                                <div className="border-l-4 border-blue-600 pl-3">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kota/Kabupaten</p>
                                    <p className="text-gray-800 font-medium">{profile.city}</p>
                                </div>
                            </div>
                        </div>

                        {/* Visi & Misi Section */}
                        <div className="mt-10 pt-8 border-t border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                Visi
                            </h3>
                            <p className="text-gray-600 italic mb-8 pl-7">"{profile.vision}"</p>

                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Misi
                            </h3>
                            <ul className="space-y-2 pl-7">
                                {/* PENTING: Pengecekan agar tidak error .map of undefined */}
                                {Array.isArray(profile.mission) && profile.mission.length > 0 ? (
                                    profile.mission.map((item: string, index: number) => (
                                        <li key={index} className="flex items-start text-gray-600">
                                            <span className="mr-2 text-blue-600">•</span>
                                            {item}
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-gray-400 italic">Belum ada data misi.</p>
                                )}
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProfilePage;