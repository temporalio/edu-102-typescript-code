import axios from 'axios';

// TODO Replace the two input parameters with the type you defined as input
// TODO Replace the output type (string) with the name of the type you defined as output
export async function translateTerm(inputTerm: string, languageCode: string): Promise<string> {

	// TODO Change the parameters used in these two calls to encodeURIComponent with
	//      the appopriate fields from your struct
  const lang = encodeURIComponent(languageCode);
  const term = encodeURIComponent(inputTerm);

  const url = `http://localhost:9998/translate?lang=${lang}&term=${term}`;
  const response = await axios.get(url);
  const content = response.data;

	// TODO Replace 'content' below with the struct your using as output,
	//      populated with the translation
  return (content);

}
