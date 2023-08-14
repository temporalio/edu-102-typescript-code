import { TestWorkflowEnvironment } from '@temporalio/testing';
import { before, describe, it } from 'mocha';
import { Worker } from '@temporalio/worker';
import fs from 'fs';

describe('SayHelloGoodbye workflow', () => {
  let testEnv: TestWorkflowEnvironment;

  before(async () => {
    testEnv = await TestWorkflowEnvironment.createTimeSkipping();
  });

  after(async () => {
    await testEnv?.teardown();
  });

  it('successfully replays Workflow history from file', async () => {
    // NOTE: Your path will be that of the file you downloaded, such as
    // /Users/yourname/Downloads/02c502fe-846c-4493-abfd-b6909935693c_events.json
    // instead of the one you see here (which was changed so that you can
    // run the test).
    const filePath = './history_for_original_execution.json';
    const fileContents = await fs.promises.readFile(filePath, 'utf8');
    const history = JSON.parse(fileContents);
    await Worker.runReplayHistory(
      {
        workflowsPath: require.resolve('../workflows'),
      },
      history
    );
  });
});
