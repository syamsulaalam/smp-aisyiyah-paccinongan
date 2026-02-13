import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../services/api';

const ProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data: any = await api.getProfile();
                
                // Helper untuk parsing array (Misi & Tujuan)
                const parseToArray = (field: any) => {
                    if (Array.isArray(field)) return field;
                    if (typeof field === 'string') return field.split('\n').filter(i => i.trim() !== '');
                    return [];
                };

                const cleanData = {
                    ...data,
                    name: data.nama_sekolah || 'SMP AISYIYAH PACCINONGANG',
                    mission: parseToArray(data.misi),
                    goals: parseToArray(data.tujuan), // Tambahkan field tujuan
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

    if (loading) return <Layout><div className="text-center p-20">Memuat Profil...</div></Layout>;

    return (
        <Layout>
            <div className="bg-blue-50 min-h-screen py-10 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Container Utama dengan Border Biru seperti di Foto */}
                    <div className="bg-white border-4 border-blue-800 rounded-lg shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-blue-800">
                        
                        {/* KOLOM 1: PROFIL SEKOLAH */}
                        <div className="p-6">
                            <h2 className="bg-blue-800 text-white text-center py-2 rounded-t-lg font-bold text-xl mb-4">PROFIL SEKOLAH</h2>
                            <div className="space-y-2 text-sm">
                                <DetailRow label="Nama Sekolah" value={profile.name} />
                                <DetailRow label="NSS" value={profile.nss || '40314307'} />
                                <DetailRow label="Alamat" value={profile.alamat || 'Jl. Manggarupi No.110 B'} />
                                <DetailRow label="No. Telp" value={profile.no_telp || '0813 5495 3857'} />
                                <DetailRow label="Nama Yayasan" value={profile.yayasan || 'Perguruan Aisyiyah'} />
                                <DetailRow label="Kepala Sekolah" value={profile.kepala_sekolah || 'Hj. Yulidah Djalaluddin, S.Pd'} />
                                <DetailRow label="Kategori" value={profile.status_sekolah || 'Swasta'} />
                                <DetailRow label="Akreditasi" value={profile.akreditasi || 'B'} />
                                <hr className="my-2 border-blue-200" />
                                <DetailRow label="Jumlah Siswa" value={`${profile.jumlah_siswa || '152'} Orang`} />
                                <DetailRow label="Jumlah Guru" value={`${profile.jumlah_guru || '-'} Orang`} />
                                <DetailRow label="Jumlah Rombel" value={`${profile.rombel || '7'} Rombel`} />
                            </div>
                        </div>

                        {/* KOLOM 2: VISI & MISI */}
                        <div className="p-6 bg-gray-50">
                            <h2 className="bg-blue-800 text-white text-center py-2 rounded-t-lg font-bold text-xl mb-4">VISI</h2>
                            <p className="text-center italic text-gray-700 mb-8 px-4">"{profile.visi}"</p>
                            
                            <h2 className="bg-blue-800 text-white text-center py-2 rounded-t-lg font-bold text-xl mb-4">MISI</h2>
                            <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
                                {profile.mission.map((m: string, i: number) => (
                                    <li key={i}>{m}</li>
                                ))}
                            </ol>
                        </div>

                        {/* KOLOM 3: TUJUAN */}
                        <div className="p-6">
                            <h2 className="bg-blue-800 text-white text-center py-2 rounded-t-lg font-bold text-xl mb-4">TUJUAN</h2>
                            <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
                                {profile.goals && profile.goals.length > 0 ? (
                                    profile.goals.map((g: string, i: number) => <li key={i}>{g}</li>)
                                ) : (
                                    <p className="text-gray-400 italic">Data tujuan belum diisi.</p>
                                )}
                            </ol>
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
};

// Komponen Kecil untuk Baris Detail
const DetailRow = ({ label, value }: { label: string, value: string }) => (
    <div className="flex flex-col mb-1">
        <span className="font-bold text-blue-900 w-full">{label}</span>
        <span className="text-gray-700">: {value}</span>
    </div>
);

export default ProfilePage;