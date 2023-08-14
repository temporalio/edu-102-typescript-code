import { proxyActivities, sleep, log } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';
import { TranslationWorkflowInput, TranslationWorkflowOutput } from './shared';

const { translateTerm } = proxyActivities<typeof activities>({
  startToCloseTimeout: '45 seconds',
});

export async function sayHelloGoodbyeWorkflow(input: TranslationWorkflowInput): Promise<TranslationWorkflowOutput> {
  log.info('SayHelloGoodbye Workflow Invoked', { Name: input.name });

  log.debug('Preparing to translate Hello', { LanguageCode: input.languageCode });

  const helloInput = {
    term: 'Hello',
    languageCode: input.languageCode,
  };

  const helloResult = await translateTerm(helloInput);
  const helloMessage = `${helloResult.translation}, ${input.name}`;

  log.debug('Sleeping between translation calls', {});
  await sleep('10 seconds');

  log.debug('Preparing to translate Goodbye', { LanguageCode: input.languageCode });

  const goodbyeInput = {
    term: 'Goodbye',
    languageCode: input.languageCode,
  };

  const goodbyeResult = await translateTerm(goodbyeInput);
  const goodbyeMessage = `${goodbyeResult.translation}, ${input.name}`;

  return { helloMessage, goodbyeMessage };
}
