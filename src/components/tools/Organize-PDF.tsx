import { useState, useCallback, DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { AxiosProgressEvent } from 'axios';
import Dropzone from '@/components/Dropzone';
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  GripVertical,
  Loader2,
  Trash2,
} from 'lucide-react';
import { postFile, downloadBlob } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function OrganizePdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [thumbnails, setThumbnails] = useState<Record<number, string>>({});
  const [isGeneratingThumbs, setIsGeneratingThumbs] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const generateThumbnails = async (selectedFile: File) => {
    setIsGeneratingThumbs(true);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;

      setPageOrder(Array.from({ length: numPages }, (_, i) => i));

      const newThumbnails: Record<number, string> = {};

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({ canvasContext: context, viewport: viewport, canvas: canvas }).promise;
          newThumbnails[i - 1] = canvas.toDataURL('image/jpeg', 0.8);
        }
      }
      setThumbnails(newThumbnails);
    } catch (error) {
      console.error('Gagal membuat thumbnail:', error);
      toast({
        title: 'Gagal membaca PDF',
        description: 'File mungkin rusak atau dilindungi kata sandi.',
        variant: 'destructive',
      });
      setFile(null);
    } finally {
      setIsGeneratingThumbs(false);
    }
  };

  const handleFileSelect = async (newFiles: FileList | File[] | null) => {
    if (!newFiles || newFiles.length === 0) return;

    const selectedFile = newFiles[0];
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      toast({
        title: 'Format tidak didukung',
        description: 'Harap unggah file PDF.',
        variant: 'destructive',
      });
      return;
    }

    setFile(selectedFile);
    await generateThumbnails(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setPageOrder([]);
    setThumbnails({});
  };

  const removePage = (indexToRemove: number) => {
    if (pageOrder.length <= 1) {
      toast({
        title: 'Gagal',
        description: 'PDF minimal harus memiliki 1 halaman.',
        variant: 'destructive',
      });
      return;
    }
    setPageOrder(pageOrder.filter((_, i) => i !== indexToRemove));
  };

  const movePage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= pageOrder.length) return;
    const newOrder = [...pageOrder];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);
    setPageOrder(newOrder);
  };

  const handleDragStart = (index: number) => setDraggedIndex(index);
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();
  const handleDrop = (index: number) => {
    if (draggedIndex === null) return;
    movePage(draggedIndex, index);
    setDraggedIndex(null);
  };

  const handleProcess = useCallback(async () => {
    if (!file || pageOrder.length === 0) return;

    setIsProcessing(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('pageOrder', JSON.stringify(pageOrder));

    const handleProgress = (event: AxiosProgressEvent) => {
      if (event.total) {
        setUploadProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    const result = await postFile('/organize-pdf', formData, {
      onProgress: handleProgress,
    });

    if (result.error) {
      toast({
        title: 'Terjadi kesalahan',
        description: result.error.message,
        variant: 'destructive',
      });
    } else if (result.data) {
      downloadBlob(result.data as Blob, 'Hasil-Atur-PDFTools.pdf');
      toast({
        title: 'Berhasil!',
        description: 'Halaman PDF telah berhasil diatur ulang.',
      });
      removeFile();
    }

    setIsProcessing(false);
    setUploadProgress(0);
  }, [file, pageOrder, toast]);

  const processingText = `Memproses... ${uploadProgress}%`;

  return (
    <Card className="w-full shadow-none border-none bg-transparent">
      <CardContent className="p-0 space-y-6">
        {!file && (
          <Dropzone
            onFilesSelected={handleFileSelect}
            accept=".pdf"
            multiple={false}
            dropzoneText="Seret & Lepaskan file PDF di sini"
            hint="untuk mengatur ulang atau menghapus halaman"
          />
        )}

        {file && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-background/80 p-3.5 rounded-xl border border-border">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-5 h-5 text-cobalt shrink-0" aria-hidden="true" />
                <span className="font-medium text-sm text-foreground truncate">
                  {file.name}
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={removeFile}
                disabled={isProcessing}
                className="min-h-[44px] px-4 rounded-xl border-input shrink-0"
              >
                Ganti File
              </Button>
            </div>

            <div className="space-y-3">
              <h2 className="text-base font-semibold text-foreground">
                Geser atau gunakan tombol panah untuk mengatur urutan halaman ({pageOrder.length} halaman):
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {pageOrder.map((originalPageIndex, currentIndex) => (
                  <div
                    key={`page-${originalPageIndex}-${currentIndex}`}
                    draggable={!isProcessing}
                    onDragStart={() => handleDragStart(currentIndex)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(currentIndex)}
                    className="group bg-background border border-border hover:border-cobalt rounded-xl overflow-hidden flex flex-col cursor-move transition-colors"
                  >
                    <div className="relative aspect-[1/1.35] bg-secondary/40 flex items-center justify-center overflow-hidden">
                      {isGeneratingThumbs && !thumbnails[originalPageIndex] ? (
                        <div className="flex flex-col items-center justify-center w-full h-full">
                          <Loader2 className="w-6 h-6 text-cobalt animate-spin mb-2" aria-hidden="true" />
                          <span className="text-xs text-muted-foreground">Memuat halaman...</span>
                        </div>
                      ) : (
                        thumbnails[originalPageIndex] && (
                          <img
                            src={thumbnails[originalPageIndex]}
                            alt={`Pratinjau halaman ${originalPageIndex + 1}`}
                            width={200}
                            height={270}
                            className="w-full h-full object-contain"
                          />
                        )
                      )}

                      <div className="hidden sm:flex absolute top-2 left-2 w-8 h-8 rounded-lg bg-card/90 border border-border items-center justify-center pointer-events-none">
                        <GripVertical className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                      </div>

                      <button
                        type="button"
                        onClick={() => removePage(currentIndex)}
                        disabled={isProcessing}
                        aria-label={`Hapus halaman ${originalPageIndex + 1}`}
                        className="absolute top-2 right-2 min-h-[44px] min-w-[44px] flex items-center justify-center bg-destructive text-destructive-foreground rounded-xl shadow-sm hover:opacity-90 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="p-2 bg-card border-t border-border flex items-center justify-between gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        disabled={isProcessing || currentIndex === 0}
                        onClick={() => movePage(currentIndex, currentIndex - 1)}
                        aria-label={`Geser halaman ${originalPageIndex + 1} ke kiri`}
                        className="min-h-[44px] min-w-[44px] rounded-lg"
                      >
                        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                      </Button>

                      <span className="font-mono text-xs font-medium text-foreground">
                        Hal. {originalPageIndex + 1}
                      </span>

                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        disabled={isProcessing || currentIndex === pageOrder.length - 1}
                        onClick={() => movePage(currentIndex, currentIndex + 1)}
                        aria-label={`Geser halaman ${originalPageIndex + 1} ke kanan`}
                        className="min-h-[44px] min-w-[44px] rounded-lg"
                      >
                        <ChevronRight className="w-4 h-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="space-y-2">
            <Progress value={uploadProgress} className="h-2" />
            <p className="font-mono text-xs text-muted-foreground text-center">
              {processingText}
            </p>
          </div>
        )}

        <Button
          type="button"
          className="w-full bg-primary text-primary-foreground hover:opacity-90 min-h-[48px] py-3.5 px-6 rounded-xl font-semibold text-base shadow-sm transition-opacity"
          onClick={handleProcess}
          disabled={isProcessing || !file || pageOrder.length === 0 || isGeneratingThumbs}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
              {processingText}
            </>
          ) : (
            'Simpan & Unduh PDF'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
