import { useState, useCallback, useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Document, Page, pdfjs } from 'react-pdf';
import { Progress } from '@/components/ui/progress';
import type { AxiosProgressEvent } from 'axios';
import Dropzone from '@/components/Dropzone';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  MapPin,
  PenTool,
  Trash2,
  X,
} from 'lucide-react';
import { usePdfTool } from '@/hooks/usePdfTool';
import { postFile, downloadBlob } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function SignPdfTool() {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [placement, setPlacement] = useState<{ x: number; y: number } | null>(null);
  const [pdfSize, setPdfSize] = useState({ width: 0, height: 0 });
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

  const { files, addFiles, removeFile } = usePdfTool({
    endpoint: '/sign-pdf',
    outputFilename: 'Hasil-Tanda-Tangan.pdf',
    maxFiles: 1,
    minFiles: 1,
  });

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  const onDocumentLoadSuccess = ({ numPages: totalPages }: { numPages: number }) => {
    setNumPages(totalPages);
    setPageNumber(1);
  };

  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
    setPlacement(null);
  };

  const handlePdfClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPlacement({ x, y });
    setPdfSize({ width: rect.width, height: rect.height });
  };

  const handleProcess = useCallback(async () => {
    if (!files.length || sigCanvas.current?.isEmpty() || !placement) {
      toast({
        title: 'Data tidak lengkap',
        description: 'Pilih file, tentukan lokasi klik di PDF, dan buat tanda tangan.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);

    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    const canvas = sigCanvas.current?.getCanvas();
    const signatureData = canvas ? canvas.toDataURL('image/png') : '';

    const formData = new FormData();
    formData.append('files', files[0]);
    formData.append('signature', signatureData);
    formData.append('posX', placement.x.toString());
    formData.append('posY', placement.y.toString());
    formData.append('previewWidth', pdfSize.width.toString());
    formData.append('previewHeight', pdfSize.height.toString());
    formData.append('pageNumber', pageNumber.toString());

    const result = await postFile('/sign-pdf', formData, {
      onProgress: (event: AxiosProgressEvent) => {
        if (event.total) setUploadProgress(Math.round((event.loaded / event.total) * 100));
      },
      signal: abortControllerRef.current.signal,
    });

    if (result.error) {
      toast({ title: 'Gagal', description: result.error.message, variant: 'destructive' });
    } else if (result.data) {
      downloadBlob(result.data as Blob, 'Hasil-Tanda-Tangan.pdf');
      toast({ title: 'Berhasil!', description: 'Tanda tangan telah dibubuhkan.' });

      sigCanvas.current?.clear();
      setPlacement(null);
      removeFile(0);
      setPageNumber(1);
    }

    setIsProcessing(false);
    abortControllerRef.current = null;
  }, [files, placement, pdfSize, pageNumber, removeFile, toast]);

  return (
    <Card className="w-full shadow-none border-none bg-transparent">
      <CardContent className="p-0 space-y-6">
        {!files.length && (
          <Dropzone
            onFilesSelected={addFiles}
            accept=".pdf"
            multiple={false}
            maxFiles={1}
            dropzoneText="Seret & Lepaskan PDF untuk ditandatangani di sini"
            hint="lalu pilih posisi halaman dan gambar tanda tangan"
          />
        )}

        {files.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 p-3.5 bg-background/80 border border-border rounded-xl">
              <FileText className="w-5 h-5 text-cobalt shrink-0" aria-hidden="true" />
              <span className="flex-1 min-w-0 text-sm font-medium text-foreground truncate">
                {files[0].name}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeFile(0)}
                disabled={isProcessing}
                aria-label={`Hapus file ${files[0].name}`}
                className="min-h-[44px] min-w-[44px] rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </Button>
            </div>

            <div className="space-y-3">
              <h2 className="font-semibold text-foreground text-base flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cobalt shrink-0" aria-hidden="true" />
                <span>1. Pilih Halaman & Klik Lokasi Tanda Tangan</span>
              </h2>

              <div
                className="relative border border-border rounded-2xl overflow-auto bg-secondary/50 flex justify-center p-3 cursor-crosshair"
                onClick={handlePdfClick}
              >
                <div className="relative inline-block">
                  <Document file={files[0]} onLoadSuccess={onDocumentLoadSuccess}>
                    <Page
                      pageNumber={pageNumber}
                      width={350}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </Document>

                  {placement && (
                    <div
                      className="absolute w-10 h-6 border-2 border-[#2B3AE8] bg-[#2B3AE8]/25 rounded pointer-events-none flex items-center justify-center"
                      style={{ left: placement.x - 20, top: placement.y - 12 }}
                    >
                      <div className="w-1.5 h-1.5 bg-[#2B3AE8] rounded-full" />
                    </div>
                  )}
                </div>
              </div>

              {numPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={pageNumber <= 1 || isProcessing}
                    onClick={() => changePage(-1)}
                    aria-label="Halaman sebelumnya"
                    className="min-h-[44px] min-w-[44px] rounded-xl border-input"
                  >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  </Button>
                  <span className="font-mono text-xs sm:text-sm font-medium text-foreground">
                    Halaman {pageNumber} dari {numPages}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={pageNumber >= numPages || isProcessing}
                    onClick={() => changePage(1)}
                    aria-label="Halaman berikutnya"
                    className="min-h-[44px] min-w-[44px] rounded-xl border-input"
                  >
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </div>
              )}

              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5 mt-1">
                {placement ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-cobalt" aria-hidden="true" />
                    <span>Lokasi terpilih pada halaman {pageNumber}.</span>
                  </>
                ) : (
                  <span>Klik pada pratinjau halaman untuk menentukan posisi tanda tangan.</span>
                )}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <h2 className="font-semibold text-foreground text-base flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-cobalt shrink-0" aria-hidden="true" />
                  <span>2. Goreskan Tanda Tangan</span>
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => sigCanvas.current?.clear()}
                  disabled={isProcessing}
                  className="min-h-[44px] px-3.5 text-xs text-destructive border-border hover:bg-destructive/10 hover:text-destructive rounded-xl"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                  Hapus Goresan
                </Button>
              </div>

              <div className="border-2 border-dashed border-input rounded-2xl bg-white overflow-hidden">
                <SignatureCanvas
                  ref={sigCanvas}
                  penColor="#000000"
                  canvasProps={{
                    className: 'signature-canvas w-full h-36 cursor-crosshair',
                    'aria-label': 'Kanvas tanda tangan digital',
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="space-y-2">
            <Progress value={uploadProgress} className="h-2" />
            <p className="font-mono text-xs text-muted-foreground text-center">
              Menandatangani... {uploadProgress}%
            </p>
          </div>
        )}

        <Button
          type="button"
          className="w-full bg-primary text-primary-foreground hover:opacity-90 min-h-[48px] py-3.5 px-6 rounded-xl font-semibold text-base shadow-sm transition-opacity"
          onClick={handleProcess}
          disabled={isProcessing || files.length === 0 || !placement}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
              Memproses...
            </>
          ) : (
            <>
              <PenTool className="mr-2 h-5 w-5" aria-hidden="true" />
              Tanda Tangani Sekarang
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
