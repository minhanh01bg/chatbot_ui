import { openai } from '@ai-sdk/openai';

import { customMiddleware } from './custom-middleware';

export const customModel = (apiIdentifier: string) => {
  // If wrapping becomes available, integrate customMiddleware here.
  return openai(apiIdentifier);
};

export const imageGenerationModel = openai.image('dall-e-3');
