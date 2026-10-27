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
  return (
    <div className={`section-head ${className}`} data-reveal>
      <div className="section-head__lead">
        <p className="eyebrow">
          <i /> {eyebrow}
        </p>
        <h2 className="section-head__title">{title}</h2>
      </div>
      {description ? <p className="section-head__desc">{description}</p> : null}
      {action ? <div className="section-head__action">{action}</div> : null}
    </div>
  );
}
