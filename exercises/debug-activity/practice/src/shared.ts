export const TaskQueueName = "pizza-tasks";

export interface Address {
  Line1: string;
  Line2: string;
  City: string;
  State: string;
  PostalCode: string;
}

export interface Customer {
  CustomerID: number;
  Name: string;
  Email: string;
  Phone: string;
}

export interface Pizza {
  Description: string;
  Price: number;
}

export interface PizzaOrder {
  OrderNumber: string;
  Customer: Customer;
  Items: Pizza[];
  IsDelivery: boolean;
  Address: Address;
}

export interface Distance {
  Kilometers: number;
}

export interface Bill {
  CustomerID: number;
  OrderNumber: string;
  Description: string;
  Amount: number;
}

export interface OrderConfirmation {
  OrderNumber: string;
  Status: string;
  ConfirmationNumber: string;
  BillingTimestamp: number;
  Amount: number;
}
