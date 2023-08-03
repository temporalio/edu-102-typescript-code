import { TestWorkflowEnvironment } from '@temporalio/testing';
import { after, afterEach, before, describe, it } from 'mocha';
import { Worker, Runtime, DefaultLogger, LogEntry } from '@temporalio/worker';
import sinon from 'sinon';
import assert from 'assert';
import { Distance, Address, Customer, Pizza, PizzaOrder, OrderConfirmation, TaskQueueName } from '../shared';
import { pizzaWorkflow } from '../workflows';
import * as activities from '../activities';

describe('pizza workflow', async () => {
  let testEnv: TestWorkflowEnvironment;

  before(async () => {
    // Use console.log instead of console.error to avoid red output
    // Filter INFO log messages for clearer test output

    try {
      Runtime.install({
        logger: new DefaultLogger('WARN', (entry: LogEntry) => console.log(`[${entry.level}]`, entry.message)),
      });
    } catch (err: any) {
      if (err.name === 'IllegalStateError') {
        console.log('Logger is already configured');
      }
    }
    testEnv = await TestWorkflowEnvironment.createTimeSkipping();
  });

  after(async () => {
    await testEnv?.teardown();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('successfully orders a pizza', async () => {
    console.log('starting');
    const { client, nativeConnection } = testEnv;

    const distance: Distance = { Kilometers: 10 };
    const order = createPizzaOrder();
    const confirmation: OrderConfirmation = {
      OrderNumber: order.OrderNumber,
      ConfirmationNumber: 'AB9923',
      Status: 'SUCCESS',
      BillingTimestamp: Math.floor(Date.now() / 1000),
      Amount: 2500,
    };

    sinon.stub(activities, 'getDistance').resolves(distance);
    sinon.stub(activities, 'sendBill').resolves(confirmation);

    const worker = await Worker.create({
      connection: nativeConnection,
      taskQueue: TaskQueueName,
      workflowsPath: require.resolve('../workflows'),
      activities,
    });

    await worker.runUntil(async () => {
      console.log('running workflow');
      console.log(order);
      const result = await client.workflow.execute(pizzaWorkflow, {
        args: [order],
        workflowId: 'test-pizza',
        taskQueue: TaskQueueName,
      });

      assert.equal(result.OrderNumber, confirmation.OrderNumber);
    });
  }).timeout(10_000);
});

function createPizzaOrder(): PizzaOrder {
  const customer: Customer = {
    CustomerID: 12983,
    Name: 'María García',
    Email: 'maria1985@example.com',
    Phone: '415-555-7418',
  };

  const address: Address = {
    Line1: '701 Mission Street',
    Line2: 'Apartment 9C',
    City: 'San Francisco',
    State: 'CA',
    PostalCode: '94103',
  };

  const p1: Pizza = {
    Description: 'Large, with pepperoni',
    Price: 1500,
  };

  const p2: Pizza = {
    Description: 'Small, with mushrooms and onions',
    Price: 1000,
  };

  const items: Pizza[] = [p1, p2];

  const order: PizzaOrder = {
    OrderNumber: 'Z1238',
    Customer: customer,
    Items: items,
    Address: address,
    IsDelivery: true,
  };

  return order;
}
