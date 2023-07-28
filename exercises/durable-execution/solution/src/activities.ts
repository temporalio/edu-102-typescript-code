import axios from 'axios';
import * as activity from '@temporalio/activity';

import {TranslationActivityInput, TranslationActivityOutput} from './shared';

export async function translateTerm(input: TranslationActivityInput): Promise<TranslationActivityOutput> {
  const context = activity.Context.current();

	context.log.info("Translating term:", {"LanguageCode": input.LanguageCode, "Term": input.Term})

  const lang = encodeURIComponent(input.LanguageCode);
  const term = encodeURIComponent(input.Term);

  const url = `http://localhost:9998/translate?lang=${lang}&term=${term}`;
  let result: TranslationActivityOutput = {Translation: ""}

  try {
    const response = await axios.get(url)
    const responseData = response.data;
    result = {Translation: responseData}
	  context.log.error("Translation successful:", {"translation": result.Translation})
  } catch (error: any) {
    if(error.response) {
      context.log.error("Translation request failed:", {"status": error.response.status, "data": error.response.data});
      throw new Error(`HTTP Error ${error.response.status}: ${error.response.data}`);
    } else if (error.request) {
      context.log.error("Translation request failed:", {"request": error.request});
      throw new Error(`Request error:  ${error.request}`);
    }
  }

  return (result);
}
