import { Connection, Client } from '@temporalio/client';
import { loanProcessingWorkflow} from './workflows';
import { nanoid } from 'nanoid';
import { customerDB } from './customerdb';

import {TaskQueueName} from './shared';

async function run() {

  if (process.argv.length <= 2) {
    console.error('Must specify a customer ID as the command-line argument');
    process.exit(1);
  }

  const customerID = process.argv[2];

  const db = customerDB();
  const customerInfo = db.Get(customerID);
  if (!customerInfo) {
    console.log("Customer not found");
    process.exit(1);
  }

  const connection = await Connection.connect();

  const client = new Client({ connection });

  const handle = await client.workflow.start(loanProcessingWorkflow, {
    args: [customerInfo],
    taskQueue: TaskQueueName,
    workflowId: 'loan-workflow-' + nanoid(),
  });

  console.log(`Started workflow ${handle.workflowId}`);

  const data = await handle.result();

  const output = JSON.stringify(data);

  // optional: wait for client result
  console.log(output)
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
