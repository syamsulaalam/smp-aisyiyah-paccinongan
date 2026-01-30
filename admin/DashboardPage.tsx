import React, { useEffect, useState } from 'react';

const DashboardPage: React.FC = () => {
    // State untuk menyimpan angka-angka
    const [stats, setStats] = useState({
        berita: 0,
        akademik: 0,
        galeri: 0,
        pengunjung: 0
    });

    // Ambil data saat halaman dibuka
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/dashboard-stats`);
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Gagal mengambil data dashboard", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-600 mb-8">Selamat datang di panel admin SMP Aisyiyah Paccinongang.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* KARTU BERITA */}
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Total Berita</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.berita}</p>
                </div>

                {/* KARTU AKADEMIK */}
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Info Akademik</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.akademik}</p>
                </div>

                {/* KARTU GALERI */}
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Foto Galeri</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.galeri}</p>
                </div>

                {/* KARTU PENGUNJUNG */}
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Pengunjung Web</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{stats.pengunjung.toLocaleString()}</p>
                </div>

            </div>
        </div>
    );
};

export default DashboardPage;