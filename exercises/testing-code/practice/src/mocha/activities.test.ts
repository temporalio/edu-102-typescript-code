import { MockActivityEnvironment } from '@temporalio/testing';
import { describe, it } from 'mocha';
import * as activities from '../activities';
import assert from 'assert';
import { TranslationActivityOutput } from '../shared';

describe('translateTerm activity', async () => {
  it('successfully translates "Hello" to German', async () => {
    const env = new MockActivityEnvironment();
    const input = {
      term: 'Hello',
      languageCode: 'de',
    };
    const result: TranslationActivityOutput = await env.run(activities.translateTerm, input);
    assert.equal(result.translation, 'Hallo');
  });

  // TODO: add the `successfully translates "Goodbye" to Latvian` test here.

  // TODO:  paste the 'fails to translate with bad language code' test here.
});
