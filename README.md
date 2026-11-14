# PDF Tools - Meja Kerja Dokumen PDF Akademik

Aplikasi web pengolah dokumen PDF yang menyediakan **18 alat dalam 5 kategori** untuk kebutuhan akademik maupun pekerjaan sehari-hari. Seluruh pemrosesan dokumen (penggabungan, pemisahan, kompresi, konversi Office, pengamanan, tanda tangan digital, hingga OCR) dijalankan langsung pada backend lokal menggunakan pustaka Node.js dan utilitas sistem tanpa memerlukan API key AI eksternal.

## Fitur dan Daftar Alat (18 Alat)

### 1. Edit & Kelola PDF (`/tool/:toolSlug`)
| Alat | Rute Frontend | Endpoint API | Teknologi / Utilitas Backend |
| :--- | :--- | :--- | :--- |
| Gabungkan PDF | `/tool/merge-pdf` | `POST /api/merge-pdf` | `pdf-lib` |
| Pisahkan PDF | `/tool/split-pdf` | `POST /api/split-pdf` | `pdf-lib` + `archiver` (ZIP) |
| Kompres PDF | `/tool/compress-pdf` | `POST /api/compress-pdf` | Ghostscript (`-dPDFSETTINGS=/ebook`) |
| Putar PDF | `/tool/rotate-pdf` | `POST /api/rotate-pdf` | `pdf-lib` |
| Atur Halaman PDF | `/tool/organize-pdf` | `POST /api/organize-pdf` | `pdf-lib` + `react-pdf` |

### 2. Konversi ke PDF
| Alat | Rute Frontend | Endpoint API | Teknologi / Utilitas Backend |
| :--- | :--- | :--- | :--- |
| Gambar ke PDF | `/tool/convert-to-pdf` | `POST /api/convert-to-pdf` | `pdfkit` (JPG/JPEG/PNG) |
| Word ke PDF | `/tool/word-to-pdf` | `POST /api/convert-office-to-pdf` | `libreoffice-convert` (DOC/DOCX) |
| Excel ke PDF | `/tool/excel-to-pdf` | `POST /api/convert-office-to-pdf` | `libreoffice-convert` (XLS/XLSX) |
| PowerPoint ke PDF | `/tool/ppt-to-pdf` | `POST /api/convert-office-to-pdf` | `libreoffice-convert` (PPT/PPTX) |
| Konversi ke PDF/A | `/tool/convert-to-pdfa` | `POST /api/pdf-to-pdfa` | Ghostscript (`-dPDFA=2`) |

### 3. Konversi dari PDF
| Alat | Rute Frontend | Endpoint API | Teknologi / Utilitas Backend |
| :--- | :--- | :--- | :--- |
| PDF ke Gambar | `/tool/convert-from-pdf` | `POST /api/convert-from-pdf` | Ghostscript (JPEG 150 DPI) + `archiver` (ZIP, maks. 100 halaman) |
| PDF ke Word | `/tool/pdf-to-word` | `POST /api/pdf-to-word` | LibreOffice (`writer_pdf_import`, DOCX) |
| PDF ke Excel | `/tool/pdf-to-excel` | `POST /api/pdf-to-excel` | `tabula-js` (Java) + `xlsx` (XLSX) |
| PDF ke PowerPoint | `/tool/pdf-to-ppt` | `POST /api/pdf-to-pptx` | LibreOffice (`impress_pdf_import`, PPTX) |

### 4. Keamanan & Tanda Tangan
| Alat | Rute Frontend | Endpoint API | Teknologi / Utilitas Backend |
| :--- | :--- | :--- | :--- |
| Kunci PDF | `/tool/lock-pdf` | `POST /api/lock-pdf` | `pdftk` (`user_pw` / `owner_pw`) |
| Buka Kunci PDF | `/tool/unlock-pdf` | `POST /api/unlock-pdf` | Ghostscript |
| Tanda Tangan PDF | `/tool/sign-pdf` | `POST /api/sign-pdf` | `pdf-lib` + kanvas `react-signature-canvas` & pratinjau `react-pdf` |

### 5. OCR & Ekstraksi Teks
| Alat | Rute Frontend | Endpoint API | Teknologi / Utilitas Backend |
| :--- | :--- | :--- | :--- |
| OCR PDF | `/tool/ocr-pdf` | `POST /api/ocr-pdf` | Ghostscript (JPEG 200 DPI) + `tesseract.js` (`ind+eng`, output Markdown, maks. 20 MB / 100 halaman) |

### Halaman Pendukung
- `/` : Beranda katalog dengan filter kategori, indeks cepat seluruh alat, dan ringkasan alur kerja.
- `/about` : Penjelasan visi proyek, spesifikasi arsitektur, dan privasi dokumen.
- `/faq` : Pertanyaan yang sering diajukan mengenai penggunaan dan kompatibilitas file.
- `/contact` : Formulir pesan dan informasi kontak pengembang.

## Teknologi yang Digunakan

### Frontend
- **Framework**: React 19 + TypeScript + Vite (`@vitejs/plugin-react-swc`)
- **Styling & UI**: Tailwind CSS, komponen UI Radix/shadcn (`src/components/ui`), `lucide-react`, tipografi *Plus Jakarta Sans*, *Newsreader*, dan *JetBrains Mono*, serta dukungan Light Mode dan Dark Mode (`pdf-workbench-theme`)
- **Dokumen & Interaksi**: `react-pdf`, `pdfjs-dist`, `react-dropzone`, `react-signature-canvas`, `react-markdown`, `remark-gfm`
- **Routing & State**: `react-router-dom`, `@tanstack/react-query`, `axios`

### Backend (`server/`)
- **Server**: Node.js + Express 5 + `cors` + `dotenv`
- **Upload & File Sementara**: `multer` (batas 50 MB per unggahan, tersimpan di `os.tmpdir()` dan dihapus otomatis setelah respons selesai)
- **Pemrosesan PDF & Dokumen**: `pdf-lib`, `pdfkit`, `archiver`, `libreoffice-convert`, `xlsx`, `tabula-js`, `tesseract.js`

## Struktur Direktori

```text
pdf-workbench/
├── .env.example                 # Contoh variabel environment frontend
├── index.html                   # Entry HTML + inisialisasi font & tema
├── package.json                 # Dependensi & skrip frontend
├── vite.config.ts               # Konfigurasi Vite & Vitest
├── public/
│   └── favicon.ico
├── server/
│   ├── .env.example             # Contoh variabel environment backend (tanpa AI API key)
│   ├── package.json             # Dependensi backend Express
│   └── server.js                # Seluruh endpoint REST pemrosesan PDF
└── src/
    ├── App.tsx                  # Routing utama & provider aplikasi
    ├── main.tsx                 # Entry point React
    ├── index.css                # Token tema (Light/Dark Mode) & utilitas CSS
    ├── components/
    │   ├── tools/               # 18 komponen alat PDF + MarkdownResultPanel
    │   ├── ui/                  # Komponen UI dasar (Radix + Tailwind)
    │   ├── Dropzone.tsx
    │   ├── ErrorBoundary.tsx
    │   ├── Header.tsx           # Navigasi header & footer
    │   ├── ScrollToTop.tsx
    │   └── ToolCard.tsx
    ├── hooks/
    │   ├── use-toast.ts
    │   └── usePdfTool.ts
    ├── lib/
    │   ├── api.ts               # Klien Axios & helper validasi/unduhan
    │   ├── tools-config.ts      # Metadata 5 kategori & 18 alat PDF
    │   └── utils.ts
    └── pages/
        ├── Index.tsx
        ├── ToolPage.tsx
        ├── About.tsx
        ├── FAQ.tsx
        ├── Contact.tsx
        └── NotFound.tsx
```

## Prasyarat Sistem

Selain Node.js (disarankan v20 atau lebih baru), beberapa endpoint backend membutuhkan utilitas baris perintah berikut agar tersedia di sistem `PATH`:

1. **Ghostscript** (`gswin64c` di Windows, `gs` di Linux/macOS): digunakan oleh **Kompres PDF**, **Konversi ke PDF/A**, **PDF ke Gambar**, **Buka Kunci PDF**, dan **OCR PDF**.
2. **LibreOffice** (`soffice` di Windows, `libreoffice` di Linux/macOS): digunakan oleh **Word/Excel/PowerPoint ke PDF**, **PDF ke Word**, dan **PDF ke PowerPoint**.
3. **PDFtk** (`pdftk`): digunakan oleh **Kunci PDF**.
4. **Java Runtime (JRE/JDK)**: digunakan oleh `tabula-js` pada fitur **PDF ke Excel**.

## Konfigurasi Environment

### 1. Frontend (`.env`)
Salin `.env.example` menjadi `.env` di folder root:

```bash
cp .env.example .env
```

Isi bawaan `.env.example`:

```env
VITE_API_URL=/api
```

> Catatan pengembangan lokal: jika frontend (`http://localhost:5173`) dan backend (`http://localhost:3004`) dijalankan terpisah tanpa reverse proxy, ubah nilai `VITE_API_URL` di `.env` menjadi `http://localhost:3004/api`.

### 2. Backend (`server/.env`)
Salin `server/.env.example` menjadi `server/.env`:

```bash
cp server/.env.example server/.env
```

Isi bawaan `server/.env.example` (tidak membutuhkan API key AI):

```env
PORT=3004
CORS_ORIGIN=http://localhost:5173
```

## Cara Menjalankan di Lokal

Buka dua terminal terpisah dari direktori root proyek.

### Terminal 1: Jalankan Backend Server

```bash
cd server
npm install
node server.js
```

Server akan berjalan pada `http://localhost:3004`.

### Terminal 2: Jalankan Frontend (Vite)

```bash
npm install
npm run dev
```

Aplikasi web dapat diakses melalui `http://localhost:5173`.

## Skrip Frontend Lainnya

- `npm run build` : Membuat bundle produksi di direktori `dist/`
- `npm run preview` : Menjalankan pratinjau hasil build produksi
- `npm run lint` : Memeriksa kode TypeScript/React dengan ESLint
- `npm run test:run` : Menjalankan pengujian unit Vitest

## Privasi dan Penanganan File Sementara

Semua file yang diunggah ke backend disimpan sementara di direktori temporer sistem operasi (`os.tmpdir()`) menggunakan nama acak dan dibersihkan otomatis melalui helper `safeUnlink` ketika respons selesai dikirim atau koneksi ditutup.
