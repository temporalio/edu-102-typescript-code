import * as activity from '@temporalio/activity';

import { ChargeInput } from './shared';
import { CustomerInfo } from './customerdb';

export async function chargeCustomer(input: ChargeInput): Promise<string> {
  const context = activity.Context.current();

  context.log.info(
    '*** Charging customer ***' +
      'CustomerID: ' +
      input.customerID +
      'Amount: ' +
      input.amount +
      'PeriodNumber: ' +
      input.periodNumber +
      'NumberOfPeriods: ' +
      input.numberOfPeriods
  );

  // just pretend that we charged them
  const confirmation = `Charged ${input.amount} to customer '${input.customerID}'`;
  return confirmation;
}

export async function sendThankYouToCustomer(input: CustomerInfo): Promise<string> {
  const context = activity.Context.current();

  context.log.info(
    '*** Sending thank you message To Customer ***' +
      'CustomerID:' +
      input.customerID +
      'EmailAddress:' +
      input.emailAddress
  );

  // just pretend that we emailed them
  const confirmation = `Sent thank you message to customer '${input.customerID}'`;
  return confirmation;
}
