# pdf-tools

Full-stack PDF workbench built with React, TypeScript, Vite, and Express. The web interface is localized in Indonesian (`PDF Tools`) and provides 20 document workflows across five categories: PDF editing, conversion to PDF, conversion from PDF, security/signing, and AI/OCR processing.

## Project Structure

```text
pdf-workbench/
├── public/
│   └── favicon.ico
├── server/
│   ├── .env.example               # Backend env template (GOOGLE_AI_API_KEY, PORT)
│   ├── package.json               # Backend dependencies (Express, PDF & AI libs)
│   └── server.js                  # Express API server (port 3004)
├── src/
│   ├── components/
│   │   ├── tools/                 # 20 tool UI components + MarkdownResultPanel.tsx
│   │   ├── ui/                    # shadcn/ui (Radix UI + Tailwind) primitives
│   │   ├── Dropzone.tsx           # Drag-and-drop and keyboard-accessible file picker
│   │   ├── ErrorBoundary.tsx      # Top-level React error fallback
│   │   ├── Header.tsx             # Responsive top navigation bar
│   │   ├── ScrollToTop.tsx        # Resets scroll position on route change
│   │   └── ToolCard.tsx           # Tool card shown on the home catalog
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   └── usePdfTool.ts          # Shared upload, progress, validation, and download hook
│   ├── lib/
│   │   ├── api.ts                 # Axios client (postFile, postFormJson) and file validators
│   │   ├── tools-config.ts        # Category and tool metadata definitions
│   │   └── utils.ts               # Tailwind class merge helper
│   ├── pages/
│   │   ├── Index.tsx              # Landing page and categorized tool grid (/)
│   │   ├── ToolPage.tsx           # Dynamic tool runner (/tool/:toolSlug)
│   │   ├── About.tsx              # About page (/about)
│   │   ├── FAQ.tsx                # FAQ accordion page (/faq)
│   │   ├── Contact.tsx            # Contact form page via Web3Forms (/contact)
│   │   └── NotFound.tsx           # 404 fallback route (*)
│   ├── App.tsx                    # Router, React Query provider, ErrorBoundary, Toaster
│   ├── index.css                  # Tailwind base styles and theme variables
│   └── main.tsx                   # React root mount
├── .env.example                   # Frontend env template (VITE_API_URL)
├── components.json                # shadcn/ui configuration
├── eslint.config.js               # ESLint flat config for TypeScript and React Hooks
├── index.html                     # HTML shell and font imports
├── package.json                   # Frontend dependencies and npm/pnpm scripts
├── tailwind.config.ts             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript root configuration
└── vite.config.ts                 # Vite + SWC + Vitest configuration
```

## Tools and API Mapping

All tools are registered in `src/lib/tools-config.ts`, mapped to components in `src/pages/ToolPage.tsx`, and served under `/tool/:toolSlug`.

### Edit & Kelola PDF (`edit`)

| Slug | UI Title | Component | Backend Endpoint | Engine / Library |
| --- | --- | --- | --- | --- |
| `merge-pdf` | Gabungkan PDF | `Merge-PDF.tsx` | `POST /api/merge-pdf` | `pdf-lib` |
| `split-pdf` | Pisahkan PDF | `Split-PDF.tsx` | `POST /api/split-pdf` | `pdf-lib`, `archiver` (ZIP) |
| `compress-pdf` | Kompres PDF | `Compress-PDF.tsx` | `POST /api/compress-pdf` | Ghostscript (`pdfwrite`) |
| `rotate-pdf` | Putar PDF | `Rotate-PDF.tsx` | `POST /api/rotate-pdf` | `pdf-lib` |
| `organize-pdf` | Atur Halaman PDF | `Organize-PDF.tsx` | `POST /api/organize-pdf` | `pdfjs-dist` (client), `pdf-lib` (server) |

### Konversi ke PDF (`convert-to`)

| Slug | UI Title | Component | Backend Endpoint | Engine / Library |
| --- | --- | --- | --- | --- |
| `convert-to-pdf` | Gambar ke PDF | `ConvertTo-PDF.tsx` | `POST /api/convert-to-pdf` | `pdfkit` |
| `word-to-pdf` | Word ke PDF | `Word-to-PDF.tsx` | `POST /api/convert-office-to-pdf` | `libreoffice-convert` |
| `excel-to-pdf` | Excel ke PDF | `Excel-to-PDF.tsx` | `POST /api/convert-office-to-pdf` | `libreoffice-convert` |
| `ppt-to-pdf` | PowerPoint ke PDF | `PowerPoint-to-PDF.tsx` | `POST /api/convert-office-to-pdf` | `libreoffice-convert` |
| `convert-to-pdfa` | Konversi ke PDF/A | `ConvertTo-PDFA.tsx` | `POST /api/pdf-to-pdfa` | Ghostscript (`-dPDFA=2`) |

### Konversi dari PDF (`convert-from`)

| Slug | UI Title | Component | Backend Endpoint | Engine / Library |
| --- | --- | --- | --- | --- |
| `convert-from-pdf` | PDF ke Gambar | `ConvertFrom-PDF.tsx` | `POST /api/convert-from-pdf` | Ghostscript (`jpeg`) + `archiver` (ZIP, max 100 pages) |
| `pdf-to-word` | PDF ke Word | `PDF-to-Word.tsx` | `POST /api/pdf-to-word` | LibreOffice (`writer_pdf_import`) |
| `pdf-to-excel` | PDF ke Excel | `PDF-to-Excel.tsx` | `POST /api/pdf-to-excel` | `tabula-js` (Java) + `xlsx` |
| `pdf-to-ppt` | PDF ke PowerPoint | `PDF-to-PowerPoint.tsx` | `POST /api/pdf-to-pptx` | LibreOffice (`impress_pdf_import`) |

### Keamanan & Tanda Tangan (`security`)

| Slug | UI Title | Component | Backend Endpoint | Engine / Library |
| --- | --- | --- | --- | --- |
| `lock-pdf` | Kunci PDF | `Lock-PDF.tsx` | `POST /api/lock-pdf` | `pdftk` |
| `unlock-pdf` | Buka Kunci PDF | `Unlock-PDF.tsx` | `POST /api/unlock-pdf` | Ghostscript |
| `sign-pdf` | Tanda Tangan PDF | `Sign-PDF.tsx` | `POST /api/sign-pdf` | `react-pdf`, `react-signature-canvas`, `pdf-lib` |

### AI & OCR (`ai`)

| Slug | UI Title | Component | Backend Endpoint | Engine / Library |
| --- | --- | --- | --- | --- |
| `ocr-pdf` | OCR PDF | `OCR-PDF.tsx` | `POST /api/ocr-pdf` | `@google/generative-ai` (`gemini-3.1-pro-preview`) |
| `ai-summarizer` | AI Ringkasan PDF | `AI-Summarizer.tsx` | `POST /api/ai-summarize` | `pdf-parse` + `@google/generative-ai` |
| `ai-translator` | AI Terjemahan PDF | `AI-Translator.tsx` | `POST /api/ai-translate` | `pdf-parse` + `@google/generative-ai` |

## Architecture Notes

### Frontend (`src/`)

- **Routing**: `src/App.tsx` wraps the app with `ErrorBoundary`, `QueryClientProvider`, `TooltipProvider`, and `BrowserRouter`. Routes cover `/`, `/tool/:toolSlug`, `/about`, `/faq`, `/contact`, and a `*` catch-all.
- **API communication (`src/lib/api.ts`)**: Uses an Axios instance (`120000` ms timeout) configured via `import.meta.env.VITE_API_URL || '/api'`. Binary-returning tools use `postFile` (`responseType: 'blob'`) and `downloadBlob`; AI and OCR tools use `postFormJson<MarkdownApiResult>` and render the returned Markdown inside `MarkdownResultPanel.tsx` (`react-markdown` + `remark-gfm`).
- **Shared tool state (`src/hooks/usePdfTool.ts`)**: Handles file validation, duplicate filtering, file reordering, upload progress tracking, request cancellation via `AbortController`, and toast feedback.

### Backend (`server/server.js`)

- **Server & CORS**: Runs Express 5 on port `3004` (`const port = 3004`) with CORS enabled for `http://localhost:5173`.
- **Upload handling**: Uses `multer` disk storage writing temporary files to `os.tmpdir()` with a 50 MB upload limit. AI/OCR endpoints enforce an additional 20 MB limit before sending document data to Gemini. Most routes remove temporary files on response `finish` and `close` events.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite (SWC), Tailwind CSS, shadcn/ui (Radix UI), Lucide icons, Axios, React Router DOM, React Query, `pdfjs-dist`, `react-pdf`, `react-signature-canvas`, `react-markdown`, `remark-gfm`.
- **Backend**: Node.js, Express 5, Multer, `pdf-lib`, `pdfkit`, `pdf-parse`, `archiver`, `libreoffice-convert`, `tabula-js`, `xlsx`, `@google/generative-ai`.

## Prerequisites

- **Node.js**: LTS release (e.g. v20+) with `pnpm` or `npm`.
- **System binaries** required on the backend `PATH` for specific endpoints:
  - **Ghostscript** (`gswin64c` on Windows, `gs` on Linux/macOS) for compression, PDF to JPG, unlocking, and PDF/A conversion.
  - **LibreOffice** (`soffice` on Windows, `libreoffice` on Linux/macOS) for Office to PDF, PDF to Word, and PDF to PowerPoint conversion.
  - **PDFtk** (`pdftk`) for password-protecting PDFs.
  - **Java Runtime** (`java`) for `tabula-js` table extraction in PDF to Excel.
- **Google AI API key**: Required in `server/.env` as `GOOGLE_AI_API_KEY` for OCR, summarization, and translation.

## Getting Started

### 1. Install dependencies

Frontend (root directory):

```bash
pnpm install
# or: npm install
```

Backend (`server/` directory):

```bash
cd server
pnpm install
# or: npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` in the repository root and `server/.env.example` to `server/.env`:

- `.env` (frontend):
  - `VITE_API_URL=/api` (default in `.env.example` for reverse-proxy setups). Because `vite.config.ts` does not define a dev server proxy, set `VITE_API_URL=http://localhost:3004/api` when running Vite (`http://localhost:5173`) directly against the local Express server (`http://localhost:3004`).
- `server/.env` (backend):
  - `GOOGLE_AI_API_KEY`: API key for `@google/generative-ai`.
  - `PORT=3004`: documented in `.env.example` (note: `server/server.js` currently listens on port `3004`).

Do not commit real `.env` files.

### 3. Run in development

Start the backend API server:

```bash
cd server
node server.js
```

Start the Vite dev server from the repository root:

```bash
npm run dev
```

## Available Scripts

Root `package.json`:

| Script | Command | Description |
| --- | --- | --- |
| `dev` | `vite` | Start Vite development server |
| `build` | `vite build` | Build production frontend bundle to `dist/` |
| `preview` | `vite preview` | Preview built frontend bundle locally |
| `lint` | `eslint --quiet ./src` | Run ESLint on `src/` |
| `test` | `vitest` | Run Vitest in watch mode |
| `test:run` | `vitest run` | Run Vitest once (`vite.config.ts` targets `src/**/*.test.{ts,tsx}`; no test files are present yet) |

## Status

Maintained utility app. The default branch is `main`.
