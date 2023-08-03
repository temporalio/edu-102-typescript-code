import { proxyActivities, sleep, log } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';
import {
  TranslationActivityInput,
  TranslationActivityOutput,
  TranslationWorkflowInput,
  TranslationWorkflowOutput,
} from './shared';

const { translateTerm } = proxyActivities<typeof activities>({
  startToCloseTimeout: '45 seconds',
});

export async function sayHelloGoodbyeWorkflow(input: TranslationWorkflowInput): Promise<TranslationWorkflowOutput> {
  log.info('SayHelloGoodbye Workflow Invoked', { Name: input.Name });

  log.debug('Preparing to translate Hello', { LanguageCode: input.LanguageCode });

  const helloInput: TranslationActivityInput = {
    Term: 'Hello',
    LanguageCode: input.LanguageCode,
  };

  const helloResult: TranslationActivityOutput = await translateTerm(helloInput);
  const helloMessage = `${helloResult.Translation}, ${input.Name}`;

  log.debug('Sleeping between translation calls', {});
  await sleep('10 seconds');

  log.debug('Preparing to translate Goodbye', { LanguageCode: input.LanguageCode });
  const goodbyeInput: TranslationActivityInput = {
    Term: 'Goodbye',
    LanguageCode: input.LanguageCode,
  };

  const goodbyeResult: TranslationActivityOutput = await translateTerm(goodbyeInput);
  const goodbyeMessage = `${goodbyeResult.Translation}, ${input.Name}`;

  const output: TranslationWorkflowOutput = {
    HelloMessage: helloMessage,
    GoodbyeMessage: goodbyeMessage,
  };

  return output;
}
