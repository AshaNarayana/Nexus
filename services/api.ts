
import { User, Expense, Goal, Reminder, Investment, ExpenseFormData, GoalFormData, ReminderFormData, InvestmentFormData } from '../types';
import { USERS } from '../constants';

const SIMULATED_DELAY = 500;

class MockApiService {
  private get<T,>(key: string, defaultValue: T): T {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key “${key}”:`, error);
      return defaultValue;
    }
  }

  private set<T,>(key: string, value: T): void {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  }

  private seedData(): void {
    const seeded = this.get('seeded', false);
    if (!seeded) {
      const today = new Date();
      const expenses: Expense[] = [
        { id: 1, user_id: 1, amount: 75.50, category: 'Groceries', notes: 'Weekly shopping', date: new Date(today.setDate(today.getDate() - 5)).toISOString() },
        { id: 2, user_id: 2, amount: 120.00, category: 'Utilities', notes: 'Electricity bill', date: new Date(today.setDate(today.getDate() - 10)).toISOString() },
        { id: 3, user_id: 1, amount: 45.00, category: 'Dining Out', notes: 'Dinner with friends', date: new Date(today.setDate(today.getDate() - 2)).toISOString() },
        { id: 4, user_id: 2, amount: 30.00, category: 'Transportation', notes: 'Gas for car', date: new Date(today.setDate(today.getDate() - 3)).toISOString() },
      ];
       const investments: Investment[] = [
        { id: 1, user_id: 1, amount: 500, category: 'Stocks', notes: 'Invested in AAPL', date: new Date(today.setDate(today.getDate() - 15)).toISOString() },
        { id: 2, user_id: 2, amount: 1000, category: 'Cryptocurrency', notes: 'Bought Bitcoin', date: new Date(today.setDate(today.getDate() - 20)).toISOString() },
      ];
      const goals: Goal[] = [
        { id: 1, user_id: 1, title: 'Save for vacation', description: 'Save €1000 for a trip to Hawaii', target_date: new Date(today.getFullYear(), today.getMonth() + 3, 1).toISOString() },
        { id: 2, user_id: 2, title: 'Learn React Native', description: 'Complete a full course by end of the year', target_date: new Date(today.getFullYear(), 11, 31).toISOString() },
      ];
      const reminders: Reminder[] = [
        { id: 1, user_id: 1, note: 'Pay credit card bill', due_date: new Date(today.getFullYear(), today.getMonth(), 25).toISOString() },
        { id: 2, user_id: 2, note: 'Doctor\'s appointment', due_date: new Date(today.getFullYear(), today.getMonth() + 1, 5).toISOString() },
      ];

      this.set('expenses', expenses);
      this.set('investments', investments);
      this.set('goals', goals);
      this.set('reminders', reminders);
      this.set('seeded', true);
    }
  }

  constructor() {
    this.seedData();
  }

  private async simulateRequest<T,>(data: T): Promise<T> {
    return new Promise(resolve => setTimeout(() => resolve(data), SIMULATED_DELAY));
  }

  // Expenses
  async getExpenses(userId: number): Promise<Expense[]> {
    const allExpenses = this.get<Expense[]>('expenses', []);
    const userExpenses = allExpenses.filter(e => e.user_id === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return this.simulateRequest(userExpenses);
  }

  async getAllExpenses(): Promise<Expense[]> {
    const allExpenses = this.get<Expense[]>('expenses', []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return this.simulateRequest(allExpenses);
  }

  async addExpense(userId: number, expenseData: ExpenseFormData): Promise<Expense> {
    const allExpenses = this.get<Expense[]>('expenses', []);
    const newExpense: Expense = {
      id: Date.now(),
      user_id: userId,
      ...expenseData
    };
    const updatedExpenses = [...allExpenses, newExpense];
    this.set('expenses', updatedExpenses);
    return this.simulateRequest(newExpense);
  }

  async updateExpense(expenseId: number, userId: number, expenseData: Partial<ExpenseFormData>): Promise<Expense> {
    const allExpenses = this.get<Expense[]>('expenses', []);
    const expenseIndex = allExpenses.findIndex(e => e.id === expenseId && e.user_id === userId);
    if (expenseIndex === -1) throw new Error("Expense not found or user mismatch");
    
    const updatedExpense = { ...allExpenses[expenseIndex], ...expenseData };
    allExpenses[expenseIndex] = updatedExpense;
    this.set('expenses', allExpenses);
    return this.simulateRequest(updatedExpense);
  }

  async deleteExpense(expenseId: number, userId: number): Promise<void> {
    let allExpenses = this.get<Expense[]>('expenses', []);
    const initialLength = allExpenses.length;
    allExpenses = allExpenses.filter(e => !(e.id === expenseId && e.user_id === userId));
    if (allExpenses.length === initialLength) throw new Error("Expense not found or user mismatch");
    
    this.set('expenses', allExpenses);
    return this.simulateRequest(undefined);
  }

  // Investments
  async getInvestments(userId: number): Promise<Investment[]> {
    const allInvestments = this.get<Investment[]>('investments', []);
    const userInvestments = allInvestments.filter(i => i.user_id === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return this.simulateRequest(userInvestments);
  }

  async getAllInvestments(): Promise<Investment[]> {
    const allInvestments = this.get<Investment[]>('investments', []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return this.simulateRequest(allInvestments);
  }

  async addInvestment(userId: number, investmentData: InvestmentFormData): Promise<Investment> {
    const allInvestments = this.get<Investment[]>('investments', []);
    const newInvestment: Investment = {
      id: Date.now(),
      user_id: userId,
      ...investmentData
    };
    const updatedInvestments = [...allInvestments, newInvestment];
    this.set('investments', updatedInvestments);
    return this.simulateRequest(newInvestment);
  }

  async updateInvestment(investmentId: number, userId: number, investmentData: Partial<InvestmentFormData>): Promise<Investment> {
    const allInvestments = this.get<Investment[]>('investments', []);
    const investmentIndex = allInvestments.findIndex(i => i.id === investmentId && i.user_id === userId);
    if (investmentIndex === -1) throw new Error("Investment not found or user mismatch");
    
    const updatedInvestment = { ...allInvestments[investmentIndex], ...investmentData };
    allInvestments[investmentIndex] = updatedInvestment;
    this.set('investments', allInvestments);
    return this.simulateRequest(updatedInvestment);
  }

  async deleteInvestment(investmentId: number, userId: number): Promise<void> {
    let allInvestments = this.get<Investment[]>('investments', []);
    const initialLength = allInvestments.length;
    allInvestments = allInvestments.filter(i => !(i.id === investmentId && i.user_id === userId));
    if (allInvestments.length === initialLength) throw new Error("Investment not found or user mismatch");
    
    this.set('investments', allInvestments);
    return this.simulateRequest(undefined);
  }

  // Goals
  async getGoals(userId: number): Promise<Goal[]> {
    const allGoals = this.get<Goal[]>('goals', []);
    return this.simulateRequest(allGoals.filter(g => g.user_id === userId));
  }
  
  async addGoal(userId: number, goalData: GoalFormData): Promise<Goal> {
    const allGoals = this.get<Goal[]>('goals', []);
    const newGoal: Goal = { id: Date.now(), user_id: userId, ...goalData };
    this.set('goals', [...allGoals, newGoal]);
    return this.simulateRequest(newGoal);
  }

  async deleteGoal(goalId: number, userId: number): Promise<void> {
    let allGoals = this.get<Goal[]>('goals', []);
    this.set('goals', allGoals.filter(g => !(g.id === goalId && g.user_id === userId)));
    return this.simulateRequest(undefined);
  }

  // Reminders
  async getReminders(userId: number): Promise<Reminder[]> {
    const allReminders = this.get<Reminder[]>('reminders', []);
    return this.simulateRequest(allReminders.filter(r => r.user_id === userId));
  }
  
  async addReminder(userId: number, reminderData: ReminderFormData): Promise<Reminder> {
    const allReminders = this.get<Reminder[]>('reminders', []);
    const newReminder: Reminder = { id: Date.now(), user_id: userId, ...reminderData };
    this.set('reminders', [...allReminders, newReminder]);
    return this.simulateRequest(newReminder);
  }

  async deleteReminder(reminderId: number, userId: number): Promise<void> {
    let allReminders = this.get<Reminder[]>('reminders', []);
    this.set('reminders', allReminders.filter(r => !(r.id === reminderId && r.user_id === userId)));
    return this.simulateRequest(undefined);
  }
}

const api = new MockApiService();
export default api;
