import * as React from 'react';

export interface TimelineItem {
  icon: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items }: TimelineProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      {items.map((item, index) => (
        <div key={index} className="flex gap-4 min-h-2.5">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center rounded-full bg-blue-500 size-7 shrink-0">
              {item.icon}
            </div>
            {index < items.length - 1 && (
              <div className="w-0.5 bg-muted h-full" />
            )}
          </div>
          <div className="pb-6 w-full">{item.content}</div>
        </div>
      ))}
    </div>
  );
}
