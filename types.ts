/// <reference types="vite/client" />

export interface NewsArticle {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  status: "draft" | "published";
  createdAt: string;
}

export interface AcademicInfo {
  id: number;
  title: string;
  description: string;
  date: string;
  type: "Pengumuman" | "Jadwal Ujian" | "Kalender Akademik" | "PPDB";
}

export interface GalleryPhoto {
  id: number;
  title: string;
  imageUrl: string;
  category: string;
  createdAt: string;
}

export interface SchoolProfile {
  name: string;
  vision: string;
  mission: string[];
  history: string;
  address: string;
  phone: string;
  email: string;
}

export interface SchoolAgenda {
  id: number;
  event: string;
  date: string;
}
