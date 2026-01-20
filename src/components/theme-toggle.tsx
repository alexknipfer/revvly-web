import { Laptop, MoonStar, Sun } from 'lucide-react';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      size="xs"
      value={theme}
      onValueChange={(value) => {
        setTheme(value);
      }}
    >
      <ToggleGroupItem
        value="system"
        aria-label="Toggle system"
        className="px-2"
      >
        <Laptop className="size-3" />
      </ToggleGroupItem>
      <ToggleGroupItem value="light" aria-label="Toggle light" className="px-2">
        <Sun className="size-3" />
      </ToggleGroupItem>
      <ToggleGroupItem value="dark" aria-label="Toggle dark" className="px-2">
        <MoonStar className="size-3" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
