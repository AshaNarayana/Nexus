
import React, { useState } from 'react';
import { useUser } from '../hooks/useUser';
import { GoalFormData } from '../types';
import api from '../services/api';

interface GoalFormProps {
  onSuccess: () => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ onSuccess }) => {
  const { user } = useUser();
  const [formData, setFormData] = useState<GoalFormData>({
    title: '',
    description: '',
    target_date: new Date().toISOString().split('T')[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await api.addGoal(user.id, formData);
      onSuccess();
    } catch (error) {
      console.error('Failed to save goal:', error);
      alert('Could not save goal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"></textarea>
      </div>
      <div>
        <label htmlFor="target_date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Target Date</label>
        <input type="date" id="target_date" name="target_date" value={formData.target_date} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
      </div>
      <div className="flex justify-end pt-2">
        <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-primary-700 disabled:bg-primary-300 transition-colors">
          {isSubmitting ? 'Saving...' : 'Save Goal'}
        </button>
      </div>
    </form>
  );
};

export default GoalForm;
