import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Dropzone from '@/components/Dropzone';
import { FileText, X, Loader2, Info } from 'lucide-react';
import { usePdfTool } from '@/hooks/usePdfTool';
import { postFile, downloadBlob } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

export default function SplitPdfTool() {
  const [ranges, setRanges] = useState('');
  const { toast } = useToast();

  const {
    files,
    isProcessing,
    uploadProgress,
    addFiles,
    removeFile,
  } = usePdfTool({
    endpoint: '/split-pdf',
    outputFilename: 'Hasil-Pisah-PDFTools.zip',
    maxFiles: 1,
    minFiles: 1,
  });

  const handleProcessFiles = useCallback(async () => {
    if (!ranges.trim()) {
      toast({
        title: 'Rentang tidak ditemukan',
        description: 'Silakan masukkan rentang halaman (contoh: 1-3, 5, 8).',
        variant: 'destructive',
      });
      return;
    }

    if (!files.length) return;

    const formData = new FormData();
    formData.append('files', files[0]);
    formData.append('ranges', ranges);

    const result = await postFile('/split-pdf', formData);

    if (result.error) {
      toast({
        title: 'Terjadi kesalahan',
        description: result.error.message,
        variant: 'destructive',
      });
    } else if (result.data) {
      downloadBlob(result.data as Blob, 'Hasil-Pisah-PDFTools.zip');
      toast({
        title: 'Berhasil!',
        description: 'File PDF telah dipisah dan diunduh sebagai ZIP.',
      });
      setRanges('');
      removeFile(0);
    }
  }, [files, ranges, removeFile, toast]);

  const processingText = `Memproses... ${uploadProgress}%`;

  return (
    <Card className="w-full shadow-none border-none bg-transparent">
      <CardContent className="p-0 space-y-6">
        {!files.length && (
          <Dropzone
            onFilesSelected={addFiles}
            accept=".pdf"
            multiple={false}
            maxFiles={1}
            dropzoneText="Seret & Lepaskan 1 file PDF di sini"
          />
        )}

        {files.length > 0 && (
          <div className="space-y-2.5">
            <h2 className="text-base font-semibold text-foreground">
              File yang Akan Dipisah
            </h2>
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
                className="min-h-[44px] min-w-[44px] rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0"
                disabled={isProcessing}
                aria-label={`Hapus file ${files[0].name}`}
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}

        {files.length > 0 && (
          <div className="space-y-2.5">
            <Label htmlFor="split-ranges" className="text-base font-semibold text-foreground">
              Rentang Halaman untuk Dipisah
            </Label>
            <Input
              id="split-ranges"
              type="text"
              placeholder="Contoh: 1-3, 5, 8-10"
              value={ranges}
              onChange={(e) => setRanges(e.target.value)}
              disabled={isProcessing}
              className="min-h-[44px] bg-background border-input rounded-xl"
            />
            <div className="flex items-start gap-2.5 text-xs text-muted-foreground p-3 bg-secondary/60 border border-border rounded-xl">
              <Info className="w-4 h-4 text-cobalt shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                Pisahkan bagian halaman dengan koma (,). Gunakan tanda hubung (-) untuk rentang halaman berkelanjutan.
              </span>
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
          onClick={handleProcessFiles}
          disabled={isProcessing || files.length === 0 || !ranges.trim()}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
              {processingText}
            </>
          ) : (
            'Pisahkan PDF Sekarang'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
