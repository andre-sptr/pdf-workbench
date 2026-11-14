import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Dropzone from '@/components/Dropzone';
import { ArrowDown, ArrowUp, FileText, GripVertical, Loader2, X } from 'lucide-react';
import { usePdfTool } from '@/hooks/usePdfTool';

export default function MergePdfTool() {
  const {
    files,
    isProcessing,
    uploadProgress,
    addFiles,
    removeFile,
    reorderFiles,
    processFiles,
  } = usePdfTool({
    endpoint: '/merge-pdf',
    outputFilename: 'Hasil-Gabungan-PDFTools.pdf',
    maxFiles: 20,
    minFiles: 2,
  });

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (targetIndex: number) => {
      if (draggedIndex !== null) {
        reorderFiles(draggedIndex, targetIndex);
        setDraggedIndex(null);
      }
    },
    [draggedIndex, reorderFiles]
  );

  const processingText = `Menggabungkan... ${uploadProgress}%`;

  return (
    <Card className="w-full shadow-none border-none bg-transparent">
      <CardContent className="p-0 space-y-6">
        {!files.length && (
          <Dropzone
            onFilesSelected={addFiles}
            accept=".pdf"
            multiple
            maxFiles={20}
            dropzoneText="Seret & Lepaskan beberapa file PDF di sini"
            hint="minimal 2 file untuk digabungkan"
          />
        )}

        {files.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-foreground">
                Urutan File yang Akan Digabungkan ({files.length}/20)
              </h2>
              <DropzoneCompactTrigger
                disabled={isProcessing || files.length >= 20}
                onSelect={addFiles}
              />
            </div>

            <ul className="space-y-2.5">
              {files.map((file, index) => (
                <li
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-2 sm:gap-3 p-3 bg-background/80 border border-border rounded-xl transition-opacity"
                  draggable={!isProcessing}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                  style={{ opacity: draggedIndex === index ? 0.5 : 1 }}
                >
                  <GripVertical
                    className="w-5 h-5 text-muted-foreground cursor-move shrink-0 hidden sm:block"
                    aria-hidden="true"
                  />
                  <span className="font-mono text-xs text-muted-foreground w-6 shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <FileText className="w-5 h-5 text-cobalt shrink-0" aria-hidden="true" />
                  <span className="flex-1 min-w-0 text-sm font-medium text-foreground truncate">
                    {file.name}
                  </span>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => reorderFiles(index, index - 1)}
                      disabled={isProcessing || index === 0}
                      aria-label={`Pindahkan ${file.name} ke atas`}
                      className="min-h-[44px] min-w-[44px] rounded-lg border-border"
                    >
                      <ArrowUp className="w-4 h-4" aria-hidden="true" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => reorderFiles(index, index + 1)}
                      disabled={isProcessing || index === files.length - 1}
                      aria-label={`Pindahkan ${file.name} ke bawah`}
                      className="min-h-[44px] min-w-[44px] rounded-lg border-border"
                    >
                      <ArrowDown className="w-4 h-4" aria-hidden="true" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                      disabled={isProcessing}
                      aria-label={`Hapus file ${file.name}`}
                      className="min-h-[44px] min-w-[44px] rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
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
          disabled={isProcessing || files.length < 2}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
              {processingText}
            </>
          ) : (
            'Gabungkan PDF Sekarang'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

function DropzoneCompactTrigger({
  onSelect,
  disabled,
}: {
  onSelect: (files: FileList | File[]) => void;
  disabled: boolean;
}) {
  return (
    <label className="min-h-[44px] inline-flex items-center px-3.5 py-2 rounded-lg border border-input bg-card hover:border-foreground/50 text-xs font-medium text-foreground cursor-pointer transition-colors">
      <span>+ Tambah File PDF</span>
      <input
        type="file"
        accept=".pdf"
        multiple
        disabled={disabled}
        className="sr-only"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onSelect(e.target.files);
            e.target.value = '';
          }
        }}
      />
    </label>
  );
}
