import { type JSX } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Header, { SiteFooter } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { toolCategories, tools } from '@/lib/tools-config';

import MergePdfTool from '@/components/tools/Merge-PDF';
import SplitPdfTool from '@/components/tools/Split-PDF';
import CompressPdfTool from '@/components/tools/Compress-PDF';
import ConvertToPdfTool from '@/components/tools/ConvertTo-PDF';
import ConvertFromPdfTool from '@/components/tools/ConvertFrom-PDF';
import RotatePdfTool from '@/components/tools/Rotate-PDF';
import OrganizePdfTool from '@/components/tools/Organize-PDF';
import WordToPdfTool from '@/components/tools/Word-to-PDF';
import ExcelToPdfTool from '@/components/tools/Excel-to-PDF';
import PptToPdfTool from '@/components/tools/PowerPoint-to-PDF';
import ConvertToPdfaTool from '@/components/tools/ConvertTo-PDFA';
import PdfToWordTool from '@/components/tools/PDF-to-Word';
import PdfToExcelTool from '@/components/tools/PDF-to-Excel';
import PdfToPptTool from '@/components/tools/PDF-to-PowerPoint';
import LockPdfTool from '@/components/tools/Lock-PDF';
import UnlockPdfTool from '@/components/tools/Unlock-PDF';
import SignPdfTool from '@/components/tools/Sign-PDF';
import OcrPdfTool from '@/components/tools/OCR-PDF';

const ToolNotAvailable = () => (
  <div className="hm-sheet p-8 sm:p-12 text-center space-y-5">
    <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
      STATUS // ALAT TIDAK DITEMUKAN
    </p>
    <h1 className="font-display text-3xl sm:text-4xl text-foreground">
      Alat Dokumen Belum Tersedia
    </h1>
    <p className="text-muted-foreground text-base max-w-[48ch] mx-auto">
      Alat yang Anda cari tidak terdaftar dalam direktori. Silakan kembali ke beranda untuk memilih salah satu dari 18 alat yang tersedia.
    </p>
    <div>
      <Button asChild className="min-h-[48px] px-6 rounded-xl bg-primary text-primary-foreground">
        <Link to="/">Kembali ke Beranda</Link>
      </Button>
    </div>
  </div>
);

const toolComponents: Record<string, JSX.Element> = {
  'merge-pdf': <MergePdfTool />,
  'split-pdf': <SplitPdfTool />,
  'compress-pdf': <CompressPdfTool />,
  'convert-to-pdf': <ConvertToPdfTool />,
  'convert-from-pdf': <ConvertFromPdfTool />,
  'rotate-pdf': <RotatePdfTool />,
  'organize-pdf': <OrganizePdfTool />,
  'word-to-pdf': <WordToPdfTool />,
  'excel-to-pdf': <ExcelToPdfTool />,
  'ppt-to-pdf': <PptToPdfTool />,
  'convert-to-pdfa': <ConvertToPdfaTool />,
  'pdf-to-word': <PdfToWordTool />,
  'pdf-to-excel': <PdfToExcelTool />,
  'pdf-to-ppt': <PdfToPptTool />,
  'lock-pdf': <LockPdfTool />,
  'unlock-pdf': <UnlockPdfTool />,
  'sign-pdf': <SignPdfTool />,
  'ocr-pdf': <OcrPdfTool />,
};

export default function ToolPage() {
  const { toolSlug } = useParams<{ toolSlug: string }>();
  const toolIndex = tools.findIndex((t) => t.slug === toolSlug);
  const toolMeta = toolIndex >= 0 ? tools[toolIndex] : undefined;
  const component = toolSlug ? toolComponents[toolSlug] : undefined;

  if (!toolMeta || !component) {
    return (
      <div className="hm-canvas flex flex-col">
        <Header />
        <main id="main-content" className="flex-1 py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
            <ToolNotAvailable />
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const category = toolCategories.find((c) => c.id === toolMeta.category);
  const siblingTools = tools.filter(
    (t) => t.category === toolMeta.category && t.slug !== toolMeta.slug
  );
  const IconComponent = toolMeta.icon;
  const formattedNumber = String(toolIndex + 1).padStart(2, '0');

  return (
    <div className="hm-canvas flex flex-col">
      <Header />

      <main id="main-content" className="flex-1 py-8 sm:py-14">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          {/* Architectural Breadcrumb & Workbench Header */}
          <div className="mb-8 sm:mb-10 space-y-6">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
            >
              <Link
                to="/"
                className="min-h-[44px] inline-flex items-center gap-2 pr-2 text-foreground hover:text-cobalt font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Beranda</span>
              </Link>
              <span aria-hidden="true">/</span>
              <span>{category?.title ?? 'Alat PDF'}</span>
              <span aria-hidden="true">/</span>
              <span className="text-foreground font-medium">{toolMeta.title}</span>
            </nav>

            <div className="flex flex-col sm:flex-row sm:items-center gap-5 border-b border-border pb-8">
              <div className="w-14 h-14 rounded-2xl bg-[#2B3AE8] text-white flex items-center justify-center shrink-0 shadow-[inset_0_1.5px_0_rgba(255,255,255,0.35),0_8px_20px_-6px_rgba(43,58,232,0.4)] border border-[#1E2BC4]">
                <IconComponent className="w-7 h-7" aria-hidden="true" />
              </div>

              <div className="space-y-2">
                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  ALAT #{formattedNumber} // {category?.title.toUpperCase()}
                </p>
                <h1 className="font-display font-normal text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.08] tracking-[-0.02em] text-foreground">
                  {toolMeta.title}
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground max-w-[60ch] leading-relaxed">
                  {toolMeta.description}
                </p>
              </div>
            </div>
          </div>

          {/* Elevated Hole Money Document Workbench Frame */}
          <section aria-label={`Area kerja ${toolMeta.title}`}>
            <div className="hm-frame">
              <div className="hm-sheet p-5 sm:p-8">{component}</div>
            </div>
          </section>

          {/* Honest Processing & Privacy Strip */}
          <div className="mt-8 hm-sheet p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-secondary text-foreground flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-cobalt" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-foreground">
                Keamanan & Privasi Pemrosesan
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Berkas unggahan diproses sementara untuk menghasilkan dokumen Anda dan langsung dihapus dari direktori sementara server setelah pengiriman selesai.
              </p>
            </div>
          </div>

          {/* Quick-Switcher for Sibling Tools */}
          {siblingTools.length > 0 && (
            <section
              aria-label="Alat terkait dalam kategori ini"
              className="mt-12 pt-8 border-t border-border space-y-4"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-display text-xl sm:text-2xl text-foreground">
                  Alat Lain dalam Kategori {category?.title}
                </h2>
                <span className="font-mono text-xs text-muted-foreground">
                  {siblingTools.length} alat
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {siblingTools.map((sibling) => {
                  const SiblingIcon = sibling.icon;
                  return (
                    <Link
                      key={sibling.slug}
                      to={`/tool/${sibling.slug}`}
                      className="min-h-[44px] inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-card border border-border hover:border-cobalt text-sm font-medium text-foreground transition-colors"
                    >
                      <SiblingIcon className="w-4 h-4 text-cobalt shrink-0" aria-hidden="true" />
                      <span>{sibling.title}</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
