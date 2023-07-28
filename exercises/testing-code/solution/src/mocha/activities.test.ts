import { MockActivityEnvironment } from '@temporalio/testing';
import {  before, describe, it } from 'mocha';
import { Runtime, DefaultLogger, LogEntry } from '@temporalio/worker';
import * as activities from '../activities';
import assert from 'assert';
import {TranslationActivityInput, TranslationActivityOutput} from '../shared';

describe('translateTerm activity', async () => {

  before(() => {
    try {
      Runtime.install({
        logger: new DefaultLogger('WARN', (entry: LogEntry) => console.log(`[${entry.level}]`, entry.message)),
      });
    } catch (err: any) {
      if (err.name === 'IllegalStateError') {
        console.log('Logger is already configured');
      }
    }
  });

  it('successfully translates "Hello" to German', async () => {
    const env = new MockActivityEnvironment();
    const input: TranslationActivityInput = {
      Term:         "Hello",
      LanguageCode: "de",
    };
    const result: TranslationActivityOutput = await env.run(activities.translateTerm, input);
    assert.equal(result.Translation, "Hallo");
  });

  it('successfully translates "Goodbye" to Latvian', async () => {
    const env = new MockActivityEnvironment();
    const input: TranslationActivityInput = {
      Term:         "Goodbye",
      LanguageCode: "lv",
    };
    const result: TranslationActivityOutput = await env.run(activities.translateTerm, input);
    assert.equal(result.Translation, "Ardievu");
  });

  it('fails to translate with bad language code', async () => {
    const env = new MockActivityEnvironment();
    const input: TranslationActivityInput = {
      Term:         "Hello",
      LanguageCode: "xq",
    };
    try {
      await env.run(activities.translateTerm, input);
      assert.fail('Expected error was not thrown');
    } catch (err: any) {
      console.log(err.message)
      assert(err.message.includes("HTTP Error 400: Unknown language code \"xq\""));
    }
  });
});
