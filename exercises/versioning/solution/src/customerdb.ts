export interface CustomerInfo  {
	CustomerID:      string;
	Name:            string;
	EmailAddress:    string;
	Amount:          number;
	NumberOfPeriods: number;
}


interface CustomerInfoDatabase {
  Get(customerID: string): CustomerInfo | null;
}

class SimpleCustomerMap implements CustomerInfoDatabase {
  private customers: Record<string, CustomerInfo>;

  constructor() {
    this.customers = {};
    this.populate();
  }

  private populate() {
    const customer01: CustomerInfo = {
      CustomerID: "a100",
      Name: "Ana Garcia",
      EmailAddress: "ana@example.com",
      Amount: 500,
      NumberOfPeriods: 10,
    };

    const customer02: CustomerInfo = {
      CustomerID: "a101",
      Name: "Amit Singh",
      EmailAddress: "asingh@example.com",
      Amount: 250,
      NumberOfPeriods: 15,
    };

    const customer03: CustomerInfo = {
      CustomerID: "a102",
      Name: "Mary O'Connor",
      EmailAddress: "marymo@example.com",
      Amount: 425,
      NumberOfPeriods: 12,
    };

    this.customers[customer01.CustomerID] = customer01;
    this.customers[customer02.CustomerID] = customer02;
    this.customers[customer03.CustomerID] = customer03;
  }

  public Get(customerID: string): CustomerInfo | null {
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
