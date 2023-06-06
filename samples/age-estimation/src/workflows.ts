import { proxyActivities } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';

const { estimateAge } = proxyActivities<typeof activities>({
  startToCloseTimeout: '5 seconds',
});

/** A workflow that simply calls an activity */
export async function estimateAgeWorkflow(name: string): Promise<string> {
  const age = await estimateAge(name);
  return (`${name} has an estimated age of ${age}`);

}
