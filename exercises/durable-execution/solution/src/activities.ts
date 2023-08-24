import axios from 'axios';
import * as activity from '@temporalio/activity';

import { TranslationActivityInput, TranslationActivityOutput } from './shared';

export async function translateTerm(input: TranslationActivityInput): Promise<TranslationActivityOutput> {
  const context = activity.Context.current();

  context.log.info('Translating term:', { LanguageCode: input.languageCode, Term: input.term });

  const lang = encodeURIComponent(input.languageCode);
  const term = encodeURIComponent(input.term);

  const url = `http://localhost:9998/translate?lang=${lang}&term=${term}`;

  try {
    const response = await axios.get(url);
    const content = response.data;
    context.log.debug('Translation successful:', { translation: content });
    return { translation: content };
  } catch (error: any) {
    if (error.response) {
      context.log.error('Translation request failed:', { status: error.response.status, data: error.response.data });
      throw new Error(`HTTP Error ${error.response.status}: ${error.response.data}`);
    } else if (error.request) {
      context.log.error('Translation request failed:', { request: error.request });
      throw new Error(`Request error:  ${error.request}`);
    }
    context.log.error('Something else failed during translation', { error });
    throw new Error('Something else failed during translation.');
  }
}
