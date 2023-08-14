import { proxyActivities } from '@temporalio/workflow';
import type * as activities from './activities';
import { TranslationWorkflowInput, TranslationWorkflowOutput } from './shared';

const { translateTerm } = proxyActivities<typeof activities>({
  startToCloseTimeout: '45 seconds',
});

/** A workflow that simply calls an activity */
export async function sayHelloGoodbyeWorkflow(input: TranslationWorkflowInput): Promise<TranslationWorkflowOutput> {
  const helloInput = {
    term: 'Hello',
    languageCode: input.languageCode,
  };

  const goodbyeInput = {
    term: 'Goodbye',
    languageCode: input.languageCode,
  };

  const helloResult = await translateTerm(helloInput);
  const goodbyeResult = await translateTerm(goodbyeInput);

  const helloMessage = `${helloResult.translation}, ${input.name}`;
  const goodbyeMessage = `${goodbyeResult.translation}, ${input.name}`;

  return { helloMessage, goodbyeMessage };
}
