// TODO: Uncomment the following line
// import { patched } from '@temporalio/workflow';
import { proxyActivities, sleep, log } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';
import { CustomerInfo } from './customerdb';

const { sendThankYouToCustomer, chargeCustomer } = proxyActivities<typeof activities>({
  startToCloseTimeout: '60 seconds',
});

export async function loanProcessingWorkflow(input: CustomerInfo): Promise<string> {
  let totalPaid = 0;

  await sendThankYouToCustomer(input);

  for (let period = 1; period <= input.numberOfPeriods; period++) {
    const chargeInput = {
      customerID: input.customerID,
      amount: input.amount,
      periodNumber: period,
      numberOfPeriods: input.numberOfPeriods,
    };

    await chargeCustomer(chargeInput);

    totalPaid += chargeInput.amount;
    log.info(`Payment complete -  "Period": ${period}, "Total Paid": ${totalPaid}`, {});

    // using 3 seconds instead of 30 days for faster results
    await sleep('3 seconds');
  }

  return `Loan for customer '${input.customerID}' has been fully paid (total=${totalPaid})`;
}
