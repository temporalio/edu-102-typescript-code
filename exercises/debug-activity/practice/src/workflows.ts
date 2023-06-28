import { proxyActivities, sleep } from '@temporalio/workflow';
import { proxySinks, LoggerSinks} from '@temporalio/workflow';
import type * as activities from './activities';
import {Bill, Distance, OrderConfirmation, PizzaOrder} from './shared';

const { defaultLogger } = proxySinks<LoggerSinks>();


const { sendBill, getDistance } = proxyActivities<typeof activities>({
  startToCloseTimeout: '5 seconds',
  retry: {
		maximumInterval: '10 seconds',
  }
});

export async function pizzaWorkflow(order: PizzaOrder): Promise<OrderConfirmation> {

  let distance: Distance = {Kilometers: 0};
  let totalPrice  = 0;

  for (const pizza of order.Items) {
    totalPrice += pizza.Price;
  }

  try {
    distance = await getDistance(order.Address)
  } catch (e) {
    defaultLogger.error('Unable to get distance', {});
    throw e;
  }

	if (order.IsDelivery && distance.Kilometers > 25) {
		throw new Error("Customer lives too far away for delivery")
	}

	// We use a short Timer duration here to avoid delaying the exercise
  await sleep('3 seconds');

	const bill: Bill = {
		CustomerID:  order.Customer.CustomerID,
		OrderNumber: order.OrderNumber,
		Amount:      totalPrice,
		Description: "Pizza",
	}

  try {
    return await sendBill(bill)
  } catch (e) {
    defaultLogger.error('Unable to bill customer', {});
    throw e;
	}

}
