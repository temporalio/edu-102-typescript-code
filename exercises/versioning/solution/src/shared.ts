export const TaskQueueName = "loan-processing-workflow-taskqueue"

export interface ChargeInput {
  CustomerID:      string;
  Amount:          number;
  PeriodNumber:    number;
  NumberOfPeriods: number;
}

