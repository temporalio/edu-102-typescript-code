export interface CustomerInfo {
  customerID: string;
  name: string;
  emailAddress: string;
  amount: number;
  numberOfPeriods: number;
}

interface CustomerInfoDatabase {
  get(customerID: string): CustomerInfo | null;
}

class SimpleCustomerMap implements CustomerInfoDatabase {
  private customers: Record<string, CustomerInfo>;

  constructor() {
    this.customers = {};
    this.populate();
  }

  private populate() {
    const customer01 = {
      customerID: 'a100',
      name: 'Ana Garcia',
      emailAddress: 'ana@example.com',
      amount: 500,
      numberOfPeriods: 10,
    };

    const customer02 = {
      customerID: 'a101',
      name: 'Amit Singh',
      emailAddress: 'asingh@example.com',
      amount: 250,
      numberOfPeriods: 15,
    };

    const customer03 = {
      customerID: 'a102',
      name: "Mary O'Connor",
      emailAddress: 'marymo@example.com',
      amount: 425,
      numberOfPeriods: 12,
    };

    this.customers[customer01.customerID] = customer01;
    this.customers[customer02.customerID] = customer02;
    this.customers[customer03.customerID] = customer03;
  }

  public get(customerID: string): CustomerInfo | null {
    const customer = this.customers[customerID];
    if (!customer) {
      return null;
    }
    return customer;
  }
}

export function customerDB(): CustomerInfoDatabase {
  return new SimpleCustomerMap();
}
