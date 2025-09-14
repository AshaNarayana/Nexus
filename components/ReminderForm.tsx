
import React, { useState } from 'react';
import { useUser } from '../hooks/useUser';
import { ReminderFormData } from '../types';
import api from '../services/api';

interface ReminderFormProps {
  onSuccess: () => void;
}

const ReminderForm: React.FC<ReminderFormProps> = ({ onSuccess }) => {
  const { user } = useUser();
  const [formData, setFormData] = useState<ReminderFormData>({
    note: '',
    due_date: new Date().toISOString().split('T')[0],
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
      await api.addReminder(user.id, formData);
      onSuccess();
    } catch (error) {
      console.error('Failed to save reminder:', error);
      alert('Could not save reminder. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="note" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Note</label>
        <textarea id="note" name="note" value={formData.note} onChange={handleChange} required rows={3} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"></textarea>
      </div>
      <div>
        <label htmlFor="due_date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Due Date</label>
        <input type="date" id="due_date" name="due_date" value={formData.due_date} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
      </div>
      <div className="flex justify-end pt-2">
        <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-primary-700 disabled:bg-primary-300 transition-colors">
          {isSubmitting ? 'Saving...' : 'Save Reminder'}
        </button>
      </div>
    </form>
  );
};

export default ReminderForm;
