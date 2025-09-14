
import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../hooks/useUser';
import api from '../services/api';
import { Investment } from '../types';
import Modal from '../components/Modal';
import InvestmentForm from '../components/InvestmentForm';
import { Plus, Edit, Trash2 } from 'lucide-react';

const MyInvestmentsPage: React.FC = () => {
  const { user } = useUser();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);

  const fetchInvestments = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.getInvestments(user.id);
      setInvestments(data);
    } catch (error) {
      console.error("Failed to fetch investments:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  const handleAddInvestment = () => {
    setEditingInvestment(null);
    setModalOpen(true);
  };

  const handleEditInvestment = (investment: Investment) => {
    setEditingInvestment(investment);
    setModalOpen(true);
  };

  const handleDeleteInvestment = async (investmentId: number) => {
    if (user && window.confirm('Are you sure you want to delete this investment?')) {
      try {
        await api.deleteInvestment(investmentId, user.id);
        fetchInvestments();
      } catch (error) {
        console.error('Failed to delete investment:', error);
        alert('Could not delete investment.');
      }
    }
  };

  const handleFormSuccess = () => {
    setModalOpen(false);
    fetchInvestments();
  };

  if (loading) {
    return <div className="text-center p-10">Loading investments...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">My Investments</h1>
        <button onClick={handleAddInvestment} className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-primary-700 transition-colors">
          <Plus size={20} className="mr-2" />
          Add Investment
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-md">
        {investments.length > 0 ? (
          <ul className="divide-y divide-slate-200 dark:divide-slate-700">
            {investments.map((investment) => (
              <li key={investment.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="flex-1">
                  <div className="flex items-center">
                     <span className="text-xl font-bold text-emerald-500">€{investment.amount.toFixed(2)}</span>
                     <span className="ml-4 text-sm font-semibold text-slate-600 dark:text-slate-300">{investment.category}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">{investment.notes}</p>
                   <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{new Date(investment.date).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-2 mt-3 sm:mt-0">
                  <button onClick={() => handleEditInvestment(investment)} className="p-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDeleteInvestment(investment.id)} className="p-2 text-slate-500 hover:text-red-600 dark:hover:text-red-400">
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-slate-500 dark:text-slate-400 py-8">You haven't recorded any investments yet.</p>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">{editingInvestment ? 'Edit Investment' : 'Add New Investment'}</h2>
        <InvestmentForm investment={editingInvestment} onSuccess={handleFormSuccess} />
      </Modal>
    </div>
  );
};

export default MyInvestmentsPage;
