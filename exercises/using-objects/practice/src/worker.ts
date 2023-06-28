import { Worker } from '@temporalio/worker';
import * as activities from './activities';
import {TaskQueueName} from './shared';

async function run() {

  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows'),
    activities,
    taskQueue: TaskQueueName,
  });

  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
