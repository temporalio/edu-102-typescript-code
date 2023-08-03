import { proxyActivities } from '@temporalio/workflow';
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

/** A workflow that simply calls an activity */
export async function sayHelloGoodbyeWorkflow(input: TranslationWorkflowInput): Promise<TranslationWorkflowOutput> {
  const helloInput: TranslationActivityInput = {
    Term: 'Hello',
    LanguageCode: input.LanguageCode,
  };

  const goodbyeInput: TranslationActivityInput = {
    Term: 'Goodbye',
    LanguageCode: input.LanguageCode,
  };

  const helloResult: TranslationActivityOutput = await translateTerm(helloInput);
  const goodbyeResult: TranslationActivityOutput = await translateTerm(goodbyeInput);

  const helloMessage = `${helloResult.Translation}, ${input.Name}`;
  const goodbyeMessage = `${goodbyeResult.Translation}, ${input.Name}`;

  const output: TranslationWorkflowOutput = {
    HelloMessage: helloMessage,
    GoodbyeMessage: goodbyeMessage,
  };

  return output;
}
