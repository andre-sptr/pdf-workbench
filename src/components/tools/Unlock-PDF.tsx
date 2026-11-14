import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AxiosProgressEvent } from 'axios';
import Dropzone from '@/components/Dropzone';
import { FileText, X, Loader2, LockOpen, Eye, EyeOff } from 'lucide-react';
import { postFile, downloadBlob, validatePdfFile } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

export default function UnlockPdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const addFiles = useCallback(
    (newFiles: FileList | File[] | null) => {
      if (!newFiles || newFiles.length === 0) return;
      const fileArray = Array.from(newFiles);
      const validFiles = fileArray.filter(validatePdfFile);
      const invalidCount = fileArray.length - validFiles.length;

      if (invalidCount > 0) {
        toast({
          title: 'File tidak valid',
          description: `${invalidCount} file bukan PDF dan telah diabaikan.`,
          variant: 'destructive',
        });
      }

      if (validFiles.length === 0) {
        toast({
          title: 'File tidak valid',
          description: 'Tidak ada file PDF yang dipilih.',
          variant: 'destructive',
        });
        return;
      }

      setFiles(validFiles.slice(0, 1));
    },
    [toast]
  );

  const removeFile = useCallback(() => {
    setFiles([]);
  }, []);

  const processFiles = useCallback(async () => {
    if (files.length === 0) {
      toast({
        title: 'Validasi gagal',
        description: 'Silakan pilih 1 file PDF.',
        variant: 'destructive',
      });
      return;
    }

    if (!password || password.trim() === '') {
      toast({
        title: 'Password kosong',
        description: 'Silakan masukkan password untuk membuka PDF.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const formData = new FormData();
    formData.append('files', files[0]);
    formData.append('password', password);

    const handleProgress = (event: AxiosProgressEvent) => {
      if (event.total) {
        setUploadProgress(Math.round((event.loaded / event.total) * 100));
      } else {
        setUploadProgress(-1);
      }
    };

    const result = await postFile('/unlock-pdf', formData, {
      onProgress: handleProgress,
      signal: abortControllerRef.current.signal,
    });

    if (result.error) {
      toast({
        title: 'Terjadi kesalahan',
        description: result.error.message,
        variant: 'destructive',
      });
    } else if (result.data) {
      downloadBlob(result.data as Blob, 'Hasil-Terbuka-PDFTools.pdf');
      toast({
        title: 'Berhasil!',
        description: 'Password PDF telah dihapus.',
      });
      setFiles([]);
      setPassword('');
    }

    setIsProcessing(false);
    setUploadProgress(0);
    abortControllerRef.current = null;
  }, [files, password, toast]);

  const processingText = `Membuka kunci... ${uploadProgress}%`;

  return (
    <Card className="w-full shadow-none border-none bg-transparent">
      <CardContent className="p-0 space-y-6">
        {!files.length && (
          <Dropzone
            onFilesSelected={addFiles}
            accept=".pdf"
            multiple={false}
            maxFiles={1}
            dropzoneText="Seret & Lepaskan PDF terkunci di sini"
            hint="untuk menghapus proteksi password"
          />
        )}

        {files.length > 0 && (
          <div className="space-y-2.5">
            <h2 className="text-base font-semibold text-foreground">
              File yang Akan Dibuka Kuncinya
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
                onClick={removeFile}
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
            <Label htmlFor="unlock-password" className="text-base font-semibold text-foreground">
              Password PDF Saat Ini
            </Label>
            <div className="relative">
              <Input
                id="unlock-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan password PDF saat ini"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isProcessing}
                className="min-h-[44px] pr-12 bg-background border-input rounded-xl"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                className="absolute right-0 top-0 min-h-[44px] min-w-[44px] rounded-r-xl text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Masukkan password asli dokumen agar kunci dapat dilepas permanen.
            </p>
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
          onClick={processFiles}
          disabled={isProcessing || files.length === 0 || !password.trim()}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
              {processingText}
            </>
          ) : (
            <>
              <LockOpen className="mr-2 h-5 w-5" aria-hidden="true" />
              Buka Kunci PDF Sekarang
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
