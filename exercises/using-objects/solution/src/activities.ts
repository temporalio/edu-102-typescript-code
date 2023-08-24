import axios from 'axios';
import { TranslationActivityInput, TranslationActivityOutput } from './shared';

export async function translateTerm(input: TranslationActivityInput): Promise<TranslationActivityOutput> {
  const lang = encodeURIComponent(input.languageCode);
  const term = encodeURIComponent(input.term);
  const url = `http://localhost:9998/translate?lang=${lang}&term=${term}`;

  try {
    const response = await axios.get(url);
    const content = response.data;
    return { translation: content };
  } catch (error: any) {
    if (error.response) {
      throw new Error(`HTTP Error ${error.response.status}: ${error.response.data}`);
    } else if (error.request) {
      throw new Error(`Request error:  ${error.request}`);
    }
    throw new Error('Something else failed during translation.');
  }
}
