import { TestWorkflowEnvironment } from '@temporalio/testing';
import { after, afterEach, before, describe, it } from 'mocha';
import { Worker } from '@temporalio/worker';
import sinon from 'sinon';
import assert from 'assert';
import { Pizza, PizzaOrder, TASK_QUEUE_NAME } from '../shared';
import { pizzaWorkflow } from '../workflows';
import * as activities from '../activities';

describe('pizza workflow', async () => {
  let testEnv: TestWorkflowEnvironment;

  before(async () => {
    testEnv = await TestWorkflowEnvironment.createLocal();
  });

  after(async () => {
    await testEnv?.teardown();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('successfully orders a pizza', async () => {
    const { client, nativeConnection } = testEnv;

    const distance = { kilometers: 10 };
    const order = createPizzaOrder();
    const confirmation = {
      orderNumber: order.orderNumber,
      confirmationNumber: 'AB9923',
      status: 'SUCCESS',
      billingTimestamp: Math.floor(Date.now() / 1000),
      amount: 2500,
    };

    sinon.stub(activities, 'getDistance').resolves(distance);
    sinon.stub(activities, 'sendBill').resolves(confirmation);

    const worker = await Worker.create({
      connection: nativeConnection,
      taskQueue: TASK_QUEUE_NAME,
      workflowsPath: require.resolve('../workflows'),
      activities,
    });

    const result = await worker.runUntil(
      client.workflow.execute(pizzaWorkflow, {
        args: [order],
        workflowId: 'test-pizza',
        taskQueue: TASK_QUEUE_NAME,
      })
    );
    assert.equal(result.orderNumber, confirmation.orderNumber);
  }).timeout(10_000);
});

function createPizzaOrder(): PizzaOrder {
  const customer = {
    customerID: 12983,
    name: 'María García',
    email: 'maria1985@example.com',
    phone: '415-555-7418',
  };

  const address = {
    line1: '701 Mission Street',
    line2: 'Apartment 9C',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94103',
  };

  const p1 = {
    description: 'Large, with pepperoni',
    price: 1500,
  };

  const p2 = {
    description: 'Small, with mushrooms and onions',
    price: 1000,
  };

  const items: Pizza[] = [p1, p2];

  const order = {
    orderNumber: 'Z1238',
    customer,
    items,
    address,
    isDelivery: true,
  };

  return order;
}
