import { MockActivityEnvironment } from '@temporalio/testing';
import { describe, it } from 'mocha';
import * as activities from '../activities';
import assert from 'assert';

describe('estimateAge activity', async () => {

  it('runs estimateAgeWorkflow with activity call', async () => {
    const env = new MockActivityEnvironment();
    const res = await env.run(activities.estimateAge, 'Betty');
    assert.equal(res, 76);
  });
});
