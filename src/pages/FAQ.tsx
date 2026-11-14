import { Link } from 'react-router-dom';
import { ShieldCheck, Upload, UserCheck } from 'lucide-react';
import Header, { SiteFooter } from '@/components/Header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQS = [
  {
    question: 'Apakah file saya disimpan permanen di server?',
    answer:
      'Tidak. Berkas yang Anda unggah hanya disimpan sementara di direktori temporer sistem selama proses konversi atau penyuntingan berjalan, lalu langsung dihapus otomatis segera setelah respons dikirim.',
  },
  {
    question: 'Apakah layanan ini benar-benar gratis?',
    answer:
      'Ya, PDF Tools sepenuhnya gratis untuk semua pengguna tanpa biaya langganan, tanpa iklan mengganggu, dan tanpa tanda air (watermark) tambahan pada hasil dokumen.',
  },
  {
    question: 'Format file apa saja yang didukung?',
    answer:
      'Kami mendukung berkas PDF untuk seluruh alat pengeditan, keamanan, dan OCR. Untuk konversi antarformat, platform mendukung dokumen Word (.doc, .docx), Excel (.xls, .xlsx), PowerPoint (.ppt, .pptx), dan gambar (JPG, JPEG, PNG).',
  },
  {
    question: 'Berapa ukuran maksimal file yang bisa diunggah?',
    answer:
      'Batas maksimal unggahan standar pada alat pengolahan dan konversi PDF adalah 50 MB per permintaan, sedangkan untuk pemrosesan OCR batas maksimalnya adalah 20 MB per file.',
  },
  {
    question: 'Apakah bisa digunakan di ponsel atau tablet?',
    answer:
      'Ya, antarmuka PDF Tools dirancang responsif untuk layar ponsel, tablet, maupun desktop sehingga seluruh tombol unggah, formulir, dan daftar alat tetap nyaman dijangkau.',
  },
  {
    question: 'Apakah perlu mendaftar akun terlebih dahulu?',
    answer:
      'Tidak. Anda dapat langsung membuka halaman alat yang dibutuhkan, mengunggah dokumen, dan mengunduh hasilnya tanpa pendaftaran akun atau login.',
  },
  {
    question: 'Bagaimana jika terjadi error saat memproses file?',
    answer:
      'Pastikan format dan ukuran file sesuai batas yang diizinkan serta dokumen tidak rusak (corrupt). Untuk dokumen terenkripsi, gunakan alat Buka Kunci PDF terlebih dahulu sebelum menjalankan konversi atau OCR.',
  },
  {
    question: 'Berapa banyak file yang bisa digabungkan sekaligus?',
    answer:
      'Alat Gabungkan PDF mendukung penggabungan minimal 2 file hingga maksimal 20 file PDF dalam satu kali proses. Anda juga dapat mengatur ulang urutannya sebelum menggabungkan.',
  },
];

export default function FAQ() {
  return (
    <div className="hm-canvas flex flex-col">
      <Header />

      <main id="main-content" className="flex-1 py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-14">
          {/* Editorial Header */}
          <section className="space-y-4 border-b border-border pb-10">
            <p className="font-mono text-xs uppercase tracking-wider text-cobalt">
              DOKUMENTASI PENGGUNA // FAQ
            </p>
            <h1 className="font-display font-normal text-[clamp(2.25rem,5vw,4rem)] leading-[1.06] tracking-[-0.02em] text-foreground max-w-[20ch]">
              Pertanyaan yang Sering Diajukan
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-[58ch] leading-relaxed">
              Penjelasan ringkas seputar keamanan berkas, batas ukuran unggahan, dukungan format, dan cara kerja PDF Tools.
            </p>
          </section>

          {/* Architectural Summary Strip */}
          <section aria-label="Ringkasan kebijakan" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="hm-sheet p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground">01 // PRIVASI</span>
                <ShieldCheck className="w-5 h-5 text-cobalt" aria-hidden="true" />
              </div>
              <h2 className="text-base font-semibold text-foreground">Penghapusan Otomatis</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Berkas sementara dihapus dari server segera setelah proses selesai dikirim.
              </p>
            </div>

            <div className="hm-sheet p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground">02 // KAPASITAS</span>
                <Upload className="w-5 h-5 text-cobalt" aria-hidden="true" />
              </div>
              <h2 className="text-base font-semibold text-foreground">Hingga 50 MB</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Mendukung berkas hingga 50 MB untuk alat PDF dan 20 MB untuk fitur OCR.
              </p>
            </div>

            <div className="hm-sheet p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground">03 // AKSES</span>
                <UserCheck className="w-5 h-5 text-cobalt" aria-hidden="true" />
              </div>
              <h2 className="text-base font-semibold text-foreground">Tanpa Akun</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Seluruh 18 alat tersedia langsung di peramban tanpa registrasi pengguna.
              </p>
            </div>
          </section>

          {/* Accordion Frame */}
          <section aria-label="Daftar pertanyaan umum">
            <div className="hm-frame">
              <div className="hm-sheet p-4 sm:p-8">
                <Accordion type="single" collapsible className="w-full divide-y divide-border">
                  {FAQS.map((faq, index) => (
                    <AccordionItem
                      key={faq.question}
                      value={`item-${index}`}
                      className="border-none py-1"
                    >
                      <AccordionTrigger className="min-h-[52px] text-left font-semibold text-base text-foreground hover:text-cobalt hover:no-underline gap-4 py-4">
                        <span className="flex items-baseline gap-3 sm:gap-4">
                          <span className="font-mono text-xs text-cobalt shrink-0">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span>{faq.question}</span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm sm:text-base text-muted-foreground leading-relaxed pl-7 sm:pl-9 pb-5">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="hm-sheet p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <h2 className="font-display text-2xl text-foreground">
                Masih Ada Pertanyaan Teknis?
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-[50ch]">
                Kirimkan pertanyaan atau laporan kendala format dokumen Anda melalui halaman kontak.
              </p>
            </div>
            <Link
              to="/contact"
              className="min-h-[48px] px-7 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm inline-flex items-center justify-center hover:opacity-90 transition-opacity shrink-0"
            >
              Hubungi Kami
            </Link>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
