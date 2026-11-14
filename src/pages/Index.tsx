import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, X } from 'lucide-react';
import Header, { SiteFooter } from '@/components/Header';
import ToolCard from '@/components/ToolCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toolCategories, tools, type ToolCategory } from '@/lib/tools-config';

const FEATURED_SLUGS = new Set([
  'merge-pdf',
  'word-to-pdf',
  'pdf-to-word',
  'lock-pdf',
  'ocr-pdf',
]);

const TOOL_SPEC_TAGS: Record<string, string> = {
  'merge-pdf': 'MULTI-PDF -> 1 FILE',
  'split-pdf': 'RENTANG HALAMAN',
  'compress-pdf': 'REDUKSI UKURAN',
  'rotate-pdf': '90 / 180 / 270 DERAJAT',
  'organize-pdf': 'SUSUN HALAMAN',
  'convert-to-pdf': 'JPG / PNG -> PDF',
  'word-to-pdf': 'DOCX -> PDF PRESISI',
  'excel-to-pdf': 'XLSX -> PDF',
  'ppt-to-pdf': 'PPTX -> PDF',
  'convert-to-pdfa': 'ARSIP STANDAR ISO',
  'convert-from-pdf': 'PDF -> JPG',
  'pdf-to-word': 'PDF -> DOCX EDITABLE',
  'pdf-to-excel': 'PDF -> XLSX',
  'pdf-to-ppt': 'PDF -> PPTX',
  'lock-pdf': 'PROTEKSI PASSWORD',
  'unlock-pdf': 'HAPUS PASSWORD',
  'sign-pdf': 'TANDA TANGAN',
  'ocr-pdf': 'EKSTRAKSI TEKS SCAN',
};

const QUICK_LAUNCH_LINKS = [
  { label: 'Gabungkan PDF', to: '/tool/merge-pdf' },
  { label: 'Kompres PDF', to: '/tool/compress-pdf' },
  { label: 'OCR PDF', to: '/tool/ocr-pdf' },
  { label: 'Word ke PDF', to: '/tool/word-to-pdf' },
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | ToolCategory>('all');

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredToolsByCategory = useMemo(() => {
    const visibleCategories =
      selectedCategory === 'all'
        ? toolCategories
        : toolCategories.filter((cat) => cat.id === selectedCategory);

    return visibleCategories
      .map((category, categoryPosition) => {
        const categoryNumber = String(
          toolCategories.findIndex((c) => c.id === category.id) + 1
        ).padStart(2, '0');

        const matchingTools = tools.filter((tool) => {
          if (tool.category !== category.id) return false;
          if (!normalizedQuery) return true;
          return (
            tool.title.toLowerCase().includes(normalizedQuery) ||
            tool.description.toLowerCase().includes(normalizedQuery) ||
            tool.slug.toLowerCase().includes(normalizedQuery)
          );
        });

        return {
          category,
          categoryNumber,
          categoryPosition,
          tools: matchingTools,
        };
      })
      .filter((group) => group.tools.length > 0);
  }, [normalizedQuery, selectedCategory]);

  const totalMatches = useMemo(
    () => filteredToolsByCategory.reduce((sum, group) => sum + group.tools.length, 0),
    [filteredToolsByCategory]
  );

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <div className="hm-canvas flex flex-col">
      <Header />

      <main id="main-content" className="flex-1">
        {/* Hero Section: Hole Money Architectural Composition */}
        <section className="pt-12 pb-14 sm:pt-20 sm:pb-20">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <div
                aria-hidden="true"
                className="w-14 h-14 rounded-2xl bg-[#2B3AE8] text-white mx-auto mb-7 flex items-center justify-center shadow-[inset_0_1.5px_0_rgba(255,255,255,0.4),0_12px_28px_-6px_rgba(43,58,232,0.45)] border border-[#1E2BC4]"
              >
                <FileText className="w-7 h-7" />
              </div>

              <h1 className="font-display font-normal text-[clamp(2.5rem,6vw,5.25rem)] leading-[1.03] tracking-[-0.025em] text-foreground max-w-[16ch] mx-auto">
                Kelola Dokumen PDF Anda
              </h1>

              <p className="text-[clamp(1rem,1.6vw,1.25rem)] text-muted-foreground max-w-[54ch] mx-auto mt-6 leading-relaxed">
                <span className="relative inline-block font-semibold text-foreground pb-2">
                  Sepenuhnya gratis
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 210 14"
                    fill="none"
                    className="absolute left-0 bottom-0 w-full h-3 text-cobalt pointer-events-none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M3 9.5C58 3.2 146 2.5 207 8.5"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                : tanpa iklan mengganggu, tanpa registrasi akun, dan file sementara dibersihkan segera setelah proses selesai.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="#tools-section"
                  className="min-h-[48px] px-7 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm inline-flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  Pilih Alat Dokumen
                </a>
                <Link
                  to="/tool/merge-pdf"
                  className="min-h-[48px] px-6 py-3 rounded-xl bg-card text-foreground border border-input hover:border-foreground font-medium text-sm inline-flex items-center justify-center transition-colors"
                >
                  Langsung Gabungkan PDF
                </Link>
              </div>
            </div>

            {/* Hole Money Elevated Workbench Command Frame */}
            <div className="mt-12 sm:mt-14 max-w-5xl mx-auto text-left">
              <div className="hm-frame">
                <div className="hm-sheet p-5 sm:p-7 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                    <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      MEJA KERJA // 18 ALAT DOKUMEN
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-muted-foreground mr-1">Pintasan cepat:</span>
                      {QUICK_LAUNCH_LINKS.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="min-h-[44px] sm:min-h-[36px] inline-flex items-center px-3 py-1.5 rounded-lg bg-secondary/80 hover:bg-cobalt hover:text-cobalt-foreground text-xs font-medium text-foreground transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-5 relative">
                      <label htmlFor="tool-search" className="sr-only">
                        Cari alat dokumen PDF
                      </label>
                      <Search
                        className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        aria-hidden="true"
                      />
                      <Input
                        id="tool-search"
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari alat: gabungkan, Word, OCR..."
                        className="min-h-[44px] pl-10 pr-11 bg-background border-input rounded-xl"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          aria-label="Hapus kata kunci pencarian"
                          className="absolute right-0 top-0 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground rounded-r-xl"
                        >
                          <X className="w-4 h-4" aria-hidden="true" />
                        </button>
                      )}
                    </div>

                    <div
                      role="tablist"
                      aria-label="Filter kategori alat PDF"
                      className="md:col-span-7 flex flex-wrap items-center gap-2"
                    >
                      <button
                        type="button"
                        role="tab"
                        aria-selected={selectedCategory === 'all'}
                        onClick={() => setSelectedCategory('all')}
                        className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                          selectedCategory === 'all'
                            ? 'bg-primary text-primary-foreground font-semibold'
                            : 'bg-background border border-border text-foreground hover:border-foreground/50'
                        }`}
                      >
                        Semua ({tools.length})
                      </button>

                      {toolCategories.map((category) => {
                        const count = tools.filter((t) => t.category === category.id).length;
                        const active = selectedCategory === category.id;
                        return (
                          <button
                            key={category.id}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                              active
                                ? 'bg-primary text-primary-foreground font-semibold'
                                : 'bg-background border border-border text-foreground hover:border-foreground/50'
                            }`}
                          >
                            {category.title} ({count})
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Directory Section: 12-Column Architectural Category Ledgers */}
        <section id="tools-section" className="pb-16 sm:pb-24">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  DIREKTORI ALUR KERJA
                </p>
                <h2 className="font-display font-normal text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.15] text-foreground mt-1">
                  Pilih Alat yang Anda Butuhkan
                </h2>
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                Menampilkan {totalMatches} dari {tools.length} alat
              </p>
            </div>

            {filteredToolsByCategory.length === 0 ? (
              <div className="hm-sheet p-8 sm:p-12 text-center space-y-4">
                <h3 className="font-display text-2xl text-foreground">
                  Tidak ada alat yang cocok
                </h3>
                <p className="text-muted-foreground max-w-[46ch] mx-auto text-sm leading-relaxed">
                  Kata kunci &ldquo;{searchQuery}&rdquo; tidak ditemukan pada daftar 18 alat PDF. Coba ubah kata kunci atau reset filter kategori.
                </p>
                <div className="pt-2">
                  <Button
                    type="button"
                    onClick={resetFilters}
                    className="min-h-[44px] px-6 rounded-xl bg-primary text-primary-foreground"
                  >
                    Reset Pencarian
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                {filteredToolsByCategory.map(({ category, categoryNumber, tools: categoryTools }) => (
                  <div
                    key={category.id}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 py-10 sm:py-12 border-t border-border"
                  >
                    <div className="lg:col-span-4 space-y-3">
                      <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
                        <span className="text-cobalt font-medium">{categoryNumber}</span>
                        <span aria-hidden="true">/</span>
                        <span>{categoryTools.length} ALAT</span>
                      </div>
                      <h3 className="font-display font-normal text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.15] text-foreground">
                        {category.title}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-[38ch]">
                        {category.description}
                      </p>
                    </div>

                    <div className="lg:col-span-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {categoryTools.map((tool, index) => {
                          const globalIndex = String(
                            tools.findIndex((t) => t.slug === tool.slug) + 1
                          ).padStart(2, '0');
                          const isFeatured =
                            !normalizedQuery &&
                            selectedCategory === 'all' &&
                            FEATURED_SLUGS.has(tool.slug);

                          return (
                            <ToolCard
                              key={tool.slug}
                              icon={tool.icon}
                              title={tool.title}
                              description={tool.description}
                              href={`/tool/${tool.slug}`}
                              indexNumber={globalIndex}
                              featured={isFeatured || (selectedCategory !== 'all' && index === 0)}
                              specTag={TOOL_SPEC_TAGS[tool.slug]}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Technical & Privacy Specification Ledger (Varied Section Rhythm) */}
        <section className="border-t border-border bg-card/55 py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-5 space-y-4">
                <p className="font-mono text-xs uppercase tracking-wider text-cobalt">
                  SPESIFIKASI MEJA KERJA
                </p>
                <h2 className="font-display font-normal text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.12] text-foreground">
                  Dirancang untuk Kebutuhan Dokumen Akademik
                </h2>
                <p className="text-muted-foreground leading-relaxed max-w-[60ch]">
                  Setiap alur kerja PDF disusun agar pengajar, mahasiswa, dan staf administrasi dapat menyelesaikan penyuntingan, konversi, tanda tangan, serta ekstraksi teks secara langsung tanpa pendaftaran akun.
                </p>
              </div>

              <div className="lg:col-span-7 divide-y divide-border border-y border-border">
                <div className="py-5 sm:py-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-6">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      Pembersihan Berkas Sementara
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-[54ch]">
                      File unggahan ditempatkan sementara selama proses berlangsung dan langsung dihapus dari direktori sementara ketika pengunduhan selesai.
                    </p>
                  </div>
                  <span className="font-mono text-xs text-foreground shrink-0">
                    HAPUS SELESAI PROSES
                  </span>
                </div>

                <div className="py-5 sm:py-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-6">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      Ekosistem 18 Alat Terpadu
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-[54ch]">
                      Mencakup pengelolaan halaman PDF, konversi dua arah Office dan gambar, pengarsipan PDF/A, proteksi kata sandi, tanda tangan digital, hingga ekstraksi teks OCR.
                    </p>
                  </div>
                  <span className="font-mono text-xs text-foreground shrink-0">
                    5 KATEGORI ALAT
                  </span>
                </div>

                <div className="py-5 sm:py-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-6">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      Kapasitas Unggahan Terukur
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-[54ch]">
                      Mendukung dokumen PDF dan Office hingga 50 MB per permintaan, serta hingga 20 MB untuk pemrosesan ekstraksi teks OCR.
                    </p>
                  </div>
                  <span className="font-mono text-xs text-foreground shrink-0">
                    MAX 50 MB / 20 MB OCR
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
