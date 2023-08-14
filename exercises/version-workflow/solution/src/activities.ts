import * as activity from '@temporalio/activity';

import { ChargeInput } from './shared';
import { CustomerInfo } from './customerdb';

export async function chargeCustomer(input: ChargeInput): Promise<string> {
  const context = activity.Context.current();

  context.log.info(
    '*** Charging customer ***' +
      'CustomerID: ' +
      input.CustomerID +
      'Amount: ' +
      input.Amount +
      'PeriodNumber: ' +
      input.PeriodNumber +
      'NumberOfPeriods: ' +
      input.NumberOfPeriods
  );

  // just pretend that we charged them
  const confirmation = `Charged ${input.Amount} to customer '${input.CustomerID}'`;
  return confirmation;
}

export async function sendThankYouToCustomer(input: CustomerInfo): Promise<string> {
  const context = activity.Context.current();

  context.log.info(
    '*** Sending thank you message To Customer ***' +
      'CustomerID:' +
      input.CustomerID +
      'EmailAddress:' +
      input.EmailAddress
  );

  // just pretend that we emailed them
  const confirmation = `Sent thank you message to customer '${input.CustomerID}'`;
  return confirmation;
}
