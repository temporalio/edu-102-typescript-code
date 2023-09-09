import { MockActivityEnvironment } from '@temporalio/testing';
import { describe, it } from 'mocha';
import * as activities from '../activities';
import { Distance, OrderConfirmation } from '../shared';
import assert from 'assert';

describe('activities', () => {
  it('successfully gets distance with two line address', async () => {
    const env = new MockActivityEnvironment();
    const input = {
      line1: '701 Mission Street',
      line2: 'Apartment 9C',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94103',
    };
    const result: Distance = await env.run(activities.getDistance, input);
    assert.equal(result.kilometers, 20);
  });

  it('successfully gets distance with one line address', async () => {
    const env = new MockActivityEnvironment();
    const input = {
      line1: '917 Delores Street',
      line2: '',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94103',
    };
    const result: Distance = await env.run(activities.getDistance, input);
    assert.equal(result.kilometers, 8);
  });

  it('sends a bill for a typical order', async () => {
    const env = new MockActivityEnvironment();
    const input = {
      customerID: 12983,
      orderNumber: 'PI314',
      description: '2 large cheese pizzas',
      amount: 2600,
    };
    const confirmation: OrderConfirmation = await env.run(activities.sendBill, input);
    assert.equal(confirmation.orderNumber, input.orderNumber);
    assert.equal(confirmation.amount, input.amount);
  });

  it('sends a bill and applies discount', async () => {
    const env = new MockActivityEnvironment();
    const input = {
      customerID: 12983,
      orderNumber: 'PI314',
      description: '5 large cheese pizzas',
      amount: 6500,
    };
    const confirmation: OrderConfirmation = await env.run(activities.sendBill, input);
    assert.equal(confirmation.orderNumber, input.orderNumber);
    assert.equal(confirmation.amount, 6000);
  });

  it('fails to send bill with negative amount', async () => {
    const env = new MockActivityEnvironment();
    const input = {
      customerID: 21974,
      orderNumber: 'OU812',
      description: '1 large sausage pizza',
      amount: -1000,
    };
    try {
      await env.run(activities.sendBill, input);
    } catch (err: any) {
      assert(err.message.includes('invalid charge amount: -1000 (must be above zero)'));
    }
  });
});
