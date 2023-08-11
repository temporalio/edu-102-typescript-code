import { Connection, Client } from '@temporalio/client';
import { sayHelloGoodbyeWorkflow } from './workflows';
import { nanoid } from 'nanoid';

import { TaskQueueName, TranslationWorkflowInput, TranslationWorkflowOutput } from './shared';

async function run() {
  if (process.argv.length <= 3) {
    console.error('Must specify a name and language code as the command-line arguments');
    process.exit(1);
  }

  const name = process.argv[2];
  const languageCode = process.argv[3];
  const connection = await Connection.connect({ address: 'localhost:7233' });

  const client = new Client({ connection });

  const input: TranslationWorkflowInput = {
    Name: name,
    LanguageCode: languageCode,
  };

  const handle = await client.workflow.start(sayHelloGoodbyeWorkflow, {
    // type inference works! args: [name: string]
    args: [input],
    taskQueue: TaskQueueName,
    // in practice, use a meaningful business ID, like customerId or transactionId
    workflowId: 'translation-workflow-' + nanoid(),
  });

  console.log(`Started workflow ${handle.workflowId}`);

  const data = await handle.result();

  const output = JSON.stringify(data);

  // optional: wait for client result
  console.log(output);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
