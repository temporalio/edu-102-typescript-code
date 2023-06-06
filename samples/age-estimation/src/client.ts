import process from 'process';
import { Connection, Client } from '@temporalio/client';
import { estimateAgeWorkflow } from './workflows';
import {TaskQueueName, WorkflowID} from './shared';

async function run() {

  if (process.argv.length <= 2) {
    console.error('Must specify a name as the command-line argument');
    process.exit(1);
  }

  const name = process.argv[2];

  const connection = await Connection.connect();

  const client = new Client({
    connection,
  });

  const handle = await client.workflow.start(estimateAgeWorkflow, {
    args: [name],
    taskQueue: TaskQueueName,
    workflowId: WorkflowID,
  });
  console.log(`Started workflow ${handle.workflowId}`);

  // optional: wait for client result
  console.log(await handle.result()); // Hello, Temporal!
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
