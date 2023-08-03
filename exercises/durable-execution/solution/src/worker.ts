import { Worker } from '@temporalio/worker';
import * as activities from './activities';
import { TaskQueueName } from './shared';

// Configure the Worker logger to show Debug level messages
import { DefaultLogger, Runtime } from '@temporalio/worker';
const logger = new DefaultLogger('DEBUG');
Runtime.install({ logger });

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
