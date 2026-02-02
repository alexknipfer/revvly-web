import { ScrollingTextRow } from './scrolling-text-row';

const scrollTextTop = [
  { text: 'FUEL_TRACKING', highlight: true },
  { text: '•', highlight: false },
  { text: 'MPG_ANALYTICS', highlight: false },
  { text: '•', highlight: false },
  { text: 'EXPENSE_MONITORING', highlight: true },
  { text: '•', highlight: false },
  { text: 'REAL_TIME_SYNC', highlight: false },
  { text: '•', highlight: false },
  { text: 'SMART_INSIGHTS', highlight: true },
  { text: '•', highlight: false },
  { text: 'SERVICE_REMINDERS', highlight: false },
  { text: '•', highlight: false },
  { text: 'MULTI_VEHICLE', highlight: true },
  { text: '•', highlight: false },
  { text: 'COST_PER_MILE', highlight: false },
  { text: '•', highlight: false },
];

export const scrollTextBottom = [
  { text: 'BUILD_2025.01', highlight: true },
  { text: '///', highlight: false },
  { text: 'UPTIME_99.9%', highlight: false },
  { text: '///', highlight: false },
  { text: 'API_READY', highlight: true },
  { text: '///', highlight: false },
  { text: 'ENCRYPTED', highlight: false },
  { text: '///', highlight: false },
  { text: 'CLOUD_SYNC', highlight: true },
  { text: '///', highlight: false },
  { text: 'ZERO_CONFIG', highlight: false },
  { text: '///', highlight: false },
  { text: 'INSTANT_DEPLOY', highlight: true },
  { text: '///', highlight: false },
];

export function ScrollingBanner() {
  return (
    <div className="bg-background/95 backdrop-blur-md border-b border-border">
      <ScrollingTextRow
        items={scrollTextTop}
        containerClassName="border-b border-border/50"
        animationClassName="animate-scroll"
        highlightClassName="text-indigo-600 dark:text-indigo-400"
        separatorText="•"
      />
      <ScrollingTextRow
        items={scrollTextBottom}
        animationClassName="animate-scroll-reverse"
        highlightClassName="text-violet-600 dark:text-violet-400"
        separatorText="///"
      />
    </div>
  );
}
