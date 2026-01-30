import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../services/api';
import { AcademicInfo } from '../types';

const AcademicPage: React.FC = () => {
    const [academicInfo, setAcademicInfo] = useState<AcademicInfo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAcademicInfo = async () => {
            try {
                const data = await api.getAcademicInfo();
                setAcademicInfo(data);
            } catch (error)
 {
                console.error("Failed to fetch academic info", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAcademicInfo();
    }, []);

    const getIconForType = (type: AcademicInfo['type']) => {
        switch (type) {
            case 'Pengumuman': return '📢';
            case 'Jadwal Ujian': return '🗓️';
            case 'Kalender Akademik': return '📅';
            case 'PPDB': return '📝';
            default: return 'ℹ️';
        }
    }

    return (
        <Layout>
            <div className="bg-blue-900">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">Informasi Akademik</h1>
                    <p className="mt-4 text-xl text-blue-100">Semua informasi penting terkait kegiatan akademik.</p>
                </div>
            </div>
            <div className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <p className="text-center">Loading...</p>
                    ) : (
                        <div className="space-y-8">
                            {academicInfo.map((info) => (
                                <div key={info.id} className="bg-white shadow-md rounded-lg p-6 border-l-4 border-blue-500">
                                    <div className="flex items-center mb-4">
                                        <div className="text-3xl mr-4">{getIconForType(info.type)}</div>
                                        <div>
                                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                                {info.type}
                                            </span>
                                            <h2 className="text-2xl font-bold text-gray-800 mt-1">{info.title}</h2>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-4">{info.description}</p>
                                    <p className="text-sm text-gray-500 font-medium">
                                        Tanggal: {new Date(info.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default AcademicPage;