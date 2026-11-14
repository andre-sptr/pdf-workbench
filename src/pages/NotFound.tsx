import { Link } from 'react-router-dom';
import Header, { SiteFooter } from '@/components/Header';

export default function NotFoundPage() {
  return (
    <div className="hm-canvas flex flex-col">
      <Header />

      <main
        id="main-content"
        className="flex-1 flex items-center justify-center px-4 py-16 sm:py-24"
      >
        <div className="max-w-lg w-full">
          <div className="hm-frame">
            <div className="hm-sheet p-8 sm:p-12 text-center space-y-5">
              <p className="font-mono text-xs uppercase tracking-wider text-cobalt">
                ERROR // 404
              </p>
              <h1 className="font-display font-normal text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.06] text-foreground">
                Halaman Tidak Ditemukan
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed">
                Tautan yang Anda buka tidak tersedia atau alat yang dimaksud sudah dipindahkan. Silakan kembali ke direktori utama.
              </p>
              <div className="pt-2">
                <Link
                  to="/"
                  className="min-h-[48px] px-7 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm inline-flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  Kembali ke Beranda
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
