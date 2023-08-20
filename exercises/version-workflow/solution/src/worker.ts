import { NativeConnection, Worker } from '@temporalio/worker';
import * as activities from './activities';
import { TaskQueueName } from './shared';

async function run() {
  const connection = await NativeConnection.connect({ address: 'localhost:7233' });
  const worker = await Worker.create({
    taskQueue: TaskQueueName,
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
