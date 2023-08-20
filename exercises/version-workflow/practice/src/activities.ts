import * as activity from '@temporalio/activity';

import { ChargeInput } from './shared';
import { CustomerInfo } from './customerdb';

export async function chargeCustomer(input: ChargeInput): Promise<string> {
  const context = activity.Context.current();

  context.log.info('*** Charging customer ***', input);

  // just pretend that we charged them
  return `Charged ${input.amount} to customer '${input.customerID}'`;
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
  return `Sent thank you message to customer '${input.customerID}'`;
}
