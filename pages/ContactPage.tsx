import React from 'react';
import Layout from '../components/Layout';

const ContactPage: React.FC = () => {
  
  // --- BAGIAN INI BISA ANDA UBAH SESUAI KEINGINAN ---
  const contactInfo = {
    address: "Paccinongang No.110B, Kec. Somba Opu, Kabupaten Gowa, Sulawesi Selatan 92113",
    phone: "082192083957",
    email: "aisyiyah_paccinongang@yahoo.com",
    // Cara dapat link peta: Buka Google Maps -> Cari lokasi -> Klik Share -> Embed a map -> Copy link di dalam src="..."
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3456.0508538582276!2d119.46878969999997!3d-5.1958918!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbee3ca6d54492d%3A0x6b890f553da8defa!2sSMP%20Aisyiah%20Paccinongang!5e1!3m2!1sid!2sid!4v1769442958898!5m2!1sid!2sid"
  };
  // ---------------------------------------------------

  return (
    <Layout>
      {/* Header */}
      <div className="bg-blue-900 text-white py-16 text-center">
        <h1 className="text-4xl font-extrabold">Hubungi Kami</h1>
        <p className="mt-4 text-xl text-blue-200">
          Kami siap melayani informasi seputar sekolah.
        </p>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Informasi Kontak */}
          <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-blue-600">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Informasi Kontak</h2>
            <div className="space-y-8">
              
              {/* Alamat */}
              <div className="flex items-start">
                <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-bold text-gray-900">Alamat Sekolah</h3>
                  <p className="mt-2 text-gray-600 leading-relaxed">{contactInfo.address}</p>
                </div>
              </div>

              {/* Telepon */}
              <div className="flex items-start">
                <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-bold text-gray-900">Telepon</h3>
                  <p className="mt-2 text-gray-600">{contactInfo.phone}</p>
                </div>
              </div>

              {/* Email */}
              {/* Email */}
              <div className="flex items-start">
                <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                {/* Tambahkan overflow-hidden pada div pembungkus untuk keamanan layout */}
                <div className="ml-5 overflow-hidden w-full"> 
                  <h3 className="text-lg font-bold text-gray-900">Email</h3>
                  
                  {/* PERBAIKAN: Tambahkan 'break-all' di sini, bukan di h3 */}
                  <p className="mt-2 text-gray-600 break-all">
                    {contactInfo.email}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Peta Google Maps */}
          <div className="bg-gray-200 rounded-xl shadow-lg overflow-hidden h-96 md:h-auto border border-gray-300">
             <iframe 
               title="Peta Lokasi Sekolah"
               src={contactInfo.mapEmbedUrl}
               width="100%" 
               height="100%" 
               style={{border:0, minHeight: '400px'}} 
               allowFullScreen 
               loading="lazy"
               referrerPolicy="no-referrer-when-downgrade">
             </iframe>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;