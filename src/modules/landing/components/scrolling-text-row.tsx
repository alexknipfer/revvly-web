import { cn } from '@/lib/utils';

interface Props {
  items: Array<{ text: string; highlight: boolean }>;
  animationClassName: string;
  highlightClassName: string;
  separatorText: string;
  containerClassName?: string;
}

export function ScrollingTextRow({
  items,
  animationClassName,
  highlightClassName,
  separatorText,
  containerClassName,
}: Props) {
  const looped = [...items, ...items, ...items];

  return (
    <div
      className={cn(
        'flex items-center h-8 overflow-hidden',
        containerClassName,
      )}
    >
      <div
        className={cn(
          'flex items-center gap-6 whitespace-nowrap',
          animationClassName,
        )}
      >
        {looped.map((item, idx) => (
          <span
            // Stable enough for a marquee; idx is fine since this list is static.
            key={idx}
            className={cn(
              'text-[10px] uppercase tracking-widest',
              item.highlight
                ? highlightClassName
                : item.text === separatorText
                  ? 'text-foreground/20'
                  : 'text-muted-foreground',
            )}
          >
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}
