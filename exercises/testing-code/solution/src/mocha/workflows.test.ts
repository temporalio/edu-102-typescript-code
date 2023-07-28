import { TestWorkflowEnvironment } from '@temporalio/testing';
import { before, describe, it } from 'mocha';
import { Worker, Runtime, DefaultLogger, LogEntry } from '@temporalio/worker';
import {sayHelloGoodbyeWorkflow } from '../workflows';
import * as activities from '../activities';
import assert from 'assert';

describe('SayHelloGoodbye workflow', () => {
  let testEnv: TestWorkflowEnvironment;

  before(async() => {
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

  it('successfully completes French translation', async () => {

    const { client, nativeConnection } = testEnv;

    const worker = await Worker.create({
        connection: nativeConnection,
        taskQueue: 'test',
        workflowsPath: require.resolve('../workflows'),
        activities,
    });

    const workflowInput = {
      Name:         "Pierre",
      LanguageCode: "fr",
    };

    await worker.runUntil(async () => {
      const result = await client.workflow.execute(sayHelloGoodbyeWorkflow,{
          args: [workflowInput],
          workflowId: 'test',
          taskQueue: 'test',
        });
      assert.equal(result.HelloMessage, "Bonjour, Pierre");
      assert.equal(result.GoodbyeMessage, "Au revoir, Pierre");
    });

  });
});
