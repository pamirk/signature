import { PlanTypes } from './Billing';
import { User } from './User';

export enum CancellationType {
  TRIAL = 'trial',
  SUBSCRIPTION = 'subscription',
}

export enum CancellationReason {
  TESTING_THE_SERVICE = 'testing_the_service',
  DIFFICULT_TO_USE = 'difficult_to_use',
  PRICING = 'pricing',
  NOT_ENOUGH_USE = 'not_enough_use',
  HAVING_A_BREAK = 'having_a_break',
  FINANCIAL_TROUBLE = 'financial_trouble',
  OTHER = 'other',
}

export interface UserFeedback {
  id: string;
  userId: User['id'];
  user?: User;
  cancellationType: CancellationType;
  cancellationReason: CancellationReason;
  plan?: PlanTypes;
  comment?: string;
  numberOfMonths?: number;
  numberOfUsers: number;
  numberOfSignatureRequestsSent: number;
  plannedReturnDate?: string;
  createdAt: string;
}
