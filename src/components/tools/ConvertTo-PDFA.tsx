import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Dropzone from '@/components/Dropzone';
import { Archive, FileText, Loader2, X } from 'lucide-react';
import { usePdfTool } from '@/hooks/usePdfTool';

export default function ConvertToPdfaTool() {
  const {
    files,
    isProcessing,
    uploadProgress,
    addFiles,
    removeFile,
    processFiles,
  } = usePdfTool({
    endpoint: '/pdf-to-pdfa',
    outputFilename: 'Hasil-PDFA-PDFTools.pdf',
    maxFiles: 1,
    minFiles: 1,
  });

  const processingText = `Mengonversi ke PDF/A... ${uploadProgress}%`;

  return (
    <Card className="w-full shadow-none border-none bg-transparent">
      <CardContent className="p-0 space-y-6">
        {!files.length && (
          <Dropzone
            onFilesSelected={addFiles}
            accept=".pdf"
            multiple={false}
            maxFiles={1}
            dropzoneText="Seret & Lepaskan PDF di sini"
            hint="untuk dikonversi ke format arsip standar PDF/A"
          />
        )}

        {files.length > 0 && (
          <div className="space-y-2.5">
            <h2 className="text-base font-semibold text-foreground">
              File yang Akan Dikonversi ke PDF/A
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
          disabled={isProcessing || files.length === 0}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
              {processingText}
            </>
          ) : (
            <>
              <Archive className="mr-2 h-5 w-5" aria-hidden="true" />
              Konversi ke PDF/A Sekarang
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
