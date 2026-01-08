import { createAnthropicChat } from '@tanstack/ai-anthropic';
import { createServerOnlyFn } from '@tanstack/react-start';

import { serverAppConfig } from '@/modules/core/lib/appConfig';

export const anthropicHaikuAdapter = createServerOnlyFn(() => {
  console.log('serverAppConfig: ', serverAppConfig().anthropic.apiKey);

  return createAnthropicChat(
    'claude-haiku-4-5',
    serverAppConfig().anthropic.apiKey,
  );
});
