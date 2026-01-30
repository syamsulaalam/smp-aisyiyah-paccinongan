import React, { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { api } from '../services/api';
import { AcademicInfo } from '../types';

const emptyInfo: Omit<AcademicInfo, 'id'> = {
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Pengumuman',
};

const AcademicFormModal: React.FC<{
    info: AcademicInfo | Omit<AcademicInfo, 'id'> | null;
    onClose: () => void;
    onSave: () => void;
}> = ({ info, onClose, onSave }) => {
    const [formData, setFormData] = useState(info || emptyInfo);
    const [isSaving, setIsSaving] = useState(false);

    const isEditMode = 'id' in (info || {});

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (isEditMode) {
                await api.updateAcademicInfo(formData as AcademicInfo);
            } else {
                await api.addAcademicInfo(formData as Omit<AcademicInfo, 'id'>);
            }
            onSave();
        } catch (error) {
            console.error('Failed to save academic info', error);
            alert('Gagal menyimpan info akademik.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-full overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">{isEditMode ? 'Edit Info Akademik' : 'Tambah Info Baru'}</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Judul</label>
                                <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi</label>
                                <textarea name="description" id="description" value={formData.description} onChange={handleChange} required rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Tanggal</label>
                                    <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipe</label>
                                    <select name="type" id="type" value={formData.type} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                        <option value="Pengumuman">Pengumuman</option>
                                        <option value="Jadwal Ujian">Jadwal Ujian</option>
                                        <option value="Kalender Akademik">Kalender Akademik</option>
                                        <option value="PPDB">PPDB</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Batal</button>
                        <button type="submit" disabled={isSaving} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">{isSaving ? 'Menyimpan...' : 'Simpan'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ManageAcademicPage: React.FC = () => {
    const [academicInfo, setAcademicInfo] = useState<AcademicInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingInfo, setEditingInfo] = useState<AcademicInfo | null>(null);

    const fetchInfo = async () => {
        setLoading(true);
        try {
            const data = await api.getAcademicInfo();
            setAcademicInfo(data);
        } catch (error) {
            console.error('Failed to fetch academic info:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInfo();
    }, []);

    const handleAddNew = () => {
        setEditingInfo(null);
        setIsModalOpen(true);
    };

    const handleEdit = (info: AcademicInfo) => {
        setEditingInfo(info);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus informasi ini?')) {
            try {
                await api.deleteAcademicInfo(id);
                fetchInfo();
            } catch (error) {
                console.error('Failed to delete info:', error);
                alert('Gagal menghapus informasi.');
            }
        }
    };

    const handleSave = () => {
        setIsModalOpen(false);
        setEditingInfo(null);
        fetchInfo();
    };


    return (
        <div className="container mx-auto">
            {isModalOpen && (
                <AcademicFormModal
                    info={editingInfo || emptyInfo}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Manajemen Info Akademik</h1>
                <button onClick={handleAddNew} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Tambah Info Baru
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Judul</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tipe</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tanggal</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} className="text-center py-4">Loading...</td></tr>
                        ) : (
                            academicInfo.map(info => (
                                <tr key={info.id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{info.title}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{info.type}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{new Date(info.date).toLocaleDateString('id-ID')}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <button onClick={() => handleEdit(info)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                        <button onClick={() => handleDelete(info.id)} className="text-red-600 hover:text-red-900">Hapus</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageAcademicPage;