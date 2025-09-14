
import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { Investment, InvestmentFormData } from '../types';
import api from '../services/api';
import { INVESTMENT_CATEGORIES } from '../constants';

interface InvestmentFormProps {
  investment: Investment | null;
  onSuccess: () => void;
}

const InvestmentForm: React.FC<InvestmentFormProps> = ({ investment, onSuccess }) => {
  const { user } = useUser();
  const [formData, setFormData] = useState<InvestmentFormData>({
    amount: 0,
    category: INVESTMENT_CATEGORIES[0],
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (investment) {
      setFormData({
        amount: investment.amount,
        category: investment.category,
        date: new Date(investment.date).toISOString().split('T')[0],
        notes: investment.notes,
      });
    }
  }, [investment]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (investment) {
        await api.updateInvestment(investment.id, user.id, formData);
      } else {
        await api.addInvestment(user.id, formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save investment:', error);
      alert('Could not save investment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Amount</label>
        <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} required step="0.01" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
        <select id="category" name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
          {INVESTMENT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Date</label>
        <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Notes</label>
        <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"></textarea>
      </div>
      <div className="flex justify-end pt-2">
        <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-primary-700 disabled:bg-primary-300 transition-colors">
          {isSubmitting ? 'Saving...' : 'Save Investment'}
        </button>
      </div>
    </form>
  );
};

export default InvestmentForm;
