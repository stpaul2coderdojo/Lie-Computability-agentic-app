/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  block?: boolean;
  className?: string;
  inline?: boolean;
}

export const MathView: React.FC<MathViewProps> = ({
  math,
  block = false,
  inline = false,
  className = ''
}) => {
  const renderedHtml = useMemo(() => {
    try {
      if (!math) return '';
      // Clean up common math formatting
      let cleanMath = math.trim();
      if (cleanMath.startsWith('$$') && cleanMath.endsWith('$$')) {
        cleanMath = cleanMath.slice(2, -2).trim();
      } else if (cleanMath.startsWith('$') && cleanMath.endsWith('$')) {
        cleanMath = cleanMath.slice(1, -1).trim();
      }

      return katex.renderToString(cleanMath, {
        displayMode: block && !inline,
        throwOnError: false,
        output: 'htmlAndMathml',
        trust: true
      });
    } catch (e: any) {
      console.warn('KaTeX render error:', e);
      return `<span class="text-rose-400 font-mono">${math}</span>`;
    }
  }, [math, block, inline]);

  if (block && !inline) {
    return (
      <div
        className={`math-block overflow-x-auto py-2 px-3 my-1.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-slate-100 font-serif ${className}`}
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
    );
  }

  return (
    <span
      className={`math-inline text-slate-100 ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};

/**
 * Component to pretty print text that contains mixed Markdown and LaTeX equations ($...$ or $$...$$).
 */
export const FormattedMath: React.FC<{ text: string; className?: string }> = ({
  text,
  className = ''
}) => {
  const parts = useMemo(() => {
    if (!text) return [];
    
    // Split by $$...$$ or $...$ or LaTeX equations
    const regex = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$|\\begin\{equation\}[\s\S]*?\\end\{equation\}|\\begin\{align\*?\}[\s\S]*?\\end\{align\*?\})/g;
    const tokens: Array<{ type: 'text' | 'math' | 'block-math'; content: string }> = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({
          type: 'text',
          content: text.substring(lastIndex, match.index)
        });
      }

      const matchStr = match[0];
      if (matchStr.startsWith('$$') || matchStr.startsWith('\\begin{equation}') || matchStr.startsWith('\\begin{align')) {
        let mathContent = matchStr;
        if (mathContent.startsWith('$$')) {
          mathContent = mathContent.slice(2, -2).trim();
        } else if (mathContent.startsWith('\\begin{equation}')) {
          mathContent = mathContent.replace(/^\\begin\{equation\}/, '').replace(/\\end\{equation\}$/, '').trim();
        }
        tokens.push({
          type: 'block-math',
          content: mathContent
        });
      } else if (matchStr.startsWith('$')) {
        tokens.push({
          type: 'math',
          content: matchStr.slice(1, -1).trim()
        });
      }

      lastIndex = match.index + matchStr.length;
    }

    if (lastIndex < text.length) {
      tokens.push({
        type: 'text',
        content: text.substring(lastIndex)
      });
    }

    return tokens;
  }, [text]);

  return (
    <div className={`formatted-math leading-relaxed ${className}`}>
      {parts.map((part, idx) => {
        if (part.type === 'block-math') {
          return <MathView key={idx} math={part.content} block={true} />;
        }
        if (part.type === 'math') {
          return <MathView key={idx} math={part.content} inline={true} />;
        }

        // Render formatted text with bold, code, and line breaks
        const lines = part.content.split('\n');
        return (
          <span key={idx}>
            {lines.map((line, lIdx) => {
              // Parse **bold** and `code`
              const lineSegments = line.split(/(\*\*.*?\*\*|\`.*?\`)/g);
              return (
                <React.Fragment key={lIdx}>
                  {lIdx > 0 && <br />}
                  {lineSegments.map((seg, sIdx) => {
                    if (seg.startsWith('**') && seg.endsWith('**')) {
                      return (
                        <strong key={sIdx} className="text-slate-100 font-semibold">
                          {seg.slice(2, -2)}
                        </strong>
                      );
                    }
                    if (seg.startsWith('`') && seg.endsWith('`')) {
                      return (
                        <code
                          key={sIdx}
                          className="px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 text-[11px] font-mono border border-slate-800"
                        >
                          {seg.slice(1, -1)}
                        </code>
                      );
                    }
                    return <span key={sIdx}>{seg}</span>;
                  })}
                </React.Fragment>
              );
            })}
          </span>
        );
      })}
    </div>
  );
};
