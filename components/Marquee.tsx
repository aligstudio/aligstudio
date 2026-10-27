import { Icon } from './icons';

const ENGLISH_TERMS = /\b(motion|studio|creative|technology|design|reels|youtube|digital|ai|ui|ux|web|seo)\b/gi;

function formatMarqueeText(text: string): string {
  return text
    .replace(ENGLISH_TERMS, (match) => match.toLocaleUpperCase('en-US'))
    .toLocaleUpperCase('tr-TR');
}

export function Marquee({ items }: { items: string[] }) {
  if (!items.length) return null;
  const row = [...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {row.map((item, index) => (
          <span className="marquee__item" key={`${item}-${index}`}>
            {formatMarqueeText(item)}
            <Icon name="spark" size={13} strokeWidth={2} />
          </span>
        ))}
      </div>
    </div>
  );
}
