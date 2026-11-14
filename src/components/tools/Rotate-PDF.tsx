import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { AxiosProgressEvent } from 'axios';
import Dropzone from '@/components/Dropzone';
import { FileText, X, Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { usePdfTool } from '@/hooks/usePdfTool';
import { postFile, downloadBlob } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

const ROTATION_OPTIONS = [
  { value: '90', id: 'r1', label: '90 Derajat' },
  { value: '180', id: 'r2', label: '180 Derajat' },
  { value: '270', id: 'r3', label: '270 Derajat' },
];

export default function RotatePdfTool() {
  const [angle, setAngle] = useState<string>('90');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const { files, addFiles, removeFile } = usePdfTool({
    endpoint: '/rotate-pdf',
    outputFilename: 'Hasil-Putar-PDFTools.pdf',
    maxFiles: 1,
    minFiles: 1,
  });

  const handleRotatePdf = useCallback(async () => {
    if (files.length === 0) {
      toast({
        title: 'File tidak ditemukan',
        description: 'Silakan pilih 1 file PDF untuk diputar.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('files', files[0]);
    formData.append('angle', angle);

    const handleProgress = (event: AxiosProgressEvent) => {
      if (event.total) {
        setUploadProgress(Math.round((event.loaded / event.total) * 100));
      } else {
        setUploadProgress(-1);
      }
    };

    const result = await postFile('/rotate-pdf', formData, {
      onProgress: handleProgress,
    });

    if (result.error) {
      toast({
        title: 'Terjadi kesalahan',
        description: result.error.message,
        variant: 'destructive',
      });
    } else if (result.data) {
      downloadBlob(result.data as Blob, 'Hasil-Putar-PDFTools.pdf');
      toast({
        title: 'Berhasil!',
        description: 'File PDF telah diputar.',
      });
      removeFile(0);
    }

    setIsProcessing(false);
    setUploadProgress(0);
  }, [files, angle, removeFile, toast]);

  const processingText = `Memutar... ${uploadProgress}%`;

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
          <div className="space-y-6">
            <div className="space-y-2.5">
              <h2 className="text-base font-semibold text-foreground">
                File yang Akan Diputar
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

            <div className="space-y-3">
              <p className="text-base font-semibold text-foreground">
                Pilih Derajat Putaran
              </p>
              <RadioGroup
                value={angle}
                onValueChange={setAngle}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                disabled={isProcessing}
              >
                {ROTATION_OPTIONS.map((option) => {
                  const isSelected = angle === option.value;
                  return (
                    <Label
                      key={option.id}
                      htmlFor={option.id}
                      className={`min-h-[48px] px-4 py-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                        isSelected
                          ? 'border-cobalt bg-cobalt/[0.08] text-foreground font-semibold'
                          : 'border-border bg-background/70 text-foreground hover:border-foreground/40'
                      }`}
                    >
                      <RadioGroupItem value={option.value} id={option.id} />
                      <span>{option.label}</span>
                    </Label>
                  );
                })}
              </RadioGroup>
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
          onClick={handleRotatePdf}
          disabled={isProcessing || files.length === 0}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
              {processingText}
            </>
          ) : (
            'Putar PDF Sekarang'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
