import axios from 'axios';
import { TranslationActivityInput, TranslationActivityOutput } from './shared';

export async function translateTerm(input: TranslationActivityInput): Promise<TranslationActivityOutput> {
  const lang = encodeURIComponent(input.LanguageCode);
  const term = encodeURIComponent(input.Term);

  const url = `http://localhost:9998/translate?lang=${lang}&term=${term}`;
  const response = await axios.get(url);
  const responseData = response.data;

  const result: TranslationActivityOutput = { Translation: responseData };

  return result;
}
