import Link from 'next/link';
import type { ReactNode } from 'react';
import { safeHref } from '@/lib/utils';

type SmartLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
};

export function SmartLink({
  href,
  children,
  className,
  ariaLabel,
  onClick
}: SmartLinkProps) {
  const target = safeHref(href, '#');
  const isPlain = /^(https?:|mailto:|tel:|#)/.test(target);

  if (isPlain) {
    const external = /^https?:/.test(target);
    return (
      <a
        href={target}
        className={className}
        aria-label={ariaLabel}
        onClick={onClick}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={target} className={className} aria-label={ariaLabel} onClick={onClick}>
      {children}
    </Link>
  );
}
