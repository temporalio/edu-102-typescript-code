import { Address, Bill, Distance, OrderConfirmation } from './shared';

export async function getDistance(address: Address): Promise<Distance> {
  console.log('getDistance invoked; determining distance to customer address');

  // this is a simulation, which calculates a fake (but consistent)
  // distance for a customer address based on its length. The value
  // will therefore be different when called with different addresses,
  // but will be the same across all invocations with the same address.
  let kilometers: number = address.Line1.length + address.Line2.length - 10;
  if (kilometers < 1) {
    kilometers = 5;
  }

  const distance: Distance = {
    Kilometers: kilometers,
  };

  console.log('GetDistance complete', 'Distance', distance.Kilometers);
  return distance;
}

export async function sendBill(bill: Bill): Promise<OrderConfirmation> {
  console.log('sendBill invoked', 'Customer', bill.CustomerID, 'Amount', bill.Amount);

  let chargeAmount = bill.Amount;

  // This month's special offer: Get $5 off all orders over $30
  if (bill.Amount > 3000) {
    console.log('Applying discount');

    chargeAmount -= 500; // reduce amount charged by 500 cents
  }

  // reject invalid amounts before calling the payment processor
  if (chargeAmount < 0) {
    const errMsg = `invalid charge amount: ${chargeAmount} (must be above zero)`;
    throw new Error(errMsg);
  }

  // pretend we called a payment processing service here :-)

  const confirmation: OrderConfirmation = {
    OrderNumber: bill.OrderNumber,
    ConfirmationNumber: 'AB9923',
    Status: 'SUCCESS',
    BillingTimestamp: Date.now(),
    Amount: chargeAmount,
  };

  console.log('sendBill complete', 'ConfirmationNumber', confirmation.ConfirmationNumber);

  return confirmation;
}
