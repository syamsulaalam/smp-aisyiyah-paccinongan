import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';

const LoginPage: React.FC = () => {
    // --- 1. DEKLARASI VARIABEL (PENTING) ---
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('admin123');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const { login } = useAuth();

    // --- 2. FUNGSI LOGIN (TOMBOL ENTER / KLIK LOGIN) ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Mencegah reload halaman
        
        setLoading(true);
        setError('');

        try {
            if (!username || !password) {
                throw new Error("Username dan Password tidak boleh kosong.");
            }

            console.log("Mengirim data login...");
            const response = await api.login(username, password);
            
            console.log("Login Sukses");
            login(response.token);
            navigate('/admin/dashboard');

        } catch (err: any) {
            console.error("Login Gagal:", err);
            
            let pesan = "Login gagal. Cek koneksi atau password Anda.";
            if (typeof err === 'string') pesan = err;
            else if (err?.response?.data?.message) pesan = err.response.data.message;
            else if (err?.message) pesan = err.message;

            setError(pesan);
        } finally {
            setLoading(false);
        }
    };

    // --- 3. FUNGSI LUPA PASSWORD (HUBUNGI TIM IT) ---
    // --- 3. FUNGSI LUPA PASSWORD (WHATSAPP OTOMATIS) ---
    const handleForgotPassword = (e: React.MouseEvent) => {
        e.preventDefault();
        
        // 1. Masukkan Nomor HP Admin (Ganti dengan nomor HP Anda / Tim IT)
        // Format harus pakai kode negara (62), jangan pakai 08...
        const nomorAdmin = "6281333134416"; // <-- GANTI INI
        
        // 2. Pesan otomatis yang akan muncul
        const pesan = "Halo Admin Tim IT, saya lupa password untuk login ke Website Sekolah. Mohon bantuannya untuk reset password. Terima kasih.";
        
        // 3. Buat Link WhatsApp
        const linkWA = `https://wa.me/${nomorAdmin}?text=${encodeURIComponent(pesan)}`;
        
        // 4. Buka di tab baru
        window.open(linkWA, "_blank");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Admin Panel
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    SMP Aisyiyah Paccinongang
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* INPUT USERNAME */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <div className="mt-1">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* INPUT PASSWORD */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* TOMBOL LUPA PASSWORD (ALERT IT) */}
                        <div className="flex items-center justify-end">
                            <button
                                type="button" // PENTING: type="button" agar tidak dianggap submit login
                                onClick={handleForgotPassword}
                                className="text-sm font-medium text-blue-600 hover:text-blue-500 bg-transparent border-none cursor-pointer"
                            >
                                Lupa password?
                            </button>
                        </div>

                        {/* PESAN ERROR MERAH */}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                            </div>
                        )}

                        {/* TOMBOL SUBMIT (LOGIN) */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                            >
                                {loading ? 'Memuat...' : 'Masuk'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <Link to="/" className="text-sm text-gray-500 hover:text-blue-600">
                            ← Kembali ke Website Utama
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LoginPage;