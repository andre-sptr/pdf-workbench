import { AxiosError, type AxiosResponse } from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';
import apiClient, {
  downloadBlob,
  postFile,
  postFormJson,
  validateFile,
  validatePdfFile,
  validatePdfFiles,
} from '@/lib/api';

describe('api validation helpers', () => {
  it('validates PDF files by MIME type and extension', () => {
    const pdfByMime = new File(['%PDF-1.4'], 'doc.bin', { type: 'application/pdf' });
    const pdfByLowerExt = new File(['%PDF-1.4'], 'report.pdf', { type: '' });
    const pdfByUpperExt = new File(['%PDF-1.4'], 'REPORT.PDF', { type: 'application/octet-stream' });
    const textFile = new File(['hello'], 'notes.txt', { type: 'text/plain' });
    const emptyNameFile = new File(['%PDF-1.4'], '   ', { type: 'application/pdf' });

    expect(validatePdfFile(pdfByMime)).toBe(true);
    expect(validatePdfFile(pdfByLowerExt)).toBe(true);
    expect(validatePdfFile(pdfByUpperExt)).toBe(true);
    expect(validatePdfFile(textFile)).toBe(false);
    expect(validatePdfFile(emptyNameFile)).toBe(false);
  });

  it('validates arbitrary files against allowedTypes', () => {
    const pngFile = new File(['png'], 'image.PNG', { type: 'image/png' });
    const docxFile = new File(['doc'], 'paper.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    expect(validateFile(pngFile)).toBe(true);
    expect(validateFile(pngFile, [])).toBe(true);
    expect(validateFile(pngFile, ['image/png', '.jpg'])).toBe(true);
    expect(validateFile(pngFile, ['.png'])).toBe(true);
    expect(validateFile(pngFile, ['.pdf', 'application/pdf'])).toBe(false);
    expect(validateFile(docxFile, ['.doc', '.docx'])).toBe(true);
  });

  it('partitions valid and invalid PDF files with validatePdfFiles', () => {
    const valid1 = new File(['a'], 'one.pdf', { type: 'application/pdf' });
    const valid2 = new File(['b'], 'two.PDF', { type: '' });
    const invalid1 = new File(['c'], 'image.jpg', { type: 'image/jpeg' });

    const result = validatePdfFiles([valid1, invalid1, valid2]);

    expect(result.valid).toEqual([valid1, valid2]);
    expect(result.invalid).toBe(1);
    expect(result.invalidFiles).toEqual(['image.jpg']);
  });
});

describe('downloadBlob', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates an object URL, triggers anchor download, and revokes the URL', () => {
    const blob = new Blob(['pdf-content'], { type: 'application/pdf' });
    const clickSpy = vi.fn();
    const removeSpy = vi.fn();

    const originalCreateElement = document.createElement.bind(document);
    const createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockImplementation((tagName: string) => {
        const el = originalCreateElement(tagName);
        if (tagName.toLowerCase() === 'a') {
          el.click = clickSpy;
          el.remove = removeSpy;
        }
        return el;
      });

    downloadBlob(blob, 'output.pdf');

    expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(removeSpy).toHaveBeenCalledTimes(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });
});

describe('postFile and postFormJson', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('postFile returns blob data on success', async () => {
    const responseBlob = new Blob(['%PDF'], { type: 'application/pdf' });
    const postSpy = vi
      .spyOn(apiClient, 'post')
      .mockResolvedValue({ data: responseBlob } as AxiosResponse<Blob>);

    const formData = new FormData();
    const result = await postFile<Blob>('/merge-pdf', formData);

    expect(postSpy).toHaveBeenCalledWith(
      '/merge-pdf',
      formData,
      expect.objectContaining({ responseType: 'blob' })
    );
    expect(result).toEqual({ data: responseBlob });
  });

  it('postFile parses JSON error message from AxiosError blob', async () => {
    const errorBlob = new Blob([JSON.stringify({ message: 'File rusak atau tidak valid.' })], {
      type: 'application/json',
    });
    const axiosError = new AxiosError(
      'Request failed',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      { data: errorBlob } as AxiosResponse
    );
    vi.spyOn(apiClient, 'post').mockRejectedValue(axiosError);

    const result = await postFile('/merge-pdf', new FormData());

    expect(result).toEqual({
      error: {
        message: 'File rusak atau tidak valid.',
        code: 'ERR_BAD_REQUEST',
      },
    });
  });

  it('postFormJson returns parsed JSON on success and handles string/object AxiosError responses', async () => {
    vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
      data: { type: 'ocr', markdown: '# Hasil' },
    } as AxiosResponse);

    const okResult = await postFormJson('/ocr-pdf', new FormData());
    expect(okResult).toEqual({ data: { type: 'ocr', markdown: '# Hasil' } });

    const errorWithObject = new AxiosError(
      'Bad Request',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      { data: { message: 'File terlalu besar untuk diproses OCR.' } } as AxiosResponse
    );
    vi.spyOn(apiClient, 'post').mockRejectedValueOnce(errorWithObject);

    const errResult = await postFormJson('/ocr-pdf', new FormData());
    expect(errResult).toEqual({
      error: {
        message: 'File terlalu besar untuk diproses OCR.',
        code: 'ERR_BAD_REQUEST',
      },
    });
  });
});
