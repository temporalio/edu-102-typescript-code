import { MockActivityEnvironment } from '@temporalio/testing';
import { afterEach, before, it } from 'mocha';
import { Runtime, DefaultLogger, LogEntry } from '@temporalio/worker';
import * as activities from '../activities';
import sinon from 'sinon';
import assert from 'assert';

describe('estimateAge activity', async () => {
  before(async () => {
    // Use console.log instead of console.error to avoid red output
    // Filter INFO log messages for clearer test output
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

  afterEach(() => {
    sinon.restore();
  });

  it('runs estimateAgeWorkflow with activity call', async () => {
    const env = new MockActivityEnvironment();
    const res = await env.run(activities.estimateAge, 'Betty');
    assert.equal(res, 76);
  });
});
