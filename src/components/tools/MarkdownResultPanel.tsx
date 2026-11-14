import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Check, Copy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';

interface MarkdownResultPanelProps {
  title: string;
  markdown: string;
  onReset: () => void;
}

export default function MarkdownResultPanel({
  title,
  markdown,
  onReset,
}: MarkdownResultPanelProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      toast({
        title: 'Disalin',
        description: 'Output berhasil disalin ke clipboard.',
      });
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast({
        title: 'Gagal menyalin',
        description: 'Browser tidak mengizinkan akses clipboard.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-border bg-background/60 overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border bg-card p-4 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-cobalt">
            HASIL PEMROSESAN
          </span>
          <h3 className="text-base sm:text-lg font-semibold text-foreground">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCopy}
            className="min-h-[44px] px-4 rounded-xl border-input"
          >
            {copied ? (
              <Check className="mr-2 h-4 w-4 text-cobalt" aria-hidden="true" />
            ) : (
              <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            {copied ? 'Tersalin' : 'Salin Teks'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            className="min-h-[44px] px-4 rounded-xl border-input"
          >
            <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
            Reset
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[520px] bg-card">
        <div className="p-5 sm:p-6">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="mb-4 font-display text-2xl sm:text-3xl font-normal text-foreground">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="mb-3 mt-6 font-display text-xl sm:text-2xl font-normal text-foreground">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="mb-2 mt-5 text-lg font-semibold text-foreground">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="mb-4 leading-7 text-foreground/90 max-w-[70ch]">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="mb-4 ml-5 list-disc space-y-2 text-foreground/90">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="mb-4 ml-5 list-decimal space-y-2 text-foreground/90">{children}</ol>
              ),
              li: ({ children }) => <li className="pl-1 leading-7">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className="mb-4 border-l-4 border-cobalt pl-4 text-muted-foreground">
                  {children}
                </blockquote>
              ),
              table: ({ children }) => (
                <div className="mb-4 overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">{children}</table>
                </div>
              ),
              th: ({ children }) => (
                <th className="border border-border bg-secondary px-3 py-2 font-semibold text-foreground">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-border px-3 py-2 text-foreground/90">{children}</td>
              ),
              code: ({ children }) => (
                <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-sm text-foreground">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="mb-4 overflow-x-auto rounded-xl border border-border bg-secondary p-4 font-mono text-sm text-foreground">
                  {children}
                </pre>
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </ScrollArea>
    </div>
  );
}
