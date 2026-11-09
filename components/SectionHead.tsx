import type { ReactNode } from 'react';

type SectionHeadProps = {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function SectionHead({
  eyebrow,
  title,
  description,
  action,
  className = ''
}: SectionHeadProps) {
  const words = title.trim().split(/\s+/);
  const hasAccent = words.length > 1;
  const head = hasAccent ? words.slice(0, -1).join(' ') : '';
  const accentWord = hasAccent ? words[words.length - 1] : '';

  const numMatch = eyebrow.match(/^(\d{1,2})\s*[—–-]\s*(.+)$/);
  const num = numMatch ? numMatch[1] : null;
  const eyebrowText = numMatch ? numMatch[2] : eyebrow;

  return (
    <div className={`section-head ${className}`} data-reveal>
      <div className="section-head__lead">
        {num ? <span className="section-head__num">{num} /</span> : null}
        <p className="eyebrow">
          <i /> {eyebrowText}
        </p>
        <h2 className="section-head__title">
          {hasAccent ? (
            <>
              {head} <em>{accentWord}</em>
            </>
          ) : (
            title
          )}
        </h2>
      </div>
      {description ? <p className="section-head__desc">{description}</p> : null}
      {action ? <div className="section-head__action">{action}</div> : null}
    </div>
  );
}
