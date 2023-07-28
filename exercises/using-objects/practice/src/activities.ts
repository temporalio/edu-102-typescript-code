import axios from 'axios';

// TODO Replace the two input parameters with the type you defined as input
// TODO Replace the output type (string) with the name of the type you defined as output
export async function translateTerm(inputTerm: string, languageCode: string): Promise<string> {

	// TODO Change the parameters used in these two calls to encodeURIComponent with
	//      the appopriate fields from your struct
  const lang = encodeURIComponent(languageCode);
  const term = encodeURIComponent(inputTerm);
  const url = `http://localhost:9998/translate?lang=${lang}&term=${term}`;
  let content = ""

  try {
    const response = await axios.get(url)
    content = response.data;

    // TODO  use the Debug level to log the successful translation and include the
    //       translated term as a name-value pair
    } catch (error: any) {
      if(error.response) {
        throw new Error(`HTTP Error ${error.response.status}: ${error.response.data}`);
      } else if (error.request) {
        throw new Error(`Request error:  ${error.request}`);
      }
    }

	// TODO Replace 'content' below with the object you're using as output,
	//      populated with the translation
  return (content);

}
