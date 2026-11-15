import { type ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import Dropzone from '@/components/Dropzone';
import Index from '@/pages/Index';
import ToolPage from '@/pages/ToolPage';

vi.mock('pdfjs-dist', () => ({
  GlobalWorkerOptions: { workerSrc: '' },
  getDocument: vi.fn(),
}));

vi.mock('pdfjs-dist/build/pdf.worker.mjs?url', () => ({
  default: 'mock-pdf-worker.mjs',
}));

vi.mock('react-pdf', () => ({
  pdfjs: {
    version: '5.0.0',
    GlobalWorkerOptions: { workerSrc: '' },
  },
  Document: ({ children }: { children?: ReactNode }) => <div data-testid="mock-pdf-doc">{children}</div>,
  Page: () => <div data-testid="mock-pdf-page" />,
}));

describe('Dropzone', () => {
  it('renders dropzone copy, hint, and formatted accepted file summaries', () => {
    const onFilesSelected = vi.fn();

    const { rerender } = render(
      <Dropzone
        onFilesSelected={onFilesSelected}
        accept=".pdf"
        dropzoneText="Unggah PDF di sini"
        hint="maksimal 1 file"
      />
    );

    expect(screen.getByText('Unggah PDF di sini')).toBeInTheDocument();
    expect(screen.getByText('maksimal 1 file')).toBeInTheDocument();
    expect(screen.getByText('Format: .PDF')).toBeInTheDocument();

    rerender(
      <Dropzone
        onFilesSelected={onFilesSelected}
        accept="image/jpeg,image/png"
        dropzoneText="Unggah Gambar"
        hint="pilih JPG atau PNG"
      />
    );

    expect(screen.getByText('Format: JPG/JPEG, PNG')).toBeInTheDocument();
  });

  it('forwards valid selected files and filters out invalid file types', () => {
    const onFilesSelected = vi.fn();
    const { container } = render(<Dropzone onFilesSelected={onFilesSelected} accept=".pdf" multiple />);

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).not.toBeNull();

    const invalidFile = new File(['hello'], 'notes.txt', { type: 'text/plain' });
    fireEvent.change(input, { target: { files: [invalidFile] } });
    expect(onFilesSelected).not.toHaveBeenCalled();

    const validPdf = new File(['%PDF-1.4'], 'sample.pdf', { type: 'application/pdf' });
    fireEvent.change(input, { target: { files: [validPdf, invalidFile] } });

    expect(onFilesSelected).toHaveBeenCalledTimes(1);
    const passedFiles = Array.from(onFilesSelected.mock.calls[0][0] as FileList);
    expect(passedFiles).toHaveLength(1);
    expect(passedFiles[0].name).toBe('sample.pdf');
  });
});

describe('Index page', () => {
  it('renders all 18 tools and filters by category and search query', () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Kelola Dokumen PDF Anda' })).toBeInTheDocument();
    expect(screen.getByText('Menampilkan 18 dari 18 alat')).toBeInTheDocument();

    // Filter by category tab
    const securityTab = screen.getByRole('tab', { name: /Keamanan & Tanda Tangan \(3\)/i });
    fireEvent.click(securityTab);

    expect(screen.getByText('Menampilkan 3 dari 18 alat')).toBeInTheDocument();
    expect(screen.getByText('Kunci PDF')).toBeInTheDocument();
    expect(screen.getByText('Buka Kunci PDF')).toBeInTheDocument();
    expect(screen.getByText('Tanda Tangan PDF')).toBeInTheDocument();

    // Switch back to all and search for OCR
    fireEvent.click(screen.getByRole('tab', { name: /Semua \(18\)/i }));
    const searchInput = screen.getByLabelText('Cari alat dokumen PDF');
    fireEvent.change(searchInput, { target: { value: 'OCR' } });

    expect(screen.getByText('Menampilkan 1 dari 18 alat')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'OCR PDF' })).toBeInTheDocument();

    // Empty state + reset filters
    fireEvent.change(searchInput, { target: { value: 'tidak-ada-alat-ini' } });
    expect(screen.getByText('Tidak ada alat yang cocok')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Reset Pencarian' }));
    expect(screen.getByText('Menampilkan 18 dari 18 alat')).toBeInTheDocument();
  });
});

describe('ToolPage', () => {
  it('renders merge-pdf workbench and enables submit button only when at least 2 files are added', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/tool/merge-pdf']}>
        <Routes>
          <Route path="/tool/:toolSlug" element={<ToolPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Gabungkan PDF' })).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: 'Gabungkan PDF Sekarang' });
    expect(submitButton).toBeDisabled();

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const pdf1 = new File(['%PDF-1'], 'doc1.pdf', { type: 'application/pdf' });
    const pdf2 = new File(['%PDF-2'], 'doc2.pdf', { type: 'application/pdf' });

    fireEvent.change(fileInput, { target: { files: [pdf1, pdf2] } });

    expect(screen.getByText('doc1.pdf')).toBeInTheDocument();
    expect(screen.getByText('doc2.pdf')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Gabungkan PDF Sekarang' })).toBeEnabled();
  });

  it('renders fallback view for unknown tool slugs', () => {
    render(
      <MemoryRouter initialEntries={['/tool/invalid-slug']}>
        <Routes>
          <Route path="/tool/:toolSlug" element={<ToolPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Alat Dokumen Belum Tersedia' })).toBeInTheDocument();
  });
});
