import { proxyActivities, log, sleep } from '@temporalio/workflow';
import type * as activities from './activities';
import { Distance, OrderConfirmation, PizzaOrder } from './shared';

const { sendBill, getDistance } = proxyActivities<typeof activities>({
  startToCloseTimeout: '5 seconds',
  retry: {
    maximumInterval: '10 seconds',
  },
});

export async function pizzaWorkflow(order: PizzaOrder): Promise<OrderConfirmation> {
  let distance: Distance | undefined = undefined;
  let totalPrice = 0;

  for (const pizza of order.items) {
    totalPrice += pizza.price;
  }

  try {
    distance = await getDistance(order.address);
  } catch (e) {
    log.error('Unable to get distance', {});
    throw e;
  }

  if (order.isDelivery && distance.kilometers > 25) {
    throw new Error('Customer lives too far away for delivery');
  }

  // We use a short Timer duration here to avoid delaying the exercise
  await sleep('3 seconds');

  const bill = {
    customerID: order.customer.customerID,
    orderNumber: order.orderNumber,
    amount: totalPrice,
    description: 'Pizza',
  };

  try {
    return await sendBill(bill);
  } catch (e) {
    log.error('Unable to bill customer', {});
    throw e;
  }
}
