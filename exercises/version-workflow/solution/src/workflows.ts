import { patched } from '@temporalio/workflow';
import { proxyActivities, sleep, log } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';
import { CustomerInfo } from './customerdb';

const { sendThankYouToCustomer, chargeCustomer } = proxyActivities<typeof activities>({
  startToCloseTimeout: '60 seconds',
});

export async function loanProcessingWorkflow(input: CustomerInfo): Promise<string> {
  let totalPaid = 0;

  if (!patched('MovedThankYouAfterLoop')) {
    await sendThankYouToCustomer(input);
  }

  for (let period = 1; period <= input.NumberOfPeriods; period++) {
    const chargeInput = {
      CustomerID: input.CustomerID,
      Amount: input.Amount,
      PeriodNumber: period,
      NumberOfPeriods: input.NumberOfPeriods,
    };

    await chargeCustomer(chargeInput);

    totalPaid += chargeInput.Amount;
    log.info(`Payment complete -  "Period": ${period}, "Total Paid": ${totalPaid}`, {});

    // using 3 seconds instead of 30 days for faster results
    await sleep('3 seconds');
  }

  if (patched('MovedThankYouAfterLoop')) {
    await sendThankYouToCustomer(input);
  }

  return `Loan for customer '${input.CustomerID}' has been fully paid (total=${totalPaid})`;
}
