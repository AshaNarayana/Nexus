
import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../hooks/useUser';
import api from '../services/api';
import { Expense } from '../types';
import Modal from '../components/Modal';
import ExpenseForm from '../components/ExpenseForm';
import { Plus, Edit, Trash2 } from 'lucide-react';

const MyExpensesPage: React.FC = () => {
  const { user } = useUser();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const fetchExpenses = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.getExpenses(user.id);
      setExpenses(data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleAddExpense = () => {
    setEditingExpense(null);
    setModalOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setModalOpen(true);
  };

  const handleDeleteExpense = async (expenseId: number) => {
    if (user && window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await api.deleteExpense(expenseId, user.id);
        fetchExpenses();
      } catch (error) {
        console.error('Failed to delete expense:', error);
        alert('Could not delete expense.');
      }
    }
  };

  const handleFormSuccess = () => {
    setModalOpen(false);
    fetchExpenses();
  };

  if (loading) {
    return <div className="text-center p-10">Loading expenses...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">My Expenses</h1>
        <button onClick={handleAddExpense} className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-primary-700 transition-colors">
          <Plus size={20} className="mr-2" />
          Add Expense
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-md">
        {expenses.length > 0 ? (
          <ul className="divide-y divide-slate-200 dark:divide-slate-700">
            {expenses.map((expense) => (
              <li key={expense.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="flex-1">
                  <div className="flex items-center">
                     <span className="text-xl font-bold text-primary-500">€{expense.amount.toFixed(2)}</span>
                     <span className="ml-4 text-sm font-semibold text-slate-600 dark:text-slate-300">{expense.category}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">{expense.notes}</p>
                   <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{new Date(expense.date).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-2 mt-3 sm:mt-0">
                  <button onClick={() => handleEditExpense(expense)} className="p-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDeleteExpense(expense.id)} className="p-2 text-slate-500 hover:text-red-600 dark:hover:text-red-400">
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-slate-500 dark:text-slate-400 py-8">You haven't recorded any expenses yet.</p>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h2>
        <ExpenseForm expense={editingExpense} onSuccess={handleFormSuccess} />
      </Modal>
    </div>
  );
};

export default MyExpensesPage;
