import { proxyActivities } from '@temporalio/workflow';
import type * as activities from './activities';
import { TranslationWorkflowInput, TranslationWorkflowOutput } from './shared';

const { translateTerm } = proxyActivities<typeof activities>({
  startToCloseTimeout: '45 seconds',
});

/** A workflow that simply calls an activity */
export async function sayHelloGoodbyeWorkflow(input: TranslationWorkflowInput): Promise<TranslationWorkflowOutput> {
  // TODO Create your Activity input object and populate it with the
  //      two fields from the translateTerm call below

  // TODO Replace "string" below with your Activity output type and use
  // your input object in the translateTerm call in the following line
  const helloResult = await translateTerm('Hello', input.languageCode);

  // TODO Update the `helloResult` parameter to use the Translation field from the Activity output struct
  const helloMessage = `${helloResult}, ${input.name}`;

  // TODO Create your Activity input struct and populate it with the last
  //      two fields from the translateTerm call below

  // TODO Replace "string" below with your Activity output type and use
  // your input object in the translateTerm call in the following line
  const goodbyeResult = await translateTerm('Goodbye', input.languageCode);

  // TODO Update the `goodbyeResult` parameter to use the Translation field from the Activity output struct
  const goodbyeMessage = `${goodbyeResult}, ${input.name}`;

  return { helloMessage, goodbyeMessage };
}
