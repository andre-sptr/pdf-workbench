import { Link } from 'react-router-dom';
import { GraduationCap, Lightbulb, Shield, Target, Users } from 'lucide-react';
import Header, { SiteFooter } from '@/components/Header';

const PRINCIPLES = [
  {
    index: '01',
    icon: Shield,
    title: 'Keamanan & Pembersihan Otomatis',
    description:
      'Setiap berkas yang Anda unggah hanya ditempatkan di direktori sementara selama pemrosesan berlangsung dan langsung dihapus otomatis setelah selesai.',
  },
  {
    index: '02',
    icon: Users,
    title: 'Dirancang untuk Seluruh Kalangan Akademik',
    description:
      'Antarmuka berbahasa Indonesia yang jelas membantu guru, dosen, mahasiswa, dan staf administrasi menyelesaikan urusan dokumen harian tanpa hambatan teknis.',
  },
  {
    index: '03',
    icon: GraduationCap,
    title: 'Gratis Tanpa Registrasi Akun',
    description:
      'Seluruh 18 alat pengolahan dokumen PDF dan OCR dapat langsung dipakai kapan saja tanpa membuat akun, tanpa biaya langganan, dan tanpa watermark tambahan.',
  },
];

export default function About() {
  return (
    <div className="hm-canvas flex flex-col">
      <Header />

      <main id="main-content" className="flex-1 py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-16">
          {/* Editorial Header */}
          <section className="space-y-5 border-b border-border pb-10">
            <p className="font-mono text-xs uppercase tracking-wider text-cobalt">
              PROFIL PLATFORM // LITERASI DIGITAL AKADEMIK
            </p>
            <h1 className="font-display font-normal text-[clamp(2.25rem,5vw,4rem)] leading-[1.06] tracking-[-0.02em] text-foreground max-w-[18ch]">
              Tentang PDF Tools
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-[62ch] leading-relaxed">
              PDF Tools hadir sebagai meja kerja dokumen digital untuk mendukung penyusunan karya ilmiah, administrasi sekolah, dan pengelolaan berkas harian secara ringkas serta aman.
            </p>
          </section>

          {/* Mission & Vision Frame */}
          <section aria-label="Misi dan Visi">
            <div className="hm-frame">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="hm-sheet p-6 sm:p-8 space-y-4">
                  <div className="w-11 h-11 rounded-xl bg-secondary border border-border flex items-center justify-center text-cobalt">
                    <Target className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl text-foreground">
                    Misi Kami
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    Menyediakan perangkat pengolahan dokumen yang mudah diakses untuk mendukung kegiatan belajar mengajar, penelitian, dan tata usaha akademik dengan standar privasi yang jelas.
                  </p>
                </div>

                <div className="hm-sheet p-6 sm:p-8 space-y-4">
                  <div className="w-11 h-11 rounded-xl bg-secondary border border-border flex items-center justify-center text-cobalt">
                    <Lightbulb className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl text-foreground">
                    Visi Kami
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    Menjadi meja kerja dokumen digital andalan yang memberdayakan pelajar, pendidik, dan cendekia Indonesia melalui alat kerja yang akurat, ringkas, dan dapat digunakan di berbagai perangkat.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Architectural Principle Ledger */}
          <section className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-4 space-y-3">
                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  PRINSIP KERJA
                </p>
                <h2 className="font-display text-2xl sm:text-3xl text-foreground leading-[1.15]">
                  Mengapa Memilih PDF Tools?
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Kami memfokuskan desain aplikasi pada kejelasan tugas agar setiap konversi dan penyuntingan dokumen selesai tepat sasaran.
                </p>
              </div>

              <div className="lg:col-span-8 divide-y divide-border border-y border-border">
                {PRINCIPLES.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.index} className="py-6 flex items-start gap-4 sm:gap-5">
                      <span className="font-mono text-xs text-cobalt pt-1 shrink-0">
                        {item.index}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-foreground" aria-hidden="true" />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-base sm:text-lg font-semibold text-foreground">
                          {item.title}
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-[58ch]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/"
                className="min-h-[48px] px-7 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm inline-flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                Jelajahi 18 Alat PDF
              </Link>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
