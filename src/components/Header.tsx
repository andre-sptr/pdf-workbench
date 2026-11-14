import { useEffect, useRef, useState } from 'react';
import { FileText, Menu, Moon, Sun, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/', label: 'Beranda' },
  { path: '/about', label: 'Tentang' },
  { path: '/faq', label: 'FAQ' },
  { path: '/contact', label: 'Kontak' },
];

const RULER_TICKS = Array.from({ length: 21 }, (_, index) => index);

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const location = useLocation();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.classList.toggle('dark', nextDark);
    try {
      localStorage.setItem('pdf-workbench-theme', nextDark ? 'dark' : 'light');
    } catch {
      // Ignore storage write restriction cleanly
    }
  };

  const getDesktopLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `min-h-[44px] inline-flex items-center px-3.5 rounded-lg text-sm transition-colors ${
      isActive
        ? 'bg-secondary text-foreground font-semibold'
        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60 font-medium'
    }`;
  };

  const getMobileLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `min-h-[44px] w-full flex items-center justify-between px-4 rounded-xl text-sm transition-colors ${
      isActive
        ? 'bg-primary text-primary-foreground font-semibold'
        : 'bg-card text-foreground border border-border hover:border-foreground/40 font-medium'
    }`;
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2.5 focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        Langsung ke konten utama
      </a>

      {/* Hole Money Left-Edge Document Scale Indicator */}
      <div
        aria-hidden="true"
        className="fixed left-0 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-2.5 pl-2 pointer-events-none z-20"
      >
        {RULER_TICKS.map((tick) => {
          const isCenter = tick === 10;
          const isMajor = tick === 5 || tick === 15;
          return (
            <span
              key={tick}
              className={
                isCenter
                  ? 'block w-4 h-[2px] bg-cobalt'
                  : isMajor
                    ? 'block w-3 h-[1px] bg-foreground/45'
                    : 'block w-2 h-[1px] bg-foreground/20'
              }
            />
          );
        })}
      </div>

      <header className="sticky top-0 z-40 bg-background/95 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="min-h-[44px] inline-flex items-center gap-3 group rounded-lg pr-2"
          >
            <div className="w-9 h-9 rounded-xl bg-[#2B3AE8] text-white flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_10px_rgba(43,58,232,0.25)] border border-[#1E2BC4] transition-transform duration-200 group-hover:scale-105">
              <FileText className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="flex items-baseline gap-2.5">
              <span className="text-lg font-bold tracking-tight text-foreground">
                PDF Tools
              </span>
              <span className="hidden sm:inline-block font-mono text-[11px] uppercase tracking-wider text-muted-foreground border border-border px-1.5 py-0.5 rounded">
                18 alat
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <nav aria-label="Navigasi utama" className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                  className={getDesktopLinkClass(item.path)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <button
              type="button"
              onClick={toggleTheme}
              aria-pressed={isDark}
              className="min-h-[44px] px-3 sm:px-3.5 rounded-lg border border-border bg-card hover:border-foreground/40 text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-cobalt" aria-hidden="true" />
                  <span className="hidden sm:inline">Mode terang</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-foreground" aria-hidden="true" />
                  <span className="hidden sm:inline">Mode gelap</span>
                </>
              )}
            </button>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav-drawer"
              className="md:hidden min-h-[44px] px-3 rounded-lg border border-border bg-card text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors hover:border-foreground/40"
            >
              {isMenuOpen ? (
                <>
                  <X className="w-4 h-4" aria-hidden="true" />
                  <span>Tutup</span>
                </>
              ) : (
                <>
                  <Menu className="w-4 h-4" aria-hidden="true" />
                  <span>Menu</span>
                </>
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav
            id="mobile-nav-drawer"
            aria-label="Navigasi seluler"
            className="md:hidden border-t border-border bg-background px-4 py-4 space-y-2"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                aria-current={location.pathname === item.path ? 'page' : undefined}
                onClick={() => setIsMenuOpen(false)}
                className={getMobileLinkClass(item.path)}
              >
                <span>{item.label}</span>
                {location.pathname === item.path && (
                  <span className="font-mono text-[11px] uppercase">Aktif</span>
                )}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/60">
      <div className="container mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">PDF Tools</span>
          <span>
            <a
              href="https://andresptr.site"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center text-foreground underline underline-offset-4 hover:text-cobalt transition-colors"
            >
              &copy; {new Date().getFullYear()} Andre Saputra
            </a>
          </span>
        </div>

        <nav aria-label="Navigasi footer" className="flex flex-wrap items-center gap-1 sm:gap-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="min-h-[44px] inline-flex items-center px-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
