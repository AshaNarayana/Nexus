
export interface User {
  id: number;
  username: string;
}

export interface Expense {
  id: number;
  user_id: number;
  amount: number;
  category: string;
  notes: string;
  date: string; // ISO string format
}

export interface Investment {
  id: number;
  user_id: number;
  amount: number;
  category: string;
  notes: string;
  date: string; // ISO string format
}

export interface Goal {
  id: number;
  user_id: number;
  title: string;
  description: string;
  target_date: string; // ISO string format
}

export interface Reminder {
  id: number;
  user_id: number;
  note: string;
  due_date: string; // ISO string format
}

export type ExpenseFormData = Omit<Expense, 'id' | 'user_id'>;
export type InvestmentFormData = Omit<Investment, 'id' | 'user_id'>;
export type GoalFormData = Omit<Goal, 'id' | 'user_id'>;
export type ReminderFormData = Omit<Reminder, 'id' | 'user_id'>;
