import { createAnthropicChat } from '@tanstack/ai-anthropic';
import { createServerOnlyFn } from '@tanstack/react-start';

import { serverAppConfig } from '@/lib/appConfig';

export const anthropicHaikuAdapter = createServerOnlyFn(() => {
  return createAnthropicChat(
    'claude-haiku-4-5',
    serverAppConfig().anthropic.apiKey,
  );
});

export const anthropicSonnetAdapter = createServerOnlyFn(() => {
  return createAnthropicChat(
    'claude-sonnet-4-5',
    serverAppConfig().anthropic.apiKey,
  );
});
