import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold">SMP Aisyiyah Paccinongang</h3>
                        <p className="mt-2 text-gray-400">Alamat: Paccinongang No.110B, Kec. Somba Opu, Kabupaten Gowa, Sulawesi Selatan 92113</p>
                        <p className="mt-2 text-gray-400 break-all">Email: aisyiyah_paccinongang@gmail.com</p>
                        <p className="mt-2 text-gray-400">Telepon: (0411) 123-4567</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Tautan Cepat</h3>
                        <ul className="mt-4 space-y-2">
                            <li><NavLink to="/profil" className="text-gray-400 hover:text-white">Profil Sekolah</NavLink></li>
                            <li><NavLink to="/berita" className="text-gray-400 hover:text-white">Berita Terbaru</NavLink></li>
                            <li><NavLink to="/akademik" className="text-gray-400 hover:text-white">Informasi Akademik</NavLink></li>
                            <li><NavLink to="/galeri" className="text-gray-400 hover:text-white">Galeri</NavLink></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Penerimaan Siswa</h3>
                         <ul className="mt-4 space-y-2">
                             <li><a href="#" className="text-gray-400 hover:text-white">Informasi PPDB</a></li>
                             <li><a href="#" className="text-gray-400 hover:text-white">Brosur Sekolah</a></li>
                             <li><a href="#" className="text-gray-400 hover:text-white">Alur Pendaftaran</a></li>
                         </ul>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold">Sosial Media</h3>
                        <div className="flex mt-4 space-x-4">
                            <a href="https://web.facebook.com/profile.php?id=100081436210057&locale=id_ID" className="text-gray-400 hover:text-white">
                                <span className="sr-only">Facebook</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                            </a>
                            <a href="https://www.instagram.com/smpaisyiyahpaccinongang/" className="text-gray-400 hover:text-white">
                                <span className="sr-only">Instagram</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 2.525c.636-.247 1.363-.416 2.427-.465C9.795 2.013 10.149 2 12.315 2zm-1.161 1.545c-2.324 0-2.62.01-3.565.052-1.003.045-1.54.2-1.895.357-.525.235-.91.53-1.305.925-.395.395-.69.78-1.01 1.305-.157.355-.312.892-.357 1.895-.043.945-.052 1.24-.052 3.565s.01 2.62.052 3.565c.045 1.003.2 1.54.357 1.895.235.525.53.91.925 1.305.395.395.78.69 1.305 1.01.355.157.892.312 1.895.357.945.043 1.24.052 3.565.052s2.62-.01 3.565-.052c1.003-.045 1.54-.2 1.895-.357.525-.235.91-.53 1.305-.925.395-.395.69-.78 1.01-1.305.157-.355.312-.892-.357-1.895.043-.945.052-1.24.052-3.565s-.01-2.62-.052-3.565c-.045-1.003-.2-1.54-.357-1.895-.235-.525-.53-.91-.925-1.305-.395-.395-.78-.69-1.305-1.01-.355-.157-.892-.312-1.895-.357-.945-.043-1.24-.052-3.565-.052z" clipRule="evenodd" /><path d="M12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zM12 14a2 2 0 110-4 2 2 0 010 4zm6.36-8.36a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z" /></svg>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} SMP Aisyiyah Paccinongang. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;