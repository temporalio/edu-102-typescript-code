import * as activities from './activities';
import { TASK_QUEUE_NAME } from './shared';
import { NativeConnection, Worker } from '@temporalio/worker';

// Debug loggging
import { DefaultLogger, Runtime } from '@temporalio/worker';
const logger = new DefaultLogger('DEBUG');
Runtime.install({ logger });

async function run() {
  const connection = await NativeConnection.connect({ address: 'localhost:7233' });

  const worker = await Worker.create({
    taskQueue: TASK_QUEUE_NAME,
    connection,
    workflowsPath: require.resolve('./workflows'),
    activities,
  });

  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
