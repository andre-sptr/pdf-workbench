import { useState, type ChangeEvent, type FormEvent } from 'react';
import axios from 'axios';
import { Clock, Mail, Phone, Send } from 'lucide-react';
import Header, { SiteFooter } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface SubmissionState {
  success: boolean | null;
  message: string;
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SubmissionState>({
    success: null,
    message: '',
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult({ success: null, message: '' });

    const dataToSend = {
      ...formData,
      access_key: 'd8f6ca40-63ed-4e63-8466-9e197cc1a546',
      from_name: 'Pesan dari Website PDF Tools',
      subject: `Pesan Baru: ${formData.subject}`,
    };

    try {
      const response = await axios.post('https://api.web3forms.com/submit', dataToSend);

      if (response.data.success) {
        setResult({
          success: true,
          message: 'Pesan berhasil terkirim. Terima kasih telah menghubungi kami.',
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setResult({
          success: false,
          message: 'Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setResult({
        success: false,
        message: 'Terjadi kesalahan server. Silakan coba beberapa saat lagi.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="hm-canvas flex flex-col">
      <Header />

      <main id="main-content" className="flex-1 py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl space-y-12">
          {/* Editorial Header */}
          <section className="space-y-4 border-b border-border pb-10">
            <p className="font-mono text-xs uppercase tracking-wider text-cobalt">
              DUKUNGAN & UMPAN BALIK
            </p>
            <h1 className="font-display font-normal text-[clamp(2.25rem,5vw,4rem)] leading-[1.06] tracking-[-0.02em] text-foreground">
              Hubungi Kami
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-[58ch] leading-relaxed">
              Sampaikan pertanyaan teknis, saran fitur pengolahan dokumen, atau laporan kendala melalui formulir di bawah ini.
            </p>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Form Frame */}
            <div className="lg:col-span-7">
              <div className="hm-frame">
                <div className="hm-sheet p-6 sm:p-8 space-y-6">
                  <div className="flex items-center gap-3 border-b border-border pb-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-cobalt">
                      <Send className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl text-foreground">Kirim Pesan</h2>
                      <p className="text-xs text-muted-foreground">
                        Seluruh kolom bertanda wajib diisi.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Nama Anda"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="min-h-[44px] bg-background border-input rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Alamat Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="email@contoh.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="min-h-[44px] bg-background border-input rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subjek</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="Topik pesan Anda"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="min-h-[44px] bg-background border-input rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Pesan</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tuliskan detail pertanyaan atau saran Anda di sini..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="bg-background border-input rounded-xl"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-primary-foreground hover:opacity-90 min-h-[48px] py-3.5 px-6 rounded-xl font-semibold text-base shadow-sm transition-opacity"
                    >
                      {isSubmitting ? 'Mengirim Pesan...' : 'Kirim Pesan'}
                    </Button>

                    <div role="status" aria-live="polite">
                      {result.message && (
                        <p
                          className={`p-3.5 rounded-xl border text-sm font-medium text-center ${
                            result.success
                              ? 'border-cobalt bg-cobalt/10 text-foreground'
                              : 'border-destructive bg-destructive/10 text-destructive'
                          }`}
                        >
                          {result.message}
                        </p>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Contact Directory Ledger */}
            <div className="lg:col-span-5 space-y-6">
              <div className="hm-sheet p-6 sm:p-8 space-y-6">
                <h2 className="font-display text-2xl text-foreground border-b border-border pb-4">
                  Informasi Kontak
                </h2>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-cobalt" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">Telepon / WhatsApp</h3>
                      <p className="font-mono text-sm text-muted-foreground mt-1">
                        +62 823-8702-5429
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-cobalt" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">Email Langsung</h3>
                      <a
                        href="mailto:andresaputra07012019@gmail.com"
                        className="inline-block text-sm text-foreground underline underline-offset-4 hover:text-cobalt mt-1 break-all"
                      >
                        andresaputra07012019@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-cobalt" aria-hidden="true" />
                    </div>
                    <div className="w-full">
                      <h3 className="font-semibold text-foreground text-sm mb-2">
                        Jam Operasional Dukungan
                      </h3>
                      <table className="w-full text-sm text-muted-foreground">
                        <tbody>
                          <tr className="border-b border-border/60">
                            <td className="py-1.5 pr-4">Senin - Jumat</td>
                            <td className="py-1.5 font-mono text-right text-foreground">
                              08:00 - 16:00
                            </td>
                          </tr>
                          <tr className="border-b border-border/60">
                            <td className="py-1.5 pr-4">Sabtu</td>
                            <td className="py-1.5 font-mono text-right text-foreground">
                              08:00 - 12:00
                            </td>
                          </tr>
                          <tr>
                            <td className="py-1.5 pr-4">Minggu</td>
                            <td className="py-1.5 font-mono text-right font-semibold text-destructive">
                              Tutup
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hm-sheet p-6 space-y-2 border-foreground/20">
                <p className="font-mono text-xs uppercase tracking-wider text-cobalt">
                  WAKTU RESPONS STANDAR
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Pesan yang masuk pada jam operasional akan ditinjau oleh pengelola platform maksimal dalam 1x24 jam hari kerja.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
