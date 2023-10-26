import { TestWorkflowEnvironment } from '@temporalio/testing';
import { after, before, it } from 'mocha';
import { Worker } from '@temporalio/worker';
import { estimateAgeWorkflow } from '../workflows';
import * as activities from '../activities';
import assert from 'assert';

describe('estimateAge workflow', async () => {
  let testEnv: TestWorkflowEnvironment;

  before(async () => {
    testEnv = await TestWorkflowEnvironment.createLocal();
  });

  after(async () => {
    await testEnv?.teardown();
  });

  it('runs estimateAgeWorkflow with activity call', async () => {
    const { client, nativeConnection } = testEnv;
    const worker = await Worker.create({
      connection: nativeConnection,
      taskQueue: 'test',
      workflowsPath: require.resolve('../workflows'),
      activities,
    });

    const result = await worker.runUntil(
      client.workflow.execute(estimateAgeWorkflow, {
        args: ['Betty'],
        workflowId: 'test',
        taskQueue: 'test',
      })
    );

    assert.equal(result, 'Betty has an estimated age of 76');
  });
});
