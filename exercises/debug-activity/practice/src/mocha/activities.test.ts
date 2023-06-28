import { MockActivityEnvironment } from '@temporalio/testing';
import {  before, describe, it } from 'mocha';
import { Runtime, DefaultLogger, LogEntry } from '@temporalio/worker';
import * as activities from '../activities';
import assert from 'assert';

import {Address, Bill, Distance, OrderConfirmation } from '../shared';

describe('activities', () => {
  before(() => {
    try {
      Runtime.install({
        logger: new DefaultLogger('WARN', (entry: LogEntry) => console.log(`[${entry.level}]`, entry.message)),
      });
    } catch (err: any) {
      if (err.name === 'IllegalStateError') {
        console.log('Logger is already configured');
      }
    }
  });


  it('successfully gets distance with two line address', async () => {
    const env = new MockActivityEnvironment();
    const input: Address = {
      Line1:      "701 Mission Street",
      Line2:      "Apartment 9C",
      City:       "San Francisco",
      State:      "CA",
      PostalCode: "94103",
    };
    const result: Distance  = await env.run(activities.getDistance, input);
    assert.equal(result.Kilometers, 20);
  });

  it('successfully gets distance with one line address', async () => {
    const env = new MockActivityEnvironment();
    const input: Address  = {
      Line1:      "917 Delores Street",
      Line2:      "",
      City:       "San Francisco",
      State:      "CA",
      PostalCode: "94103",
    };
    const result: Distance = await env.run(activities.getDistance, input);
    assert.equal(result.Kilometers, 8);
  });

  it('sends a bill for a typical order', async () => {
    const env = new MockActivityEnvironment();
    const input: Bill = {
      CustomerID:  12983,
      OrderNumber: "PI314",
      Description: "2 large cheese pizzas",
      Amount:      2600,
    };
    const confirmation: OrderConfirmation = await env.run(activities.sendBill, input);
    assert.equal(confirmation.OrderNumber, input.OrderNumber);
    assert.equal(confirmation.Amount, input.Amount);
  });

});
