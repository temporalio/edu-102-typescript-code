import { TestWorkflowEnvironment } from '@temporalio/testing';
import { after,  afterEach, before, it } from 'mocha';
import { Worker, Runtime, DefaultLogger, LogEntry } from '@temporalio/worker';
import { sayHelloGoodbyeWorkflow } from '../workflows';
import assert from 'assert';
import sinon from 'sinon';
import {TranslationActivityInput, TranslationActivityOutput, TranslationWorkflowInput} from '../shared';

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


  afterEach(() => {
    sinon.restore();
  });

  it('successfully completes French translation with a mocked call', async () => {

    const workflowInput: TranslationWorkflowInput = {
      Name:         "Pierre",
      LanguageCode: "fr",
    };

    const helloInput: TranslationActivityInput= {
      Term:         "Hello",
      LanguageCode: workflowInput.LanguageCode,
    }

    const helloOutput: TranslationActivityOutput =  {
      Translation: "Bonjour",
    }

    const goodbyeInput: TranslationActivityInput= {
      Term:         "Goodbye",
      LanguageCode: workflowInput.LanguageCode,
    }

    const goodbyeOutput: TranslationActivityOutput  = {
      Translation: "Au revoir",
    }

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
