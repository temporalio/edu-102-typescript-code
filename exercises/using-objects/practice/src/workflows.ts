import { proxyActivities } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';
import {TranslationWorkflowInput, TranslationWorkflowOutput} from './shared';

const { translateTerm } = proxyActivities<typeof activities>({
  startToCloseTimeout: '45 seconds',
});

/** A workflow that simply calls an activity */
export async function sayHelloGoodbyeWorkflow(input: TranslationWorkflowInput): Promise<TranslationWorkflowOutput> {

	// TODO Create your Activity input object and populate it with the
	//      two fields from the translateTerm call below

	// TODO Replace "string" below with your Activity output type and use
  // your input object in the translateTerm call in the following line
  const helloResult: string =  await translateTerm("Hello", input.LanguageCode)

	// TODO Update the `helloResult` parameter to use the Translation field from the Activity output struct
  const helloMessage = `${helloResult}, ${input.Name}`;


	// TODO Create your Activity input struct and populate it with the last
	//      two fields from the translateTerm call below

	// TODO Replace "string" below with your Activity output type and use
  // your input object in the translateTerm call in the following line
  const goodbyeResult: string = await translateTerm("Goodbye", input.LanguageCode)

	// TODO Update the `goodbyeResult` parameter to use the Translation field from the Activity output struct
  const goodbyeMessage = `${goodbyeResult}, ${input.Name}`;

	const output: TranslationWorkflowOutput = {
		HelloMessage:   helloMessage,
		GoodbyeMessage: goodbyeMessage,
	}

  return output;

}
