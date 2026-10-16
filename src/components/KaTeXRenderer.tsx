import React from 'react';
import katex from 'katex';

interface KaTeXRendererProps {
  content: string;
  className?: string;
}

export const KaTeXRenderer: React.FC<KaTeXRendererProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Split content into LaTeX math blocks and regular text
  // Math blocks can be $$ ... $$ or $ ... $
  const renderFormattedText = (raw: string) => {
    // Replace markdown bold, bullet points
    const parts = raw.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);

    return parts.map((part, idx) => {
      if (part.startsWith('$$') && part.endsWith('$$') && part.length > 4) {
        const math = part.slice(2, -2).trim();
        try {
          const html = katex.renderToString(math, { displayMode: true, throwOnError: false });
          return (
            <div
              key={idx}
              className="my-3 overflow-x-auto py-2 text-center text-indigo-900 dark:text-indigo-200 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-lg p-2 border border-indigo-100 dark:border-indigo-900/50"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <code key={idx} className="block my-2 p-2 bg-slate-100 dark:bg-slate-800 rounded font-mono text-sm">{math}</code>;
        }
      } else if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
        const math = part.slice(1, -1).trim();
        try {
          const html = katex.renderToString(math, { displayMode: false, throwOnError: false });
          return (
            <span
              key={idx}
              className="inline-block px-1 text-indigo-800 dark:text-indigo-300 font-medium"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <code key={idx} className="px-1 bg-slate-100 dark:bg-slate-800 rounded font-mono text-xs">{math}</code>;
        }
      }

      // Format plain text lines & linebreaks
      return (
        <span key={idx}>
          {part.split('\n').map((line, lIdx) => (
            <React.Fragment key={lIdx}>
              {lIdx > 0 && <br />}
              {line}
            </React.Fragment>
          ))}
        </span>
      );
    });
  };

  return (
    <div className={`prose dark:prose-invert max-w-none text-sm leading-relaxed ${className}`}>
      {renderFormattedText(content)}
    </div>
  );
};
