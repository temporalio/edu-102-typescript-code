import { TestWorkflowEnvironment } from '@temporalio/testing';
import { after, afterEach, before, it } from 'mocha';
import { Worker, Runtime, DefaultLogger, LogEntry } from '@temporalio/worker';
import { estimateAgeWorkflow } from '../workflows';
import * as activities from '../activities';
import sinon from 'sinon';
import assert from 'assert';

describe('estimateAge workflow', async () => {
  let testEnv: TestWorkflowEnvironment;

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

    testEnv = await TestWorkflowEnvironment.createTimeSkipping();
  });

  after(async () => {
    await testEnv?.teardown();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('runs estimateAgeWorkflow with mocked activity call', async () => {
    const { client, nativeConnection } = testEnv;
    const worker = await Worker.create({
      connection: nativeConnection,
      taskQueue: 'test',
      workflowsPath: require.resolve('../workflows'),
      activities: {
        estimateAge: async () => 76,
      },
    });

    await worker.runUntil(async () => {
      const result = await client.workflow.execute(estimateAgeWorkflow, {
        args: ['Betty'],
        workflowId: 'test',
        taskQueue: 'test',
      });

      assert.equal(result, 'Betty has an estimated age of 76');
    });
  });
});
