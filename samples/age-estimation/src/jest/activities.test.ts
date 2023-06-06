import { MockActivityEnvironment } from '@temporalio/testing';
import { Runtime, DefaultLogger, LogEntry } from '@temporalio/worker';
import * as activities from '../activities';

beforeAll(async () => {
  // Use console.log instead of console.error to avoid red output
  // Filter INFO log messages for clearer test output
  Runtime.install({
    logger: new DefaultLogger('WARN', (entry: LogEntry) => console.log(`[${entry.level}]`, entry.message)),
  });

});

afterAll(async () => {
//  await testEnv?.teardown();
});


test('estimateAgeActivity', async () => {
  const env = new MockActivityEnvironment();
  const res = await env.run(activities.estimateAge, "Betty");
  expect(res).toEqual(76);
});
