import { proxyActivities } from '@temporalio/workflow';
import type * as activities from './activities';

const { estimateAge } = proxyActivities<typeof activities>({
  startToCloseTimeout: '5 seconds',
});

export async function estimateAgeWorkflow(name: string): Promise<string> {
  const age = await estimateAge(name);
  return `${name} has an estimated age of ${age}`;
}
