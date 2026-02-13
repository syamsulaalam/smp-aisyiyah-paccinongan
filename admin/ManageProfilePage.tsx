import React, { useEffect, useState } from "react";
import { api } from "../services/api";

const ManageProfilePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. STATE FORM: Mencakup semua field dari gambar profil
  const [formData, setFormData] = useState({
    nama_sekolah: "",
    nss: "",
    npsn: "",
    alamat: "",
    no_telp: "",
    yayasan: "",
    kepala_sekolah: "",
    status_sekolah: "Swasta",
    akreditasi: "",
    jumlah_siswa: 0,
    jumlah_guru: 0,
    rombel: 0,
    visi: "",
    misi: "", // Akan dikelola sebagai string multiline (textarea)
    tujuan: "", // Akan dikelola sebagai string multiline (textarea)
  });

  // 2. AMBIL DATA DARI BACKEND
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data: any = await api.getProfile();

        // Helper: Mengubah Array dari DB menjadi String baris baru agar bisa diedit di Textarea
        const toMultiline = (val: any) => (Array.isArray(val) ? val.join("\n") : val || "");

        setFormData({
          nama_sekolah: data.nama_sekolah || data.name || "",
          nss: data.nss || "",
          npsn: data.npsn || "",
          alamat: data.alamat || "",
          no_telp: data.no_telp || "",
          yayasan: data.yayasan || "",
          kepala_sekolah: data.kepala_sekolah || "",
          status_sekolah: data.status_sekolah || "Swasta",
          akreditasi: data.akreditasi || "",
          jumlah_siswa: parseInt(data.jumlah_siswa) || 0,
          jumlah_guru: parseInt(data.jumlah_guru) || 0,
          rombel: parseInt(data.rombel) || 0,
          visi: data.visi || "",
          misi: toMultiline(data.misi),
          tujuan: toMultiline(data.tujuan),
        });
      } catch (error) {
        console.error("Gagal mengambil data profil", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Convert numeric fields
    let finalValue: any = value;
    if (["jumlah_siswa", "jumlah_guru", "rombel"].includes(name)) {
      finalValue = value === "" ? 0 : parseInt(value) || 0;
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  // 3. SIMPAN DATA KE BACKEND
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Ubah string textarea kembali menjadi Array sebelum dikirim ke Database
      const payload = {
        ...formData,
        misi: formData.misi.split("\n").filter((line) => line.trim() !== ""),
        tujuan: formData.tujuan.split("\n").filter((line) => line.trim() !== ""),
      };

      console.log("📤 Mengirim data ke backend:", payload); // DEBUG

      const response = await api.updateProfile(payload);
      console.log("✅ Response dari backend:", response); // DEBUG

      alert("✅ Profil sekolah berhasil diperbarui!");
    } catch (error: any) {
      console.error("❌ Error saat update profil:", error);

      // Tampilkan error detail
      let errorMsg = "❌ Gagal memperbarui profil.";
      if (error.response?.data?.error) {
        errorMsg += `\n\nError: ${error.response.data.error}`;
      } else if (error.response?.data?.message) {
        errorMsg += `\n\n${error.response.data.message}`;
      } else if (error.message) {
        errorMsg += `\n\n${error.message}`;
      }

      alert(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Memuat data form...</div>;

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden m-4">
      <div className="bg-blue-800 p-4 text-white">
        <h1 className="text-xl font-bold">Panel Editor Profil Sekolah</h1>
        <p className="text-sm opacity-80">Sesuaikan informasi yang tampil pada papan informasi profil.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* SEKSI 1: IDENTITAS DASAR */}
        <section>
          <h3 className="text-lg font-bold text-blue-800 border-b-2 border-blue-100 mb-4 pb-1">1. Profil & Kontak</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputGroup label="Nama Sekolah" name="nama_sekolah" value={formData.nama_sekolah} onChange={handleChange} />
            <InputGroup label="NSS" name="nss" value={formData.nss} onChange={handleChange} />
            <InputGroup label="NPSN" name="npsn" value={formData.npsn} onChange={handleChange} />
            <InputGroup label="Alamat Lengkap" name="alamat" value={formData.alamat} onChange={handleChange} />
            <InputGroup label="No. Telepon" name="no_telp" value={formData.no_telp} onChange={handleChange} />
            <InputGroup label="Nama Yayasan" name="yayasan" value={formData.yayasan} onChange={handleChange} />
            <InputGroup label="Kepala Sekolah" name="kepala_sekolah" value={formData.kepala_sekolah} onChange={handleChange} />
            <InputGroup label="Akreditasi" name="akreditasi" value={formData.akreditasi} onChange={handleChange} />
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
              <select name="status_sekolah" value={formData.status_sekolah} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="Swasta">Swasta</option>
                <option value="Negeri">Negeri</option>
              </select>
            </div>
          </div>
        </section>

        {/* SEKSI 2: STATISTIK */}
        <section className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-blue-800 mb-4">2. Data Statistik</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputGroup label="Jumlah Siswa" name="jumlah_siswa" value={formData.jumlah_siswa} onChange={handleChange} placeholder="Contoh: 152" />
            <InputGroup label="Jumlah Guru" name="jumlah_guru" value={formData.jumlah_guru} onChange={handleChange} placeholder="Contoh: 20" />
            <InputGroup label="Jumlah Rombel" name="rombel" value={formData.rombel} onChange={handleChange} placeholder="Contoh: 7" />
          </div>
        </section>

        {/* SEKSI 3: VISI, MISI & TUJUAN */}
        <section>
          <h3 className="text-lg font-bold text-blue-800 border-b-2 border-blue-100 mb-4 pb-1">3. Visi, Misi & Tujuan</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Visi Sekolah</label>
              <textarea name="visi" value={formData.visi} onChange={handleChange} rows={2} className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Misi (Satu per baris)</label>
                <textarea
                  name="misi"
                  value={formData.misi}
                  onChange={handleChange}
                  rows={6}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                  placeholder="Contoh:&#10;Misi Pertama&#10;Misi Kedua"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tujuan (Satu per baris)</label>
                <textarea
                  name="tujuan"
                  value={formData.tujuan}
                  onChange={handleChange}
                  rows={6}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                  placeholder="Contoh:&#10;Tujuan Pertama&#10;Tujuan Kedua"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 italic">*Gunakan tombol Enter untuk menambah baris poin baru pada Misi dan Tujuan.</p>
          </div>
        </section>

        <div className="flex justify-end pt-6">
          <button type="submit" disabled={saving} className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-10 rounded-lg shadow-md transition-all disabled:opacity-50">
            {saving ? "⏳ Menyimpan..." : "💾 Simpan Perubahan Profil"}
          </button>
        </div>
      </form>
    </div>
  );
};

// Sub-Komponen Input agar kode lebih rapi
const InputGroup = ({ label, name, value, onChange, placeholder }: any) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <input type="text" name={name} value={value} onChange={onChange} placeholder={placeholder} className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
  </div>
);

export default ManageProfilePage;
