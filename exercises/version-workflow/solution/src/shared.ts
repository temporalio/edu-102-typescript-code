export const TaskQueueName = 'loan-processing-workflow-taskqueue';

export interface ChargeInput {
  customerID: string;
  amount: number;
  periodNumber: number;
  numberOfPeriods: number;
}
