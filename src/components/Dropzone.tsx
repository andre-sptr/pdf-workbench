import {
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from 'react';
import { UploadCloud } from 'lucide-react';

export interface DropzoneProps {
  onFilesSelected: (files: FileList | File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  disabled?: boolean;
  hint?: string;
  dropzoneText?: string;
}

const isValidFileType = (file: File, accept: string): boolean => {
  if (!accept || accept === '*' || accept === '*/*') return true;

  const extensions = accept.split(',').filter((ext) => ext.trim().startsWith('.'));
  const mimeTypes = accept.split(',').filter((ext) => !ext.trim().startsWith('.'));

  if (extensions.length === 0 && mimeTypes.length === 0) return false;

  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  for (const ext of extensions) {
    const extClean = ext.trim().toLowerCase();
    if (fileName.endsWith(extClean)) return true;
  }

  for (const mime of mimeTypes) {
    const mimeClean = mime.trim().toLowerCase();
    if (fileType === mimeClean || fileType === `${mimeClean}/*`) return true;
  }

  return false;
};

const filterValidFiles = (
  files: FileList | File[],
  accept: string,
  maxFiles: number
): File[] => {
  const fileArray = Array.from(files);
  let validFiles = fileArray.filter((file) => isValidFileType(file, accept));

  if (validFiles.length > maxFiles) {
    validFiles = validFiles.slice(0, maxFiles);
  }

  return validFiles;
};

const formatAcceptedSummary = (accept: string): string => {
  if (!accept || accept === '*' || accept === '*/*') return 'Semua file';
  const parts = accept
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      if (part === 'image/jpeg') return 'JPG/JPEG';
      if (part === 'image/png') return 'PNG';
      if (part.startsWith('.')) return part.toUpperCase();
      if (part.includes('wordprocessingml')) return '.DOCX';
      if (part === 'application/msword') return '.DOC';
      if (part.includes('spreadsheetml')) return '.XLSX';
      if (part === 'application/vnd.ms-excel') return '.XLS';
      if (part.includes('presentationml')) return '.PPTX';
      if (part === 'application/vnd.ms-powerpoint') return '.PPT';
      return part;
    });

  return Array.from(new Set(parts)).join(', ');
};

export default function Dropzone({
  onFilesSelected,
  accept = '.pdf',
  multiple = false,
  maxFiles = 10,
  disabled = false,
  hint = 'atau tekan untuk memilih file dari perangkat',
  dropzoneText = 'Seret & Lepaskan file PDF di sini',
}: DropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback(
    (e: DragEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled]
  );

  const handleDragOver = useCallback(
    (e: DragEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled && !isDragging) {
        setIsDragging(true);
      }
    },
    [disabled, isDragging]
  );

  const handleDragLeave = useCallback((e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const { files } = e.dataTransfer;
      if (files && files.length > 0) {
        const validFiles = filterValidFiles(files, accept, maxFiles);
        if (validFiles.length > 0) {
          const dataTransfer = new DataTransfer();
          validFiles.forEach((file) => dataTransfer.items.add(file));
          onFilesSelected(dataTransfer.files);
        }
      }
    },
    [disabled, maxFiles, onFilesSelected, accept]
  );

  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target;
      if (files && files.length > 0) {
        const validFiles = filterValidFiles(files, accept, maxFiles);
        e.target.value = '';
        if (validFiles.length > 0) {
          const dataTransfer = new DataTransfer();
          validFiles.forEach((file) => dataTransfer.items.add(file));
          onFilesSelected(dataTransfer.files);
        }
      }
    },
    [onFilesSelected, accept, maxFiles]
  );

  const acceptedSummary = formatAcceptedSummary(accept);

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        disabled={disabled}
        aria-label={
          disabled ? 'Area unggah file dinonaktifkan' : `${dropzoneText}, ${hint}`
        }
        className={`w-full min-h-[220px] border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center transition-colors flex flex-col justify-center items-center gap-3 ${
          disabled
            ? 'border-border bg-secondary/40 opacity-50 cursor-not-allowed'
            : isDragging
              ? 'border-cobalt bg-cobalt/[0.07]'
              : 'border-input bg-background/70 hover:border-cobalt hover:bg-cobalt/[0.04]'
        }`}
      >
        <div
          className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-colors ${
            isDragging
              ? 'bg-cobalt text-cobalt-foreground border-cobalt'
              : 'bg-card border-border text-cobalt'
          }`}
        >
          <UploadCloud className="w-7 h-7" aria-hidden="true" />
        </div>

        <div className="space-y-1">
          <p className="text-base sm:text-lg font-semibold text-foreground">
            {dropzoneText}
          </p>
          <p className="text-sm text-muted-foreground">{hint}</p>
        </div>

        <span className="mt-1 inline-flex items-center px-3 py-1 rounded-md border border-border bg-card font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          Format: {acceptedSummary}
        </span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}
