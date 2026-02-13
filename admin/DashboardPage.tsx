import React, { useEffect, useState } from "react";

const DashboardPage: React.FC = () => {
  // State untuk menyimpan angka-angka
  const [stats, setStats] = useState({
    berita: 0,
    akademik: 0,
    galeri: 0,
    pengunjung: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ambil data saat halaman dibuka
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

        const response = await fetch(`${apiUrl}/api/dashboard-stats`);

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        setStats(data);
        setError(null);
      } catch (error: any) {
        console.error("Gagal mengambil data dashboard:", error);
        setError(error.message || "Gagal memuat data dashboard. Pastikan backend berjalan.");
      } finally {
        setLoading(false);
      }
    };

    // Fetch pertama kali
    fetchStats();

    // Auto-refresh setiap 3 detik untuk menampilkan pengunjung terbaru
    const interval = setInterval(() => {
      fetchStats();
    }, 3000);

    // Cleanup interval saat component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">Selamat datang di panel admin SMP Aisyiyah Paccinongang.</p>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-bold">⚠️ Error:</p>
          <p>{error}</p>
          <p className="text-sm mt-2">Pastikan backend sudah berjalan di port 5000</p>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg">
          <p>⏳ Memuat data...</p>
        </div>
      )}

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
