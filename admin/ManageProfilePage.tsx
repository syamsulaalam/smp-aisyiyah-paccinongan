import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

const ManageProfilePage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // STATE FORM: Menggunakan nama field sesuai DATABASE
    const [formData, setFormData] = useState({
        nama_sekolah: '',
        npsn: '',
        status_sekolah: 'Swasta',
        akreditasi: '',
        provinsi: '',
        kota: '',
        kode_pos: '',
        // Field website SUDAH DIHAPUS
        visi: '',
        misi: '',
    });

    // 1. AMBIL DATA SAAT HALAMAN DIBUKA
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // --- PERBAIKAN UTAMA DI SINI ---
                // Tambahkan ': any' agar TypeScript tidak protes soal nama field
                const data: any = await api.getProfile();
                
                // LOGIKA MISI: Cek apakah Array atau String
                let misiString = '';
                if (Array.isArray(data.misi)) {
                    misiString = data.misi.join('\n');
                } else if (Array.isArray(data.mission)) {
                    misiString = data.mission.join('\n');
                } else {
                    misiString = data.misi || data.mission || '';
                }

                // MAPPING DATA KE FORM
                // Sekarang tidak akan ada garis merah karena 'data' dianggap 'any'
                setFormData({
                    nama_sekolah: data.nama_sekolah || data.name || '',
                    npsn: data.npsn || '',
                    status_sekolah: data.status_sekolah || data.status || 'Swasta',
                    akreditasi: data.akreditasi || data.accreditation || '',
                    provinsi: data.provinsi || data.province || '',
                    kota: data.kota || data.city || '',
                    kode_pos: data.kode_pos || data.postalCode || '',
                    visi: data.visi || data.vision || '',
                    misi: misiString
                });

            } catch (error) {
                console.error("Gagal ambil profil", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // 2. HANDLE KETIK
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 3. HANDLE SIMPAN
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Ubah Misi dari String (Textarea) menjadi Array untuk Database
            const misiArray = formData.misi.split('\n').filter(line => line.trim() !== '');

            const payload = {
                ...formData,
                misi: misiArray 
            };

            console.log("📤 Mengirim Data:", payload);
            await api.updateProfile(payload);
            
            alert('✅ Profil berhasil diperbarui!');
        } catch (error) {
            console.error(error);
            alert('❌ Gagal memperbarui profil.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="p-8 text-center">Memuat data...</p>;

    return (
        <div className="bg-white rounded-lg shadow-sm p-8 m-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-8 border-b pb-4">Edit Profil Sekolah</h1>
            
            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* 1. IDENTITAS SEKOLAH */}
                <div>
                    <h3 className="text-lg font-bold text-blue-800 mb-4 bg-blue-50 p-2 rounded">1. Identitas Sekolah</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="label-form">Nama Sekolah</label>
                            <input type="text" name="nama_sekolah" value={formData.nama_sekolah} onChange={handleChange} className="input-form" />
                        </div>
                        <div>
                            <label className="label-form">NPSN</label>
                            <input type="text" name="npsn" value={formData.npsn} onChange={handleChange} className="input-form" />
                        </div>
                        <div>
                            <label className="label-form">Status</label>
                            <select name="status_sekolah" value={formData.status_sekolah} onChange={handleChange} className="input-form">
                                <option value="Swasta">Swasta</option>
                                <option value="Negeri">Negeri</option>
                            </select>
                        </div>
                        <div>
                            <label className="label-form">Akreditasi</label>
                            <input type="text" name="akreditasi" value={formData.akreditasi} onChange={handleChange} className="input-form" />
                        </div>
                    </div>
                </div>

                {/* 2. WILAYAH & KONTAK */}
                <div>
                    <h3 className="text-lg font-bold text-blue-800 mb-4 bg-blue-50 p-2 rounded">2. Wilayah & Kontak</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="label-form">Provinsi</label>
                            <input type="text" name="provinsi" value={formData.provinsi} onChange={handleChange} className="input-form" />
                        </div>
                        <div>
                            <label className="label-form">Kota / Kabupaten</label>
                            <input type="text" name="kota" value={formData.kota} onChange={handleChange} className="input-form" />
                        </div>
                        <div>
                            <label className="label-form">Kode Pos</label>
                            <input type="text" name="kode_pos" value={formData.kode_pos} onChange={handleChange} className="input-form" />
                        </div>
                        {/* Field Website SUDAH DIHAPUS */}
                    </div>
                </div>

                {/* 3. VISI & MISI */}
                <div>
                    <h3 className="text-lg font-bold text-blue-800 mb-4 bg-blue-50 p-2 rounded">3. Visi & Misi</h3>
                    <div className="space-y-6">
                        <div>
                            <label className="label-form">Visi</label>
                            <textarea name="visi" value={formData.visi} onChange={handleChange} rows={3} className="input-form" />
                        </div>
                        <div>
                            <label className="label-form">Misi (Satu per baris)</label>
                            <textarea name="misi" value={formData.misi} onChange={handleChange} rows={8} className="input-form" placeholder="Contoh:&#10;Mencerdaskan bangsa&#10;Berakhlak mulia" />
                            <p className="text-xs text-gray-500 mt-1">*Tekan Enter untuk membuat poin misi baru.</p>
                        </div>
                    </div>
                </div>
                
                {/* TOMBOL SIMPAN */}
                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={saving} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                        {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </form>
            
            <style>{`
                .label-form { display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.5rem; }
                .input-form { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; outline: none; transition: border-color 0.2s; }
                .input-form:focus { border-color: #2563EB; ring: 2px solid #BFDBFE; }
            `}</style>
        </div>
    );
};

export default ManageProfilePage;