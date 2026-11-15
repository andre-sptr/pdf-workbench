import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

if (typeof globalThis.DOMMatrix === 'undefined') {
  class DOMMatrixStub {
    a = 1;
    b = 0;
    c = 0;
    d = 1;
    e = 0;
    f = 0;
    m11 = 1;
    m12 = 0;
    m21 = 0;
    m22 = 1;
    m41 = 0;
    m42 = 0;
    is2D = true;
    isIdentity = true;

    constructor(_init?: string | number[]) {}

    multiply() {
      return new DOMMatrixStub();
    }
    translate() {
      return new DOMMatrixStub();
    }
    scale() {
      return new DOMMatrixStub();
    }
    rotate() {
      return new DOMMatrixStub();
    }
    inverse() {
      return new DOMMatrixStub();
    }
    transformPoint(point?: { x?: number; y?: number; z?: number; w?: number }) {
      return { x: point?.x ?? 0, y: point?.y ?? 0, z: point?.z ?? 0, w: point?.w ?? 1 };
    }
  }

  (globalThis as unknown as { DOMMatrix: typeof DOMMatrixStub }).DOMMatrix = DOMMatrixStub;
}

if (typeof globalThis.ResizeObserver === 'undefined') {
  class ResizeObserverStub {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }

  (globalThis as unknown as { ResizeObserver: typeof ResizeObserverStub }).ResizeObserver =
    ResizeObserverStub;
}

if (typeof window !== 'undefined') {
  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  }

  window.scrollTo = vi.fn();

  URL.createObjectURL = vi.fn(() => 'blob:mock-url');
  URL.revokeObjectURL = vi.fn();
}

if (typeof globalThis.DataTransfer === 'undefined') {
  class DataTransferStub {
    private _files: File[] = [];

    items = {
      add: (file: File) => {
        this._files.push(file);
      },
    };

    get files(): FileList {
      const list = [...this._files];
      return Object.assign(list, {
        item: (index: number) => list[index] ?? null,
      }) as unknown as FileList;
    }
  }

  (globalThis as unknown as { DataTransfer: typeof DataTransferStub }).DataTransfer =
    DataTransferStub;
}

afterEach(() => {
  cleanup();
});
