import axios from 'axios';
import { log } from '@temporalio/activity';

import { TranslationActivityInput, TranslationActivityOutput } from './shared';

export async function translateTerm(input: TranslationActivityInput): Promise<TranslationActivityOutput> {
  log.info('Translating term:', { LanguageCode: input.languageCode, Term: input.term });

  const lang = encodeURIComponent(input.languageCode);
  const term = encodeURIComponent(input.term);

  const url = `http://localhost:9998/translate?lang=${lang}&term=${term}`;

  try {
    const response = await axios.get(url);
    const content = response.data;
    log.debug('Translation successful:', { translation: content });
    return { translation: content };
  } catch (error: any) {
    if (error.response) {
      log.error('Translation request failed:', { status: error.response.status, data: error.response.data });
      throw new Error(`HTTP Error ${error.response.status}: ${error.response.data}`);
    } else if (error.request) {
      log.error('Translation request failed:', { request: error.request });
      throw new Error(`Request error:  ${error.request}`);
    }
    log.error('Something else failed during translation', { error });
    throw new Error('Something else failed during translation.');
  }
}
