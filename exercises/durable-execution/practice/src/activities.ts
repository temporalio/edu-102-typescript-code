import axios from 'axios';

// TODO impport everything from the @temporalio/activity package as activity

import { TranslationActivityInput, TranslationActivityOutput } from './shared';

export async function translateTerm(input: TranslationActivityInput): Promise<TranslationActivityOutput> {
  // TODO Define an Activity logger

  // TODO log Activity invocation, at the Info level, and include the term being
  //      translated and the language code as name-value pairs

  const lang = encodeURIComponent(input.languageCode);
  const term = encodeURIComponent(input.term);

  const url = `http://localhost:9998/translate?lang=${lang}&term=${term}`;
  let content = '';

  try {
    const response = await axios.get(url);
    content = response.data;

    // TODO  use the Debug level to log the successful translation and include the
    //       translated term as a name-value pair
  } catch (error: any) {
    if (error.response) {
      throw new Error(`HTTP Error ${error.response.status}: ${error.response.data}`);
    } else if (error.request) {
      throw new Error(`Request error:  ${error.request}`);
    }
  }

  return { translation: content };
}
