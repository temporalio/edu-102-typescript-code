import { Connection, Client } from '@temporalio/client';
import { pizzaWorkflow } from './workflows';
import { Address, Customer, Pizza, PizzaOrder, TaskQueueName } from './shared';

async function run() {
  const connection = await Connection.connect({ address: 'localhost:7233' });

  const client = new Client({
    connection,
  });

  const order = createPizzaOrder();

  const handle = await client.workflow.start(pizzaWorkflow, {
    args: [order],
    taskQueue: TaskQueueName,
    workflowId: `pizza-workflow-order-${order.OrderNumber},`,
  });

  console.log(`Started workflow ${handle.workflowId}`);

  console.log(await handle.result());
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
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
    Description: 'Large, with mushrooms and onions',
    Price: 1500,
  };

  const p2: Pizza = {
    Description: 'Small, with pepperoni',
    Price: 1200,
  };

  // TODO: define a struct representing an additional pizza

  // TODO: add the variable for that struct to this array
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
