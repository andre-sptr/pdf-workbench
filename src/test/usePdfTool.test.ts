import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePdfTool } from '@/hooks/usePdfTool';
import * as apiModule from '@/lib/api';

const toastMock = vi.fn();

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: toastMock }),
}));

function makeFile(name: string, sizeBytes = 128, type = 'application/pdf'): File {
  const content = new Uint8Array(sizeBytes);
  return new File([content], name, { type });
}

describe('usePdfTool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds valid PDF files, filters invalid formats, deduplicates names, and enforces limits', () => {
    const { result } = renderHook(() =>
      usePdfTool({
        endpoint: '/merge-pdf',
        outputFilename: 'merged.pdf',
        maxFiles: 2,
        minFiles: 2,
        maxFileSize: 500,
      })
    );

    const valid1 = makeFile('a.pdf', 100);
    const valid2 = makeFile('b.pdf', 200);
    const valid3 = makeFile('c.pdf', 100);
    const tooLarge = makeFile('huge.pdf', 1000);
    const invalidTxt = makeFile('notes.txt', 50, 'text/plain');

    act(() => {
      result.current.addFiles([valid1, invalidTxt, tooLarge]);
    });
    expect(result.current.files).toEqual([valid1]);

    // Adding duplicate a.pdf plus b.pdf and c.pdf should ignore duplicate and cap at maxFiles=2
    act(() => {
      result.current.addFiles([makeFile('a.pdf', 100), valid2, valid3]);
    });
    expect(result.current.files).toEqual([valid1, valid2]);
  });

  it('supports removeFile, reorderFiles (with bounds checks), and reset', () => {
    const { result } = renderHook(() =>
      usePdfTool({
        endpoint: '/merge-pdf',
        outputFilename: 'merged.pdf',
      })
    );

    const f1 = makeFile('1.pdf');
    const f2 = makeFile('2.pdf');
    const f3 = makeFile('3.pdf');

    act(() => {
      result.current.addFiles([f1, f2, f3]);
    });
    expect(result.current.files.map((f) => f.name)).toEqual(['1.pdf', '2.pdf', '3.pdf']);

    act(() => {
      result.current.reorderFiles(0, 2);
    });
    expect(result.current.files.map((f) => f.name)).toEqual(['2.pdf', '3.pdf', '1.pdf']);

    // Out-of-bounds indices should be no-ops
    act(() => {
      result.current.reorderFiles(-1, 1);
      result.current.reorderFiles(0, 10);
    });
    expect(result.current.files.map((f) => f.name)).toEqual(['2.pdf', '3.pdf', '1.pdf']);

    act(() => {
      result.current.removeFile(1);
    });
    expect(result.current.files.map((f) => f.name)).toEqual(['2.pdf', '1.pdf']);

    act(() => {
      result.current.reset();
    });
    expect(result.current.files).toEqual([]);
    expect(result.current.uploadProgress).toBe(0);
  });

  it('blocks processFiles below minFiles and posts/downloads when valid', async () => {
    const postFileSpy = vi.spyOn(apiModule, 'postFile');
    const downloadBlobSpy = vi.spyOn(apiModule, 'downloadBlob').mockImplementation(() => {});

    const { result } = renderHook(() =>
      usePdfTool({
        endpoint: '/merge-pdf',
        outputFilename: 'Hasil-Gabungan.pdf',
        minFiles: 2,
      })
    );

    const f1 = makeFile('one.pdf');
    const f2 = makeFile('two.pdf');

    act(() => {
      result.current.addFiles([f1]);
    });

    await act(async () => {
      await result.current.processFiles();
    });

    expect(postFileSpy).not.toHaveBeenCalled();
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Validasi gagal',
        variant: 'destructive',
      })
    );

    const outputBlob = new Blob(['%PDF-merged'], { type: 'application/pdf' });
    postFileSpy.mockResolvedValueOnce({ data: outputBlob });

    act(() => {
      result.current.addFiles([f2]);
    });

    await act(async () => {
      await result.current.processFiles();
    });

    expect(postFileSpy).toHaveBeenCalledWith(
      '/merge-pdf',
      expect.any(FormData),
      expect.objectContaining({
        onProgress: expect.any(Function),
        signal: expect.any(AbortSignal),
      })
    );
    expect(downloadBlobSpy).toHaveBeenCalledWith(outputBlob, 'Hasil-Gabungan.pdf');
    expect(result.current.files).toEqual([]);
    expect(result.current.isProcessing).toBe(false);
  });
});
