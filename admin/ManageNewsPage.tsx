import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import { api } from "../services/api";
import { NewsArticle } from "../types";
import { getInstagramEmbedUrl, isInstagramContentUrl } from "../utils/instagram";

const emptyArticle: Omit<NewsArticle, "id" | "createdAt"> = {
  title: "",
  content: "",
  imageUrl: "",
  status: "draft",
};

const placeholderImage = "/images/latarsekolah.webp";

const NewsFormModal: React.FC<{
  article: NewsArticle | Omit<NewsArticle, "id" | "createdAt"> | null;
  onClose: () => void;
  onSave: () => void;
}> = ({ article, onClose, onSave }) => {
  // State Data Form
  const [formData, setFormData] = useState(article || emptyArticle);
  const [isSaving, setIsSaving] = useState(false);

  // State Sumber Gambar & File Asli
  const [imageSource, setImageSource] = useState<"url" | "upload">("url");

  // State untuk Generate Berita
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const generateErrorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isEditMode = "id" in (article || {});

  useEffect(() => {
    const currentData = article || emptyArticle;
    setFormData(currentData);
    setIsGenerating(false);
    setGenerateError(null);
    if (generateErrorTimerRef.current) {
      clearTimeout(generateErrorTimerRef.current);
      generateErrorTimerRef.current = null;
    }
    // Cek apakah gambar saat ini URL biasa atau Base64/File
    if (isEditMode && currentData.imageUrl) {
      setImageSource(currentData.imageUrl.startsWith("http") ? "url" : "upload");
    } else {
      setImageSource("url"); // Default untuk berita baru
    }
  }, [article, isEditMode]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "title" && generateError) {
      setGenerateError(null);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    return () => {
      if (generateErrorTimerRef.current) {
        clearTimeout(generateErrorTimerRef.current);
      }
    };
  }, []);

  const showGenerateError = (message: string) => {
    if (generateErrorTimerRef.current) {
      clearTimeout(generateErrorTimerRef.current);
    }

    setGenerateError(message);
    generateErrorTimerRef.current = setTimeout(() => {
      setGenerateError(null);
      generateErrorTimerRef.current = null;
    }, 5000);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Buat Preview Gambar agar tampil di layar
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateBeritaByTitle = async (title: string) => {
    // Validasi judul
    if (!title || title.trim().length === 0) {
      showGenerateError("Silakan isi judul berita terlebih dahulu.");
      return;
    }

    setIsGenerating(true);
    setGenerateError(null);

    try {
      console.log("Memanggil API generate berita...");
      const response = await api.generateNews({ title: title.trim() });
      
      if (!response.content) {
        throw new Error("API tidak mengembalikan konten berita");
      }

      // Auto-fill content ke field "Isi Berita"
      setFormData((prev) => ({
        ...prev,
        content: response.content
      }));

      console.log("Berita berhasil di-generate!");
    } catch (error: any) {
      console.error("Error generate berita:", error);
      
      let errorMsg = "Gagal generate berita. Silakan coba lagi.";
      if (error.response?.status === 401) {
        errorMsg = "❌ API Key Grok tidak valid. Hubungi administrator.";
      } else if (error.response?.status === 400) {
        errorMsg = "❌ " + (error.response?.data?.message || "Input tidak valid");
      } else if (error.response?.status === 500) {
        errorMsg = "❌ Server error. Coba lagi nanti.";
      } else if (error.response?.data?.message) {
        errorMsg = "❌ " + error.response.data.message;
      } else if (error.message) {
        errorMsg = "❌ " + error.message;
      }

      showGenerateError(errorMsg);
    } finally {
      setIsGenerating(false);
    }
  };

  // --- BAGIAN PENTING: LOGIKA SIMPAN DIPERBAIKI ---
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Validasi
      if (!formData.title || !formData.content) {
        alert("Judul dan Isi Berita harus diisi!");
        setIsSaving(false);
        return;
      }

      if (isEditMode) {
        // UNTUK EDIT BERITA (PUT)
        const dataWithId = formData as NewsArticle;

        // ⭐ PENTING: Transform frontend format ke backend format
        const submitData = {
          judul: dataWithId.title, // title → judul
          isi: dataWithId.content, // content → isi
          gambar: dataWithId.imageUrl, // imageUrl → gambar (bisa URL atau Base64)
        };

        console.log(`Mengupdate berita dengan ID ${dataWithId.id}...`);
        console.log("Payload yang dikirim:", {
          judul: submitData.judul.substring(0, 30) + "...",
          isi: submitData.isi.substring(0, 30) + "...",
          gambarLength: submitData.gambar?.length || 0,
          gambarIsBase64: submitData.gambar?.startsWith("data:image") ? "Ya" : "URL",
        });

        const response = await api.updateNews(dataWithId.id, submitData);
        console.log("Response dari backend:", response);

        onSave();
        alert("Berita berhasil diupdate!");
      } else {
        // UNTUK TAMBAH BERITA BARU (POST)
        const submitData = {
          judul: formData.title,
          isi: formData.content,
          gambar: formData.imageUrl, // Bisa URL atau Base64
        };

        console.log("Mengirim berita baru ke backend...");
        console.log("Payload yang dikirim:", {
          judul: submitData.judul.substring(0, 30) + "...",
          isi: submitData.isi.substring(0, 30) + "...",
          gambarLength: submitData.gambar?.length || 0,
          gambarIsBase64: submitData.gambar?.startsWith("data:image") ? "Ya" : "URL",
        });

        const response = await api.addNews(submitData);
        console.log("Response dari backend:", response);

        onSave();
        alert("Berita berhasil ditambahkan!");
      }
    } catch (error: any) {
      console.error("Failed to save article:", error);

      let errorMsg = "Gagal menyimpan berita.";
      if (error.response?.status === 0) {
        errorMsg = "Backend tidak merespons (port 5000 mati atau CORS error).";
      } else if (error.response?.status === 404) {
        errorMsg = "Endpoint tidak ditemukan. Periksa rute di backend.";
      } else if (error.response?.status === 413) {
        errorMsg = "Payload terlalu besar. Kurangi ukuran gambar atau pastikan backend limit 50mb.";
      } else if (error.response?.data?.error) {
        errorMsg = `${error.response.data.error}`;
      } else if (error.response?.data?.message) {
        errorMsg = `${error.response.data.message}`;
      } else if (error.message) {
        errorMsg = `${error.message}`;
      }

      alert(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} noValidate>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{isEditMode ? "Edit Berita" : "Tambah Berita Baru"}</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Judul
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => void generateBeritaByTitle(formData.title)}
                    disabled={isGenerating || formData.title.trim().length === 0}
                    className="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-300"
                  >
                    {isGenerating ? "Generating..." : "Generate Berita"}
                  </button>
                  {isGenerating && <p className="text-sm text-blue-600">Sedang generate isi berita...</p>}
                  {isEditMode && !isGenerating && (
                    <p className="text-sm text-gray-500">Ubah judul lalu klik Generate Berita untuk memperbarui isi berita.</p>
                  )}
                </div>
                {generateError && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                    {generateError}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Isi Berita
                </label>
                <textarea
                  name="content"
                  id="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={8}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  style={{ textAlign: "justify" }}
                />
              </div>

              <div>
                <div className="block text-sm font-medium text-gray-700 mb-2">Sumber Gambar</div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input type="radio" name="imageSource" value="url" checked={imageSource === "url"} onChange={() => setImageSource("url")} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
                    <span className="ml-2 text-sm text-gray-700">URL Gambar</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="imageSource" value="upload" checked={imageSource === "upload"} onChange={() => setImageSource("upload")} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
                    <span className="ml-2 text-sm text-gray-700">Upload File</span>
                  </label>
                </div>
              </div>

              {imageSource === "url" ? (
                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                    URL Gambar
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              ) : (
                <div>
                  <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700">
                    Pilih File Gambar
                  </label>
                  <input
                    type="file"
                    name="imageUpload"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              )}

              {formData.imageUrl && (
                <div className="mt-2">
                  <div className="block text-sm font-medium text-gray-700">Preview</div>
                  {isInstagramContentUrl(formData.imageUrl) && getInstagramEmbedUrl(formData.imageUrl) ? (
                    <div className="mt-1 overflow-hidden rounded-md border bg-gray-50">
                      <iframe
                        src={getInstagramEmbedUrl(formData.imageUrl) || undefined}
                        title="Preview konten Instagram"
                        className="h-[420px] w-full"
                      />
                    </div>
                  ) : (
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="mt-1 rounded-md border bg-gray-50 p-1 max-h-40 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = placeholderImage;
                      }}
                    />
                  )}
                </div>
              )}

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  id="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Batal
            </button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">
              {isSaving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ManageNewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await api.getNews();
      setNews(data);
    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleAddNew = () => {
    setEditingArticle(null);
    setIsModalOpen(true);
  };

  const handleEdit = (article: NewsArticle) => {
    setEditingArticle(article);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus berita ini?")) {
      try {
        await api.deleteNews(id);
        fetchNews(); // Refetch news after deleting
      } catch (error) {
        console.error("Failed to delete article:", error);
        alert("Gagal menghapus berita.");
      }
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    setEditingArticle(null);
    fetchNews();
  };

  return (
    <div className="container mx-auto">
      {isModalOpen && <NewsFormModal article={editingArticle || emptyArticle} onClose={() => setIsModalOpen(false)} onSave={handleSave} />}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Berita</h1>
        <button type="button" onClick={handleAddNew} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Tambah Berita Baru
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Judul</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tanggal Dibuat</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : (
              news.map((article) => (
                <tr key={article.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex items-center">
                      {article.imageUrl && (
                        isInstagramContentUrl(article.imageUrl) ? (
                          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400 text-[10px] font-bold text-white">
                            IG
                          </div>
                        ) : (
                          <img
                            src={article.imageUrl}
                            alt=""
                            className="w-10 h-10 rounded-full mr-3 object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = placeholderImage;
                            }}
                          />
                        )
                      )}
                      <p className="text-gray-900 whitespace-no-wrap">{article.title}</p>
                    </div>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${article.status === "published" ? "text-green-900" : "text-yellow-900"}`}>
                      <span aria-hidden className={`absolute inset-0 ${article.status === "published" ? "bg-green-200" : "bg-yellow-200"} opacity-50 rounded-full`}></span>
                      <span className="relative capitalize">{article.status}</span>
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{new Date(article.createdAt).toLocaleDateString("id-ID")}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <button type="button" onClick={() => handleEdit(article)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(article.id)} className="text-red-600 hover:text-red-900">
                      Hapus
                    </button>
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

export default ManageNewsPage;
