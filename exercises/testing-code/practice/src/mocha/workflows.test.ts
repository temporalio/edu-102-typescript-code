/*
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

    const workflowInput = {
      Name:         "Pierre",
      LanguageCode: "fr",
    };

    const worker = await Worker.create({
        connection: nativeConnection,
        taskQueue: 'test',
        workflowsPath: require.resolve('../workflows'),
        activities,
    });

    await worker.runUntil(async () => {
      const result = await client.workflow.execute(sayHelloGoodbyeWorkflow,{
          args: [workflowInput],
          workflowId: 'test',
          taskQueue: 'test',
        });

        // TODO: Assert that Workflow Execution completed

        // TODO: Assert that the HelloMessage field in the
        //       result is: Bonjour, Pierre

        // TODO: Assert that the GoodbyeMessage field in the
        //       result is: Au revoir, Pierre
    });

  });
});
*/
