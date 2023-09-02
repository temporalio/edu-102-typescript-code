import { TestWorkflowEnvironment } from '@temporalio/testing';
import { afterEach, before, it } from 'mocha';
import { Worker } from '@temporalio/worker';
import { sayHelloGoodbyeWorkflow } from '../workflows';
import assert from 'assert';
import sinon from 'sinon';

describe('SayHelloGoodbye workflow', () => {
  let testEnv: TestWorkflowEnvironment;

  before(async () => {
    testEnv = await TestWorkflowEnvironment.createTimeSkipping();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('successfully completes French translation with a mocked call', async () => {
    const workflowInput = {
      name: 'Pierre',
      languageCode: 'fr',
    };

    const helloInput = {
      term: 'Hello',
      languageCode: workflowInput.languageCode,
    };

    const helloOutput = {
      translation: 'Bonjour',
    };

    const goodbyeInput = {
      term: 'Goodbye',
      languageCode: workflowInput.languageCode,
    };

    const goodbyeOutput = {
      translation: 'Au revoir',
    };

    const { client, nativeConnection } = testEnv;

    const translateTermMock = sinon.stub();
    translateTermMock.withArgs(helloInput).resolves(helloOutput);
    translateTermMock.withArgs(goodbyeInput).resolves(goodbyeOutput);

    const worker = await Worker.create({
      connection: nativeConnection,
      taskQueue: 'test',
      workflowsPath: require.resolve('../workflows'),
      activities: { translateTerm: translateTermMock },
    });

    const result = await worker.runUntil(
      client.workflow.execute(sayHelloGoodbyeWorkflow, {
        args: [workflowInput],
        workflowId: 'test',
        taskQueue: 'test',
      })
    );
    assert.equal(result.helloMessage, 'Bonjour, Pierre');
    assert.equal(result.goodbyeMessage, 'Au revoir, Pierre');
  });
});
